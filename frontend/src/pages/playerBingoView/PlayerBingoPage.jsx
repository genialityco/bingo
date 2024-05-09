import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Alert } from "@material-tailwind/react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { shuffle } from "../../utils/AuxiliaryFunctions";
import io from "socket.io-client";
import BingoCardStatic from "../../components/BingoCard";
import bingoServices from "../../services/bingoService";
import bingoCardboardService from "../../services/bingoCardboardService";
import { TabsSection } from "./components/TabsSetion";
import { MessageDialog } from "./components/MessageDialog";
import { LiveStream } from "./components/LiveStream";

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
    // Si el código ya existe, generar uno nuevo
  } while (existingCardboards.response.data.status === "Success");
  return code;
}

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const PlayerBingoPage = () => {
  const { bingoCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Estados iniciales
  const [bingoConfig, setBingoConfig] = useState(null);
  const [bingoCard, setBingoCard] = useState(
    JSON.parse(localStorage.getItem("userId"))
      ? JSON.parse(localStorage.getItem("bingoCard"))
      : [""]
  );
  const [rows, setRows] = useState();
  const [markedSquares, setMarkedSquares] = useState([]);
  const [liveStreamPosition, setLiveStreamPosition] = useState({ x: 0, y: 0 });
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

  // Estado para almacenar `bingoId`
  const [bingoId, setBingoId] = useState(null);

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Obtén el parámetro 'state' de la query string
    const queryParams = new URLSearchParams(location.search);
    const encodedState = queryParams.get("state");

    if (encodedState) {
      try {
        const state = JSON.parse(decodeURIComponent(encodedState));
        setBingoId(state.bingoId || null);
        location.state = state.bingoId;
        // Redirige a una URL limpia sin el parámetro `state`
        navigate(`/bingo-game/${bingoCode}`, { replace: true });
      } catch (error) {
        console.error("Error al decodificar el estado:", error);
      }
    } else {
      const { bingoId } = location.state || {};
      setBingoId(bingoId || null);
    }
  }, [location.search, location.state, navigate, bingoCode]);

  // Efecto para obtener la configuración del bingo
  useEffect(() => {
    const getBingo = async () => {
      if (bingoId) {
        const response = await bingoServices.getBingoById(bingoId);
        setBingoConfig(response);
        if (response) {
          generateBingoCard(
            response.bingo_values,
            response.dimensions,
            response.positions_disabled
          );
          getBallotsHistory(response.history_of_ballots);
        }
      }
    };
    getBingo();
  }, [bingoId]);

  // Efecto para configurar los eventos de socket.io
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    if (storageUserId) {
      socket.emit("clientConnected", { playerName: storageUserId });
    }

    socket.on("userConnected", (data) => {
      addLog(data.message);
    });

    socket.on("ballotUpdate", handleBallotUpdate);
    socket.on("sangBingo", handleSangBingo);

    return () => {
      socket.off("ballotUpdate", handleBallotUpdate);
      socket.off("sangBingo", handleSangBingo);
      socket.disconnect();
    };
  }, []);

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  /**
   * Valida inicialmente que el documento modificado coincida con el id de la sala
   * Ejecuta una serie de funciones:
   *  - Obtiene la última balota sacada
   *  - Resetea las celdas marcadas (Limpia el cartón)
   *  - Actualiza la figura si se modifica
   * @param {*} data
   */
  const handleBallotUpdate = (data) => {
    const updateDescription = data.updateDescription;
    if (data.documentKey && data.documentKey._id === bingoId) {
      if (updateDescription && updateDescription.updatedFields) {
        Object.keys(updateDescription.updatedFields).forEach((key) => {
          if (key.startsWith("history_of_ballots")) {
            if (updateDescription.updatedFields[key] != "") {
              setLastBallot(updateDescription.updatedFields[key]);
            }
            if (updateDescription.updatedFields[key].length === 0) {
              const resetMarkedSquares = markedSquares.map((square) => {
                if (square.value === "Disabled") {
                  return square;
                } else {
                  return { isMarked: false, value: "" };
                }
              });
              setMarkedSquares(resetMarkedSquares);
              updateMarkSquare(resetMarkedSquares);
            }
            getBallotsHistory(ballotsHistory);
          }
          if (key.startsWith("bingoFigure")) {
            getBallotsHistory(ballotsHistory);
          }
        });
      }
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
      await bingoServices.sangBingo(
        markedSquares,
        bingoConfig._id,
        storageUserId,
        cardboardCode
      );
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
    if (code) {
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
    }
  };

  /**
   * Genera los valores del cartón de bingo, priorizando posiciones deshabilitadas,
   * luego valores con posiciones asignadas y finalmente valores sin posiciones.
   * @param {*} values
   * @param {*} dimensions
   * @param {*} positionsDisabled
   */
  const generateBingoCard = (values, dimensions, positionsDisabled) => {
    const [rows, cols] = dimensions.split("x").map(Number);

    setRows(rows);

    if (storageUserId !== "" && cardboardCode !== "") {
      getExistingCardboard(cardboardCode);
      return;
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
        const currentMark = currentMarks[index];
        const newMarkStatus = !currentMark.isMarked;

        if (
          newMarkStatus === currentMark.isMarked &&
          item._id === currentMark.value
        ) {
          return currentMarks;
        }

        const updatedMarks = [...currentMarks];
        updatedMarks[index] = {
          isMarked: newMarkStatus,
          value: item._id,
        };

        updateMarkSquare(updatedMarks);
        return updatedMarks;
      });
    }
  };

  const updateMarkSquare = async (updatedMarks) => {
    if (!cardboardId) {
      await getExistingCardboard(cardboardCode);
    }

    if (cardboardId) {
      await bingoCardboardService.updateCardboard(cardboardId, {
        game_marked_squares: updatedMarks,
      });
    } else {
      console.error("No cardboardId available to update");
    }
  };

  const getBallotsHistory = async () => {
    const { history_of_ballots } = await bingoServices.getBingoById(bingoId);
    setBallotsHistory(history_of_ballots);

    // Asignar la última balota del historial a lastBallot
    if (history_of_ballots.length > 0) {
      const lastBallotId = history_of_ballots[history_of_ballots.length - 1];
      setLastBallot(lastBallotId);
    }
  };

  // Maneja el final del arrastre de la transmisión en vivo
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
                  <LiveStream
                    bingoConfig={bingoConfig}
                    playerName={storageUserId}
                    cardboardCode={cardboardCode}
                    logs={logs}
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
