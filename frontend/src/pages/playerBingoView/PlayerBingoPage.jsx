import React, { useEffect, useState } from "react";
import { Alert } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { shuffle } from "../../utils/AuxiliaryFunctions";
import io from "socket.io-client";
import bingoServices from "../../services/bingoService";
import bingoCardboardService from "../../services/bingoCardboardService";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { MessageDialog } from "./components/MessageDialog";
import { PlayerBingoCard } from "./components/PlayerBingoCard";
import { BallotHistoryTable } from "./components/BallotHistoryTable";
import { DesktopVideo, ChatPanel } from "./components/VideoChat";
import { ShowLastBallot } from "./components/ShowLastBallot";
import {
  MegaphoneIcon,
  ArrowPathIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const PlayerBingoPage = () => {
  const { user, userName } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const { bingoCode, bingoId } = useParams();

  // Game state
  const [bingoConfig, setBingoConfig] = useState(null);
  const [bingoCard, setBingoCard] = useState(
    JSON.parse(localStorage.getItem("bingoCard"))
      ? JSON.parse(localStorage.getItem("bingoCard"))
      : "",
  );
  const [rows, setRows] = useState();
  const [cols, setCols] = useState();
  const [ballotsHistory, setBallotsHistory] = useState([]);
  // lastBallot is tracked for game state but displayed via the video stream
  const [, setLastBallot] = useState("");
  const [userNickname, setUserNickname] = useState(
    JSON.parse(localStorage.getItem("userId"))
      ? JSON.parse(localStorage.getItem("userId"))
      : "",
  );
  const [cardboardCode, setCardboardCode] = useState(
    JSON.parse(localStorage.getItem("cardboard_code"))
      ? JSON.parse(localStorage.getItem("cardboard_code"))
      : "",
  );
  const [cardboardId, setCardboardId] = useState("");

  // UI state
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "lightBlue",
    message: "",
  });
  const [messageLastBallot, setMessageLastBallot] = useState(
    "¡El juego aún no ha iniciado!",
  );
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const socket = io(SOCKET_SERVER_URL, {
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 5000,
    timeout: 20000,
    transports: ["websocket"],
  });

  const getBingo = async () => {
    if (bingoCode) {
      const response = await bingoServices.findBingoByField(
        "bingo_code",
        bingoCode,
        showLoading,
        hideLoading,
      );
      if (response.status === "Success") {
        const [rows, cols] = response.data.dimensions.split("x").map(Number);
        setBingoConfig(response.data);
        getBallotsHistory(response.data.history_of_ballots);
        setRows(rows);
        setCols(cols);

        if (user && userName) {
          setUserNickname(userName);
          initialValidation(response.data, rows, cols);
        } else {
          setShowAlert(true);
          setAlertData({
            color: "red",
            message: "Debes iniciar sesión para poder jugar",
          });
          setTimeout(() => setShowAlert(false), 1000);
        }
      }
    }
  };

  useEffect(() => {
    getBingo();
  }, [user, userName, bingoId]);

  useEffect(() => {
    if (userNickname) {
      const handleConnect = () => {
        socket.emit("setPlayerName", { playerName: userNickname });
      };

      socket.on("connect", handleConnect);
      socket.on("userConnected", (data) => addLog(data.message));
      socket.on("ballotUpdate", handleBallotUpdate);
      socket.on("sangBingo", handleSocketSangBingo);
      socket.on("chat message", (msg) => {
        setChat((prevChat) => [...prevChat, msg]);
      });

      return () => {
        socket.off("connect", handleConnect);
        socket.off("userConnected");
        socket.off("ballotUpdate", handleBallotUpdate);
        socket.off("sangBingo", handleSocketSangBingo);
        socket.off("chat message");
        socket.disconnect();
      };
    }
  }, [userNickname, chat]);

  const initialValidation = async (bingo, rows, cols) => {
    const result = await bingoCardboardService.findCardboardsByFields(
      { userId: user.uid, bingoId: bingoId },
      showLoading,
      hideLoading,
    );
    if (result.status === "Success") {
      setUserNickname(result.data[0].playerName);
      setCardboardCode(result.data[0].cardboard_code);
      setCardboardId(result.data[0]._id);
      setBingoCard(result.data[0].game_card_values);
      setShowAlert(true);
      setAlertData({ color: "green", message: "¡Ya puedes empezar a jugar!" });
      setTimeout(() => setShowAlert(false), 1000);
    } else {
      generateBingoCard(
        bingo._id,
        bingo.bingo_values,
        bingo.positions_disabled,
        rows,
        cols,
      );
    }
  };

  const getExistingCardboard = async (code) => {
    const result = await bingoCardboardService.findCardboardsByFields(
      { cardboard_code: code },
      showLoading,
      hideLoading,
    );
    if (result.status === "Success") {
      setUserNickname(result.data[0].playerName);
      setCardboardCode(result.data[0].cardboard_code);
      setCardboardId(result.data[0]._id);
      setBingoCard(result.data[0].game_card_values);
      setShowAlert(true);
      setAlertData({
        color: "green",
        message: "Cartón obtenido correctamente.",
      });
      setTimeout(() => setShowAlert(false), 1000);
    }
  };

  const sendChat = (e) => {
    e.preventDefault();
    const date = dayjs().format("YYYY-MM-DD HH:mm:ss");
    const dataMessage = {
      userId: user.uid,
      userName: userName,
      message: message,
      date,
    };
    socket.emit("chat message", dataMessage);
    setChat((prevChat) => [...prevChat, dataMessage]);
    setMessage("");
  };

  const handleSocketSangBingo = (data) => {
    handleSangBingo(data);
    addBingoSingingLog(data);
  };

  const addLog = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleBallotUpdate = (data) => {
    const { updateDescription } = data;
    if (
      data.documentKey &&
      data.documentKey._id === bingoId &&
      updateDescription?.updatedFields
    ) {
      const { updatedFields } = updateDescription;
      const historyUpdates = updatedFields.history_of_ballots;

      Object.keys(updatedFields).forEach((key) => {
        if (key.startsWith("history_of_ballots")) {
          const lastBallotValue = updatedFields[key];
          getBallotsHistory();
          setLastBallot(lastBallotValue);
          setMessageLastBallot("¡El juego ha comenzado!");
        }
      });

      if (historyUpdates) {
        const ballotKeys = Object.keys(historyUpdates);
        if (Array.isArray(historyUpdates) && historyUpdates.length === 0) {
          setLastBallot("");
          resetGame();
        } else if (ballotKeys.length) {
          const latestBallotKey = ballotKeys[ballotKeys.length - 1];
          const latestBallot =
            updatedFields.history_of_ballots[latestBallotKey];
          getBallotsHistory();
          setLastBallot(latestBallot);
          setMessageLastBallot("¡El juego ha comenzado!");
        }
      }

      if (updatedFields.bingo_figure) {
        getBallotsHistory();
      }
    }
  };

  const addBingoSingingLog = (data) => {
    const { userId, status } = data;
    if (userId === userNickname) {
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
    if (userId === userNickname) {
      setMessageLastBallot("¡Alguien ha cantado, estamos validando!");
      message =
        status === "Validando"
          ? "Estamos validando el juego, ¡espera un momento!"
          : status
            ? "Felicidades! Eres el ganador!."
            : "Lo sentimos, no has ganado, revisa las balotas.";
      color = status === "Validando" ? "gray" : status ? "green" : "red";
      setMessageLastBallot(message);
    } else {
      message =
        status === "Validando"
          ? "Alguien ha cantado, ¡espera un momento!"
          : status
            ? "Alguien ha cantado y es un ganador."
            : "Lo sentimos, no es un ganador esta vez.";
      color = status === "Validando" ? "gray" : status ? "green" : "red";
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
        userNickname,
        cardboardCode,
      );
    } catch (error) {
      console.error(error);
    }
  };

  async function generateRandomAlphanumeric(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code;
    let existingCardboards;
    do {
      code = "";
      for (let i = 0; i < length; i++) {
        code += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
      existingCardboards = await bingoCardboardService.findCardboardsByFields(
        { cardboard_code: code },
        showLoading,
        hideLoading,
      );
    } while (existingCardboards.response.data.status === "Success");
    return code;
  }

  const saveCardboard = async (id, card) => {
    const bingoIdVal = bingoConfig ? bingoConfig._id : id;
    const cardboard_code = await generateRandomAlphanumeric(6);
    const game_card_values = bingoCard ? bingoCard : card;

    try {
      const cardboardSaved = await bingoCardboardService.createCardboard(
        {
          playerName: userName,
          bingoId: bingoIdVal,
          cardboard_code,
          game_card_values,
          userId: user.uid,
        },
        showLoading,
        hideLoading,
      );
      setCardboardId(cardboardSaved.data._id);
      setCardboardCode(cardboard_code);
    } catch (error) {
      console.error("Error saving cardboard:", error);
    }
  };

  const resetGame = async (localReset = false) => {
    if (cardboardId) {
      const resetMarkedSquares = bingoCard.map((square) =>
        square.value === "Disabled" ? square : { ...square, isMarked: false },
      );
      setBingoCard(resetMarkedSquares);
      updateMarkSquare(resetMarkedSquares, cardboardId);
      if (!localReset) {
        setMessageLastBallot(
          "¡El bingo ha sido reiniciado, comienza una nueva ronda!",
        );
      }
      getBallotsHistory();
    } else {
      console.error("No existe cardboardId");
    }
  };

  const generateBingoCard = (id, values, positionsDisabled, rows, cols) => {
    let card = Array.from({ length: rows * cols }, () => ({
      value: null,
      _id: null,
      isMarked: false,
      default_image: null,
      type: null,
    }));

    positionsDisabled.forEach((disabled) => {
      card[disabled.position] = {
        ...card[disabled.position],
        value: "Disabled",
        default_image: disabled.default_image,
        marked: true,
      };
    });

    let shuffledValues = shuffle(values);
    let valuesWithPositions = shuffledValues.filter(
      (value) => value.positions.length > 0,
    );
    let valuesWithoutPositions = shuffledValues.filter(
      (value) => value.positions.length === 0,
    );
    let assignedValues = new Set();

    valuesWithPositions.forEach((value) => {
      value.positions.forEach((pos) => {
        if (
          pos >= 0 &&
          pos < rows * cols &&
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

    valuesWithoutPositions.forEach((value) => {
      let availablePositions = card.flatMap((cell, index) =>
        cell.value === null ? index : [],
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
    saveCardboard(id, card);
  };

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
  };

  const getBallotsHistory = async () => {
    const response = await bingoServices.getBingoById(bingoId);
    setBingoConfig(response);
    setBallotsHistory(response.history_of_ballots);

    if (response.history_of_ballots.length > 0) {
      const lastBallotId =
        response.history_of_ballots[response.history_of_ballots.length - 1];
      setLastBallot(lastBallotId);
      setMessageLastBallot("¡El juego ha comenzado!");
    }
  };

  const changeCardboard = () => {
    generateBingoCard(
      bingoConfig._id,
      bingoConfig.bingo_values,
      bingoConfig.positions_disabled,
      rows,
      cols,
    );
  };

  const [showChat, setShowChat] = useState(false);

  const ActionButtons = ({ mobile = false }) => (
    <div className={`flex justify-center ${mobile ? "gap-2" : "gap-3"} py-3 shrink-0`}>
      <button
        onClick={handleBingoCall}
        className={`
          flex items-center gap-1.5 font-semibold rounded-lg
          bg-gradient-to-r from-green-500 to-green-700
          hover:from-green-400 hover:to-green-600
          text-white shadow-lg shadow-green-600/25 hover:shadow-green-600/40
          active:scale-95 transition-all duration-150
          ${mobile ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}
        `}
      >
        <MegaphoneIcon className={mobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
        {mobile ? "Cantar" : "Cantar Loteria"}
      </button>
      <button
        onClick={() => resetGame(true)}
        className={`
          flex items-center gap-1.5 font-semibold rounded-lg
          bg-gradient-to-r from-blue-500 to-indigo-600
          hover:from-blue-400 hover:to-indigo-500
          text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40
          active:scale-95 transition-all duration-150
          ${mobile ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}
        `}
      >
        <ArrowPathIcon className={mobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
        Limpiar
      </button>
      <button
        onClick={changeCardboard}
        className={`
          flex items-center gap-1.5 font-semibold rounded-lg
          bg-gradient-to-r from-gray-500 to-gray-600
          hover:from-gray-400 hover:to-gray-500
          text-white shadow-lg shadow-gray-500/20 hover:shadow-gray-500/35
          active:scale-95 transition-all duration-150
          ${mobile ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"}
        `}
      >
        <ArrowsRightLeftIcon className={mobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
        Cambiar
      </button>
    </div>
  );

  return (
    <div
      className="h-screen flex flex-col overflow-hidden bg-gray-950 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/fondo.jpeg')" }}
    >
      <MessageDialog
        onSaveCardboard={saveCardboard}
        getExistingCardboard={getExistingCardboard}
      />
      <ShowLastBallot messageLastBallot={messageLastBallot} />

      {/* Global Alert */}
      {showAlert && (
        <Alert
          color={alertData.color}
          onClose={() => setShowAlert(false)}
          className="fixed w-11/12 bottom-16 left-1/2 transform -translate-x-1/2 z-50 shadow-2xl"
        >
          {alertData.message}
        </Alert>
      )}

      {/* Status bar */}
      {messageLastBallot && (
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-200 text-center text-xs py-1.5 px-4 shrink-0 border-b border-indigo-500/30">
          <span className="tracking-wide">{messageLastBallot}</span>
        </div>
      )}

      {/* ====== DESKTOP LAYOUT (lg+) ====== */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-hidden gap-3 p-3">
        {/* Left column: Card + Buttons */}
        <div className="w-[55%] flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            {bingoConfig && (
              <PlayerBingoCard
                bingoCard={bingoCard}
                rows={rows}
                cols={cols}
                bingoAppearance={bingoConfig.bingo_appearance}
                onMarkSquare={handleMarkSquare}
                cardboardCode={cardboardCode}
                desktop
              />
            )}
          </div>
          <ActionButtons />
        </div>

        {/* Right column: Video + History + Chat */}
        <div className="w-[45%] flex flex-col gap-3 min-h-0">
          {/* Video */}
          <div className="shrink-0">
            <DesktopVideo />
          </div>

          {/* Ballot History */}
          <div className="shrink-0 max-h-[35%] overflow-y-auto">
            {bingoConfig && (
              <BallotHistoryTable
                bingoConfig={bingoConfig}
                ballotsHistory={ballotsHistory}
              />
            )}
          </div>

          {/* Chat fills remaining space */}
          <div className="flex-1 min-h-0">
            <ChatPanel
              visible={true}
              onToggle={() => {}}
              userUid={user?.uid}
              chat={chat}
              logs={logs}
              message={message}
              setMessage={setMessage}
              sendChat={sendChat}
            />
          </div>
        </div>
      </div>

      {/* ====== MOBILE LAYOUT (<lg) ====== */}
      <div className="flex lg:hidden flex-col flex-1 overflow-y-auto">
        {/* Video — compact at the top */}
        <div className="shrink-0 px-2 pt-2">
          <div
            className="relative w-full rounded-xl overflow-hidden border border-white/10"
            style={{ aspectRatio: "16/9" }}
          >
            <img
              src="/ESCENARIO.png"
              alt="Video Placeholder"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bingo Card */}
        <div className="px-2 pt-3">
          {bingoConfig && (
            <PlayerBingoCard
              bingoCard={bingoCard}
              rows={rows}
              cols={cols}
              bingoAppearance={bingoConfig.bingo_appearance}
              onMarkSquare={handleMarkSquare}
              cardboardCode={cardboardCode}
            />
          )}
        </div>

        {/* Action buttons */}
        <div className="px-2">
          <ActionButtons mobile />
        </div>

        {/* Ballot History — collapsible */}
        <div className="px-2 pb-20">
          {bingoConfig && (
            <BallotHistoryTable
              bingoConfig={bingoConfig}
              ballotsHistory={ballotsHistory}
              defaultOpen={false}
            />
          )}
        </div>
      </div>

      {/* Mobile chat — floating button + slide-up panel */}
      <div className="lg:hidden">
        {showChat ? (
          <div className="fixed inset-x-0 bottom-0 z-20 h-[45vh] shadow-2xl">
            <ChatPanel
              visible={true}
              onToggle={() => setShowChat(false)}
              userUid={user?.uid}
              chat={chat}
              logs={logs}
              message={message}
              setMessage={setMessage}
              sendChat={sendChat}
            />
          </div>
        ) : (
          <ChatPanel
            visible={false}
            onToggle={() => setShowChat(true)}
            userUid={user?.uid}
            chat={chat}
            logs={logs}
            message={message}
            setMessage={setMessage}
            sendChat={sendChat}
          />
        )}
      </div>
    </div>
  );
};
