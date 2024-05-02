import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Alert,
  IconButton,
} from "@material-tailwind/react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { useLocation } from "react-router-dom";
import BingoCardStatic from "../../components/BingoCard";
import io from "socket.io-client";
import bingoRoomService from "../../services/bingoRoomService";
import bingoService from "../../services/bingoService";
import bingoCardboardService from "../../services/bingoCardboardService";
import { TabsSection } from "./components/TabsSetion";
import { MessageDialog } from "./components/MessageDialog";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

async function generateRandomAlphanumeric(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code;
  let existingCardboards;
  do {
    code = "";
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    // Verificar si el código ya existe en la base de datos
    existingCardboards = await bingoCardboardService.findCardboardByField(
      "cardboard_code",
      code
    );
    console.log(existingCardboards.response.data.status);
    // Si el código ya existe, generar uno nuevo
  } while (existingCardboards.response.data.status === "Success");
  return code;
}

export const RoomPageV1 = () => {
  const [bingoConfig, setBingoConfig] = useState(null);

  // Variables usadas en BingoCard
  const [bingoCard, setBingoCard] = useState(
    JSON.parse(localStorage.getItem("userId"))
      ? JSON.parse(localStorage.getItem("bingoCard"))
      : [""]
  );

  const [rows, setRows] = useState();

  const [markedSquares, setMarkedSquares] = useState([]);

  const [liveStreamPosition, setLiveStreamPosition] = useState({ x: 0, y: 0 });
  const [room, setRoom] = useState(null);
  const [ballotsHistory, setBallotsHistory] = useState([]);
  const [lastBallot, setLastBallot] = useState("");

  const [storageUserId, setStorageUserId] = useState(
    JSON.parse(localStorage.getItem("userId"))
      ? JSON.parse(localStorage.getItem("userId"))
      : ""
  );

  const [cardboardCode, setCardboardCode] = useState(
    JSON.parse(localStorage.getItem("cardboard_code"))
      ? JSON.parse(localStorage.getItem("cardboard_code"))
      : ""
  );

  const [cardboardId, setCardboardId] = useState();

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "lightBlue",
    message: "",
  });

  const location = useLocation();
  const { roomId, bingoId } = location.state || {};

  useEffect(() => {
    const getBingo = async () => {
      const response = await bingoService.getBingoById(bingoId);
      setBingoConfig(response);
      if (response) {
        generateBingoCard(
          response.bingo_values,
          response.dimensions,
          response.positions_disabled
        );
      }
    };
    getBingo();
    getBallotsHistory();
  }, [bingoId]);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.on("ballotUpdate", handleBallotUpdate);
    socket.on("sangBingo", handleSangBingo);

    return () => {
      socket.off("ballotUpdate", handleBallotUpdate);
      socket.off("sangBingo", handleSangBingo);
      socket.disconnect();
    };
  }, []);

  const handleBallotUpdate = (data) => {
    const updateDescription = data.updateDescription;
    if (updateDescription && updateDescription.updatedFields) {
      Object.keys(updateDescription.updatedFields).forEach((key) => {
        if (key.startsWith("history_of_ballots")) {
          if (updateDescription.updatedFields[key] != "") {
            setLastBallot(updateDescription.updatedFields[key]);
          }
          getBallotsHistory();
        }
        if (key.startsWith("bingoFigure")) {
          getBallotsHistory();
        }
      });
    }
  };

  const handleSangBingo = (data) => {
    const { userId, status } = data;
    let message, color;

    if (userId === storageUserId) {
      message =
        status === "Validando"
          ? "Estamos validando el bingo, ¡espera un momento!"
          : status
          ? "Felicidades! Eres el ganador del bingo."
          : "Lo sentimos, no has ganado, revisa las balotas.";
      color = status === "Validando" ? "gray" : status ? "green" : "red";
    } else {
      message =
        status === "Validando"
          ? "Alguien ha cantado bingo, ¡espera un momento!"
          : status
          ? "Alguien ha cantado bingo y es un ganador."
          : "Lo sentimos, no es un ganador esta vez.";
      color = status === "Validando" ? "gray" : status ? "green" : "red";
    }

    setAlertData({ color, message });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleBingoCall = async () => {
    try {
      await bingoRoomService.sangBingo(markedSquares, room._id, storageUserId);
    } catch (error) {
      console.error(error);
    }
  };

  const saveCardboard = async (playerName) => {
    const bingoId = bingoConfig._id;
    const cardboard_code = await generateRandomAlphanumeric(6);
    const game_card_values = bingoCard;
    const game_marked_squares = markedSquares;
    const storedUserId = localStorage.getItem("userId");

    try {
      const cardboardSaved = await bingoCardboardService.createCardboard({
        playerName,
        bingoId,
        cardboard_code,
        game_card_values,
        game_marked_squares,
      });
      setCardboardId(cardboardSaved.data._id);
      setStorageUserId(storedUserId || playerName);
      setCardboardCode(cardboard_code);
      localStorage.setItem("cardboard_code", JSON.stringify(cardboard_code));
    } catch (error) {
      console.error(error);
    }
  };

  const getExistingCardboard = async (code) => {
    const response = await bingoCardboardService.findCardboardByField(
      "cardboard_code",
      code
    );
    setStorageUserId(response.data.playerName);
    setCardboardCode(code);
    setCardboardId(response.data._id);
    setBingoCard(response.data.game_card_values);
    setMarkedSquares(response.data.game_marked_squares);
    localStorage.setItem("userId", JSON.stringify(response.data.playerName));
    localStorage.setItem("cardboard_code", JSON.stringify(code));
  };

  /**
   * Función para generar los valores del carton de bingo, priorizando posiciones deshabilitadas,
   * luego valores con posiciones asignadas y por ultimo valores sin posiciones
   * @param {*} values
   * @param {*} dimensions
   * @param {*} positionsDisabled
   */
  const generateBingoCard = (values, dimensions, positionsDisabled) => {
    const [rows, cols] = dimensions.split("x").map(Number);

    setRows(rows);

    if (storageUserId !== "" && cardboardCode !== "") {
      getExistingCardboard(cardboardCode);
    }

    let card = Array.from({ length: rows * cols }, () => ({
      value: null,
      _id: null,
      marked: false,
      default_image: null,
    }));

    let markedSquares = Array(rows * cols).fill({ isMarked: false, value: "" });

    // Aplicar posiciones deshabilitadas
    positionsDisabled.forEach((disabled) => {
      card[disabled.position] = {
        ...card[disabled.position],
        value: "Disabled",
        default_image: disabled.default_image,
        marked: true,
      };
      markedSquares[disabled.position] = { isMarked: true, value: "Disabled" };
    });

    // Mezclar los valores antes de separarlos
    let shuffledValues = shuffle(values);

    // Separar los valores en dos grupos: con posiciones y sin posiciones
    let valuesWithPositions = shuffledValues.filter(
      (value) => value.positions.length > 0
    );
    let valuesWithoutPositions = shuffledValues.filter(
      (value) => value.positions.length === 0
    );

    // Registro de valores ya asignados para evitar duplicados
    let assignedValues = new Set();

    // Asignar valores con posiciones específicas
    valuesWithPositions.forEach((value) => {
      value.positions.forEach((pos) => {
        if (
          pos >= 0 &&
          pos < rows * cols && // Verificar que la posición esté dentro del rango del cartón
          card[pos].value === null &&
          !assignedValues.has(value.carton_value)
        ) {
          card[pos] = {
            ...card[pos],
            value: value.carton_value,
            type: value.carton_type,
            _id: value._id,
          };
          assignedValues.add(value.carton_value);
        }
      });
    });

    // Asignar valores sin posiciones específicas
    valuesWithoutPositions.forEach((value) => {
      let availablePositions = card.flatMap((cell, index) =>
        cell.value === null ? index : []
      );
      if (availablePositions.length > 0) {
        let chosenPosition =
          availablePositions[
            Math.floor(Math.random() * availablePositions.length)
          ];
        if (!assignedValues.has(value.carton_value)) {
          card[chosenPosition] = {
            ...card[chosenPosition],
            value: value.carton_value,
            type: value.carton_type,
            _id: value._id,
          };
          assignedValues.add(value.carton_value);
        }
      }
    });

    setBingoCard(card);
    setMarkedSquares(markedSquares);
    localStorage.setItem("bingoCard", JSON.stringify(bingoCard));
  };

  const handleMarkSquare = (item, index) => {
    if (item.value !== "Disabled") {
      setMarkedSquares((currentMarks) => {
        const updatedMarks = currentMarks.map((marked, i) => {
          if (i === index) {
            return {
              isMarked: !marked.isMarked,
              value: item._id,
            };
          } else {
            return marked;
          }
        });
        updateMarkSquere(updatedMarks);
        return updatedMarks;
      });
    }
  };

  const updateMarkSquere = async (updatedMarks) => {
    await bingoCardboardService.updateCardboard(cardboardId, {
      game_marked_squares: updatedMarks,
    });
  };

  const getBallotsHistory = async () => {
    const roomData = await bingoRoomService.getRoomById(roomId);
    setRoom(roomData);
    setBallotsHistory(roomData.history_of_ballots);

    // Asignar la última balota del historial a lastBallot
    if (roomData.history_of_ballots.length > 0) {
      const lastBallotId =
        roomData.history_of_ballots[roomData.history_of_ballots.length - 1];
      setLastBallot(lastBallotId);
    }
  };

  // Transmisión arrastrable
  const handleDragEnd = (event) => {
    const { delta } = event;
    setLiveStreamPosition((prevPosition) => ({
      x: prevPosition.x + delta.x,
      y: prevPosition.y + delta.y,
    }));
  };

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="md:row md:flex-auto md:flex md:flex-col md:w-full  bg-gray-300 pt-2 px-2">
          <Card className="flex-none">
            <TabsSection
              bingoConfig={bingoConfig}
              lastBallot={lastBallot}
              ballotsHistory={ballotsHistory}
              room={room}
            />
          </Card>
        </div>
        <div className="flex flex-col h-auto w-full bg-gray-300 px-2 pt-2">
          {showAlert && (
            <Alert
              color={alertData.color}
              onClose={() => setShowAlert(false)}
              animate={{
                mount: { y: 0 },
                unmount: { y: 100 },
              }}
            >
              {alertData.message}
            </Alert>
          )}
          <div className="flex flex-auto  flex-col md:flex-row">
            {/* Columna para el cartón de bingo y botones */}
            <div className="flex flex-col md:w-3/5 h-auto mx-1 pb-2">
              <Card className="flex-none">
                <div className="shadow-lg p-2 flex justify-evenly items-center">
                  <Button
                    size="sm"
                    className="px-2 md:px-4"
                    color="green"
                    onClick={handleBingoCall}
                  >
                    Cantar Bingo
                  </Button>
                  <Button size="sm" className="px-2 md:px-4" color="blue">
                    Limpiar Cartón
                  </Button>
                  <Button size="sm" className="px-2 md:px-4" color="gray">
                    Chat
                  </Button>
                </div>
                <div className="w-full h-full">
                  {bingoConfig && (
                    <BingoCardStatic
                      bingoCard={bingoCard}
                      rows={rows}
                      bingoAppearance={bingoConfig.bingo_appearance}
                      markedSquares={markedSquares}
                      onMarkSquare={handleMarkSquare}
                    />
                  )}
                </div>
              </Card>
            </div>

            {/* Columna para la transmisión en vivo y datos del juego */}
            <div className="md:flex-auto md:flex md:flex-col md:w-3/4 h-auto mx-1">
              <Card className="h-full mb-4 md:mb-2 flex-1">
                <CardBody className="relative h-auto">
                  <SectionLiveStream
                    bingoConfig={bingoConfig}
                    playerName={storageUserId}
                    cardboardCode={cardboardCode}
                  />
                </CardBody>
              </Card>
            </div>
          </div>
          <DraggableLiveStream position={liveStreamPosition} />
        </div>
      </DndContext>
      <MessageDialog
        onSaveCardboard={saveCardboard}
        getExistingCardboard={getExistingCardboard}
      />
    </>
  );
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  // Mientras queden elementos a mezclar...
  while (currentIndex !== 0) {
    // Elegir un elemento restante...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // E intercambiarlo con el elemento actual.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const SectionLiveStream = ({ bingoConfig, playerName, cardboardCode }) => {
  // Componente para la transmisión en vivo
  return (
    <div>
      <section>
        {bingoConfig && (
          <Accordion title={bingoConfig?.title}>
            <Typography variant="small" className="mb-1">
              <strong>Código de cartón:</strong> {cardboardCode}
            </Typography>
            <Typography variant="small">
              <strong>Jugador:</strong> {playerName}
            </Typography>
          </Accordion>
        )}
      </section>
      <section className="hidden sm:block">
        <LiveStream />
      </section>
    </div>
  );
};

const LiveStream = () => {
  return (
    <>
      <Typography variant="h5">Transmisión</Typography>
    </>
  );
};

const DraggableLiveStream = ({ position }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "draggable-live-stream",
  });

  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: "transform 0.2s",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="absolute bottom-4 left-4 w-40 h-24 bg-black opacity-90 hover:opacity-100 z-10 md:hidden"
    >
      <LiveStream />
    </div>
  );
};

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1 bg-black rounded">
      <div
        className="flex justify-between cursor-pointer p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography
          variant="h6"
          color="white"
          className="uppercase text-sm md:text-base"
        >
          {title}
        </Typography>

        {!isOpen ? (
          <Typography
            variant="h6"
            color="white"
            className="text-sm md:text-base"
          >
            Ver más...
          </Typography>
        ) : (
          <Typography
            variant="h6"
            color="white"
            className="text-sm md:text-base"
          >
            Ocultar
          </Typography>
        )}
      </div>
      {isOpen && <div className="p-3 text-white">{children}</div>}
    </div>
  );
};
