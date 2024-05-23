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

import { signInAnonymously, updateProfile,onAuthStateChanged, getAuth } from "firebase/auth";
import { auth } from "../../firebase";

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
  const { bingoCode, bingoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Estados iniciales
  const [bingoConfig, setBingoConfig] = useState(null);
  const [bingoCard, setBingoCard] = useState(
    JSON.parse(localStorage.getItem("bingoCard"))
      ? JSON.parse(localStorage.getItem("bingoCard"))
      : ""
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
  const [cardboardId, setCardboardId] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "lightBlue",
    message: "",
  });

  const [messageLastBallot, setMessageLastBallot] = useState(
    "¡El bingo aún no ha iniciado!"
  );

  const [logs, setLogs] = useState([]);

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const socket = io(SOCKET_SERVER_URL);

  // useEffect(() => {
  //   const auth = getAuth();
  //   onAuthStateChanged(auth, (user) => {
  //     alert( user)
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/auth.user
  //       const uid = user.uid;
  //       // ...
  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // }, []);

  // Efecto para obtener la configuración del bingo
  useEffect(() => {
    const generateBingoCard = (values, dimensions, positionsDisabled) => {
      const [rows, cols] = dimensions.split("x").map(Number);

      setRows(rows);

      if (cardboardCode !== "") {
        getExistingCardboard();
        return;
      }

      let card = Array.from({ length: rows * cols }, () => ({
        value: null,
        _id: null,
        isMarked: false,
        default_image: null,
        type: null,
      }));

      // Aplicar posiciones deshabilitadas
      positionsDisabled.forEach((disabled) => {
        card[disabled.position] = {
          ...card[disabled.position],
          value: "Disabled",
          default_image: disabled.default_image,
          marked: true,
        };
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
      // localStorage.setItem("bingoCard", JSON.stringify(bingoCard));
    };

    const getBingo = async () => {
      if (bingoCode) {
        const response = await bingoServices.findBingoByField(
          "bingo_code",
          bingoCode
        );
        if (response.status === "Success") {
          setBingoConfig(response.data);
          generateBingoCard(
            response.data.bingo_values,
            response.data.dimensions,
            response.data.positions_disabled
          );
          getBallotsHistory(response.data.history_of_ballots);
        }
      }
    };
    getBingo();
  }, [bingoCode]);

  // Efecto para configurar los eventos de socket.io
  useEffect(() => {
    if (storageUserId) {
      socket.emit("setPlayerName", { playerName: storageUserId });

      socket.on("userConnected", (data) => {
        addLog(data.message);
      });

      socket.on("ballotUpdate", handleBallotUpdate);
      socket.on("sangBingo", handleSocketSangBingo);

      socket.on("chat message", (msg) => {
        setChat([...chat, msg]);
      });

      return () => {
        socket.off("ballotUpdate", handleBallotUpdate);
        socket.off("sangBingo", handleSocketSangBingo);
        socket.disconnect();
      };
    }
  }, [storageUserId, chat]);

  const sendChat = (e) => {
    e.preventDefault();
    socket.emit("chat message", message);
    setMessage("");
  };

  const handleSocketSangBingo = (data) => {
    handleSangBingo(data);
    addBingoSingingLog(data);
  };
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
    const { updateDescription } = data;
    if (
      data.documentKey &&
      data.documentKey._id === bingoId &&
      updateDescription?.updatedFields
    ) {
      const { updatedFields } = updateDescription;

      // Detectar cambios en 'history_of_ballots'
      const historyUpdates = updatedFields.history_of_ballots;

      Object.keys(updatedFields).forEach((key) => {
        if (key.startsWith("history_of_ballots")) {
          const lastBallotValue = updatedFields[key];
          getBallotsHistory();
          setLastBallot(lastBallotValue);
          setMessageLastBallot("¡El bingo ha comenzado!");
        }
      });

      if (historyUpdates) {
        const ballotKeys = Object.keys(historyUpdates);

        // Si el array de balotas está vacío, manejar reinicio
        if (Array.isArray(historyUpdates) && historyUpdates.length === 0) {
          setLastBallot("");
          resetGame();
        } else if (ballotKeys.length) {
          // Si hay balotas actualizadas, manejar la última balota
          const latestBallotKey = ballotKeys[ballotKeys.length - 1]; // Obtener la última clave modificada
          const latestBallot =
            updatedFields.history_of_ballots[latestBallotKey];
          getBallotsHistory();
          setLastBallot(latestBallot);
          setMessageLastBallot("¡El bingo ha comenzado!");
        }
      }

      // Si se detectan cambios en 'bingoFigure'
      if (updatedFields.bingo_figure) {
        getBallotsHistory();
      }
    }
  };

  const addBingoSingingLog = (data) => {
    const { userId, status } = data;
    if (userId === storageUserId) {
      status === "Validando"
        ? addLog(`¡Has cantado bingo!`)
        : status
        ? addLog(`¡Has ganado el bingo!`)
        : addLog(`¡Aún no ganas el bingo!`);
    } else {
      status === "Validando"
        ? addLog(`¡El jugador ${userId} ha cantado bingo!`)
        : status
        ? addLog(`¡El jugador ${userId} ha ganado el bingo!`)
        : addLog(`¡El jugador ${userId} aún no gana el bingo!`);
    }
  };

  const handleSangBingo = (data) => {
    const { userId, status } = data;
    let message, color;
    if (userId === storageUserId) {
      setMessageLastBallot("¡Alguien ha cantado bingo, estamos validando!");
      message =
        status === "Validando"
          ? "Estamos validando el bingo, ¡espera un momento!"
          : status
          ? "Felicidades! Eres el ganador del bingo."
          : "Lo sentimos, no has ganado, revisa las balotas.";
      color = status === "Validando" ? "gray" : status ? "green" : "red";
      setMessageLastBallot(message);
    } else {
      (message =
        status === "Validando"
          ? "Alguien ha cantado bingo, ¡espera un momento!"
          : status
          ? "Alguien ha cantado bingo y es un ganador."
          : "Lo sentimos, no es un ganador esta vez."),
        (color = status === "Validando" ? "gray" : status ? "green" : "red");
      setMessageLastBallot(message);
    }

    setAlertData({ color, message });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 6000);
  };

  const handleBingoCall = async () => {
    try {
      await bingoServices.sangBingo(
        bingoCard,
        bingoConfig._id,
        storageUserId,
        cardboardCode
      );
    } catch (error) {
      console.error(error);
    }
  };

  const authenticateAnonymously = async (playerName) => {
    try {
      const result = await signInAnonymously(auth);

      // Actualizar el displayName con playerName después de la autenticación
      await updateProfile(result.user, { displayName: playerName });

      // setIsAuthenticated(true);

      // Guardar el UID del usuario autenticado, si es necesario
      // localStorage.setItem("userId", result.user.uid);

      return result.user; // Retornar el usuario para usar en otra función
    } catch (error) {
      console.error("Error signing in anonymously:", error);
    }
  };

  const saveCardboard = async (playerName) => {
    const bingoId = bingoConfig._id;
    const cardboard_code = await generateRandomAlphanumeric(6);
    const game_card_values = bingoCard;

    try {
      // Autenticarse anónimamente y obtener el usuario
      const user = await authenticateAnonymously(playerName);

      // Crear cartón con UID del usuario
      const cardboardSaved = await bingoCardboardService.createCardboard({
        playerName: user.displayName, // Asegurando que se use el displayName actualizado
        bingoId,
        cardboard_code,
        game_card_values,
        userId: user.uid, // Usar el UID del usuario autenticado
      });

      setCardboardId(cardboardSaved.data._id);
      setCardboardCode(cardboard_code);
      setStorageUserId(playerName);
      localStorage.setItem("cardboard_code", JSON.stringify(cardboard_code));
      // localStorage.setItem(
      //   "cardboard_id",
      //   JSON.stringify(cardboardSaved.data._id)
      // );
    } catch (error) {
      console.error("Error saving cardboard:", error);
    }
  };

  // Función para resetear el juego
  const resetGame = async (localReset = false) => {
    console.log(cardboardId);
    if (cardboardId) {
      const resetMarkedSquares = bingoCard.map((square) =>
        square.value === "Disabled" ? square : { ...square, isMarked: false }
      );
      setBingoCard(resetMarkedSquares);
      updateMarkSquare(resetMarkedSquares, cardboardId);
      if (!localReset) {
        setMessageLastBallot(
          "¡El bingo ha sido reiniciado, comienza una nueva ronda!"
        );
      }
      getBallotsHistory();
    } else {
      console.error("No existe cardbordId");
    }
  };

  const getExistingCardboard = async () => {
    if (cardboardCode) {
      const response = await bingoCardboardService.findCardboardByField(
        "cardboard_code",
        cardboardCode
      );
      setStorageUserId(response.data.playerName);
      setCardboardCode(response.data.cardboard_code);
      setCardboardId(response.data._id);
      setBingoCard(response.data.game_card_values);
      // setMarkedSquares(response.data.game_marked_squares);
      // localStorage.setItem(
      //   "bingo_card",
      //   JSON.stringify(response.data.game_card_values)
      // );
      // localStorage.setItem(
      //   "cardboard_code",
      //   JSON.stringify(response.data.cardboard_code)
      // );
      // localStorage.setItem("cardboard_id", JSON.stringify(response.data._id));
    }
  };

  /**
   * Genera los valores del cartón de bingo, priorizando posiciones deshabilitadas,
   * luego valores con posiciones asignadas y finalmente valores sin posiciones.
   * @param {*} values
   * @param {*} dimensions
   * @param {*} positionsDisabled
   */
  // const generateBingoCardd = (values, dimensions, positionsDisabled) => {
  //   const [rows, cols] = dimensions.split("x").map(Number);

  //   setRows(rows);

  //   if (cardboardId !== "") {
  //     getExistingCardboard();
  //     return;
  //   }

  //   let card = Array.from({ length: rows * cols }, () => ({
  //     value: null,
  //     _id: null,
  //     isMarked: false,
  //     default_image: null,
  //     type: null,
  //   }));

  //   // let markedSquares = Array(rows * cols).fill({ isMarked: false, value: "" });

  //   // Aplicar posiciones deshabilitadas
  //   positionsDisabled.forEach((disabled) => {
  //     card[disabled.position] = {
  //       ...card[disabled.position],
  //       value: "Disabled",
  //       default_image: disabled.default_image,
  //       marked: true,
  //     };
  //     // markedSquares[disabled.position] = { isMarked: true, value: "Disabled" };
  //   });

  //   // Mezclar los valores antes de separarlos
  //   let shuffledValues = shuffle(values);

  //   // Separar los valores en dos grupos: con posiciones y sin posiciones
  //   let valuesWithPositions = shuffledValues.filter(
  //     (value) => value.positions.length > 0
  //   );
  //   let valuesWithoutPositions = shuffledValues.filter(
  //     (value) => value.positions.length === 0
  //   );

  //   // Registro de valores ya asignados para evitar duplicados
  //   let assignedValues = new Set();

  //   // Asignar valores con posiciones específicas
  //   valuesWithPositions.forEach((value) => {
  //     value.positions.forEach((pos) => {
  //       if (
  //         pos >= 0 &&
  //         pos < rows * cols && // Verificar que la posición esté dentro del rango del cartón
  //         card[pos].value === null &&
  //         !assignedValues.has(value.carton_value)
  //       ) {
  //         card[pos] = {
  //           ...card[pos],
  //           value: value.carton_value,
  //           type: value.carton_type,
  //           _id: value._id,
  //         };
  //         assignedValues.add(value.carton_value);
  //       }
  //     });
  //   });

  //   // Asignar valores sin posiciones específicas
  //   valuesWithoutPositions.forEach((value) => {
  //     let availablePositions = card.flatMap((cell, index) =>
  //       cell.value === null ? index : []
  //     );
  //     if (availablePositions.length > 0) {
  //       let chosenPosition =
  //         availablePositions[
  //           Math.floor(Math.random() * availablePositions.length)
  //         ];
  //       if (!assignedValues.has(value.carton_value)) {
  //         card[chosenPosition] = {
  //           ...card[chosenPosition],
  //           value: value.carton_value,
  //           type: value.carton_type,
  //           _id: value._id,
  //         };
  //         assignedValues.add(value.carton_value);
  //       }
  //     }
  //   });

  //   setBingoCard(card);
  //   // setMarkedSquares(markedSquares);
  //   // localStorage.setItem("bingoCard", JSON.stringify(bingoCard));
  // };

  const handleMarkSquare = (item, index) => {
    if (item.value !== "Disabled") {
      setBingoCard((currentMarks) => {
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
          ...updatedMarks[index],
          isMarked: newMarkStatus,
          // value: item._id,
        };

        updateMarkSquare(updatedMarks, cardboardId);
        return updatedMarks;
      });
    }
  };

  const updateMarkSquare = async (updatedMarks, cardboardId) => {
    await bingoCardboardService.updateCardboard(cardboardId, {
      game_card_values: updatedMarks,
    });
    // localStorage.setItem("bingoCard", JSON.stringify(updatedMarks));
  };

  const getBallotsHistory = async () => {
    const response = await bingoServices.getBingoById(bingoId);
    setBingoConfig(response);
    setBallotsHistory(response.history_of_ballots);

    // Asignar la última balota del historial a lastBallot
    if (response.history_of_ballots.length > 0) {
      const lastBallotId =
        response.history_of_ballots[response.history_of_ballots.length - 1];
      setLastBallot(lastBallotId);
      setMessageLastBallot("¡El bingo ha comenzado!");
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
              messageLastBallot={messageLastBallot}
              ballotsHistory={ballotsHistory}
            />
          </Card>
        </div>
        <div className="flex flex-col h-auto w-full bg-gray-300 px-2 pt-2">
          {showAlert && (
            <Alert
              color={alertData.color}
              onClose={() => setShowAlert(false)}
              className="fixed w-11/12 bottom-5 left-1/2 transform -translate-x-1/2 z-50 shadow"
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
                  <Button
                    size="sm"
                    className="px-2 md:px-4"
                    color="blue"
                    onClick={() => resetGame(true)}
                  >
                    Limpiar Cartón
                  </Button>
                  {/* <Button size="sm" className="px-2 md:px-4" color="gray">
                    Chat
                  </Button> */}
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
                  {/* <div>
                    <form onSubmit={sendChat}>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escribe un mensaje"
                      />
                      <button type="submit">Enviar</button>
                    </form>
                    {chat.map((msg, index) => (
                      <p key={index}>{msg}</p>
                    ))}
                  </div> */}
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
