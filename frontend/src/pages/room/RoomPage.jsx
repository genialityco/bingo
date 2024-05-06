import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { DndContext, useDraggable } from "@dnd-kit/core";
import { useLocation } from "react-router-dom";
import BingoCardStatic from "../../components/BingoCard";
import io from "socket.io-client";
import bingoRoomService from "../../services/bingoRoomService";
import bingoService from "../../services/bingoService";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const RoomPage = () => {
  const bottomSectionRef = useRef(null);
  const [liveStreamPosition, setLiveStreamPosition] = useState({ x: 0, y: 0 });
  const [lastBallot, setLastBallot] = useState(null);
  const [bingoConfig, setBingoConfig] = useState(null);
  const [markedSquares, setMarkedSquares] = useState([]);
  const [storageUserId, setStorageUserId] = useState(
    JSON.parse(localStorage.getItem("userId"))
      ? JSON.parse(localStorage.getItem("userId"))
      : ""
  );

  const location = useLocation();
  const { roomId, bingoId } = location.state || {};

  useEffect(() => {
    const getBingo = async () => {
      const response = await bingoService.getBingoById(bingoId);
      setBingoConfig(response.data);
    };
    getBingo();
  }, []);

  useEffect(() => {
    if (bingoConfig) {
      const [rows, cols] = bingoConfig.dimensions.split("x").map(Number);
      const totalSquares = rows * cols;

      setMarkedSquares(
        new Array(totalSquares).fill({ isMarked: false, value: 0 })
      );

      const savedMarkedSquares = JSON.parse(
        localStorage.getItem("markedSquares")
      );

      if (savedMarkedSquares) {
        setMarkedSquares(savedMarkedSquares);
      }
    }
  }, [bingoConfig]);

  const handleMarkSquare = (item, index) => {
    setMarkedSquares((currentMarks) =>
      currentMarks.map((marked, i) =>
        i === index
          ? {
              isMarked: !marked.isMarked,
              value: item.value || item.image_url,
            }
          : marked
      )
    );
  };

  useEffect(() => {
    if (markedSquares.length > 0) {
      localStorage.setItem("markedSquares", JSON.stringify(markedSquares));
    }
  }, [markedSquares]);

  useEffect(() => {
    if (bottomSectionRef.current) {
      bottomSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleDragEnd = (event) => {
    const { delta } = event;
    setLiveStreamPosition((prevPosition) => ({
      x: prevPosition.x + delta.x,
      y: prevPosition.y + delta.y,
    }));
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "lightBlue",
    message: "",
  });
  const [room, setRoom] = useState(null);
  const [ballotsHistory, setBallotsHistory] = useState([]);

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
          setLastBallot(updateDescription.updatedFields[key]);
        }
        if (key.startsWith("bingoFigure")) {
          getBallotsHistory();
        }
      });
    }
  };

  const handleBingoCall = async () => {
    try {
      await bingoRoomService.sangBingo(markedSquares, room._id, storageUserId);
    } catch (error) {
      console.error(error);
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

  const getBallotsHistory = async () => {
    const roomData = await bingoRoomService.getRoomById(roomId);
    setRoom(roomData);
    setBallotsHistory(roomData.history_of_ballots);
  };

  useEffect(() => {
    getBallotsHistory();
  }, [lastBallot]);

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div
          className="flex flex-col w-full bg-gray-300 p-2"
          ref={bottomSectionRef}
        >
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

          <section>
            <Accordion title="Bingo especial de fin de semana">
              <Typography variant="small" className="mb-1">
                <strong>Sala:</strong> 10025
              </Typography>
              <Typography variant="small" className="mb-1">
                <strong>Código de cartón:</strong> QC525
              </Typography>
              <Typography variant="small">
                <strong>Jugador:</strong> Juan Mosquera
              </Typography>
            </Accordion>
          </section>

          <div className="p-1 flex gap-3 flex-col md:flex-row">
            <div className="flex-1 mb-4 md:mb-0 md:mr-2">
              <Card className="flex flex-col flex-1 overflow-y-auto">
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
                {bingoConfig && (
                  <BingoCard
                    bingoConfig={bingoConfig}
                    markedSquares={markedSquares}
                    onMarkSquare={handleMarkSquare}
                  />
                )}
              </Card>
            </div>

            <DraggableLiveStream position={liveStreamPosition} />

            <div className="hidden md:flex flex-col flex-1">
              {/* <Card className="mb-4 md:mb-2 flex-1">
              <CardBody className="overflow-auto"> */}
              <Card className="h-full mb-4 md:mb-2 flex-1">
                <CardBody className="relative h-full">
                  {/* Contenido de la transmisión */}
                  <LiveStream />
                </CardBody>
              </Card>
              <Card className="flex-none">
                <DataGame
                  bingoConfig={bingoConfig}
                  lastBallot={lastBallot}
                  ballotsHistory={ballotsHistory}
                  room={room}
                />
              </Card>
            </div>
          </div>
        </div>
      </DndContext>
      <MessageDialog />
    </>
  );
};

// componente de ingreso del nombre del jugador
export function MessageDialog() {
  const [open, setOpen] = React.useState(false);
  const [userId, setUserId] = useState("");
  const [hasUserEntered, setHasUserEntered] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya ha ingresado
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setHasUserEntered(true);
    } else {
      // Si el usuario no ha ingresado, abrir el diálogo automáticamente
      setOpen(true);
    }
  }, []);

  const handleButtonSendUser = (e) => {
    e.preventDefault();
    localStorage.setItem("userId", JSON.stringify(userId));
    setOpen(false);
    setHasUserEntered(true); // Marcar que el usuario ha ingresado
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Si el usuario ya ha ingresado, no renderizar el componente
  if (hasUserEntered) {
    return null;
  }

  return (
    <>
      <Dialog open={open} size="xs">
        <div className="flex items-center justify-between"></div>
        <DialogBody>
          <form onSubmit={handleButtonSendUser}>
            <div className="grid gap-6">
              <Typography className="-mb-1" color="blue-gray" variant="h6">
                Ingrese un nombre para jugar
              </Typography>
              <Input
                label="Nombre"
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <DialogFooter className="space-x-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                variant="gradient"
                color="gray"
                type="submit"
                disabled={!userId}
              >
                Enviar
              </Button>
            </DialogFooter>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}

const BingoCard = ({ bingoConfig, markedSquares, onMarkSquare }) => {
  // Componente para renderizar el cartón de bingo

  return (
    <BingoCardStatic
      bingoConfig={bingoConfig}
      markedSquares={markedSquares}
      onMarkSquare={onMarkSquare}
    />
  );
};

const LiveStream = () => {
  // Componente para la transmisión en vivo
  return <div>Transmisión en vivo aquí</div>;
};

const BallsDrawn = ({ bingoConfig, lastBallot }) => {
  let ballotImage;
  if (bingoConfig?.bingoValues[0].type === "image" && lastBallot) {
    const ballotImageFind = bingoConfig.bingoValues.find(
      (ballot) => ballot.value === lastBallot
    );
    ballotImage = ballotImageFind ? ballotImageFind.imageUrl : null;
  }

  return (
    <div className="p-2">
      <Typography variant="h6" className="text-center">
        Balota
      </Typography>
      <Typography className="text-center">
        {lastBallot
          ? "¡El bingo ha iniciado!"
          : "¡El bingo aún no ha iniciado!"}
      </Typography>
      {lastBallot && (
        <>
          {ballotImage ? (
            // Mostrar solo la imagen si ballotImage existe
            <div className="flex justify-center">
              <img
                src={ballotImage}
                alt={`Balota ${lastBallot}`}
                className="rounded-full shadow-xl shadow-blue-500/50 h-16 w-16 animate-mark-in mb-5"
              />
            </div>
          ) : (
            // Mostrar el número de balota si no hay imagen
            <Typography variant="h5" className="text-center">
              Última balota sacada:{" "}
              <Typography className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12">
                {lastBallot}
              </Typography>
            </Typography>
          )}
        </>
      )}
    </div>
  );
};

const History = ({ bingoConfig, ballotsHistory }) => {
  // Función para obtener la imagen de la balota, si existe
  const getBallotImage = (ballot) => {
    if (bingoConfig?.bingoValues[0].type === "image") {
      const ballotImageFind = bingoConfig.bingoValues.find(
        (b) => b.value === ballot
      );
      return ballotImageFind ? ballotImageFind.imageUrl : null;
    }
    return null;
  };

  return (
    <div className="w-full md:max-w-xs lg:max-w-md xl:max-w-2xl overflow-hidden">
      <div className="w-full flex overflow-x-auto ">
        {ballotsHistory.map((ballot, index) => {
          const ballotImage = getBallotImage(ballot);
          return ballotImage ? (
            // Mostrar la imagen si está disponible
            <div key={index} className="flex justify-center items-center m-1">
              <img
                src={ballotImage}
                alt={`Balota ${ballot}`}
                className="rounded-full shadow-xl shadow-blue-500/50 h-16 w-16 animate-mark-in mb-5"
              />
            </div>
          ) : (
            // Mostrar el número de balota si no hay imagen
            <Typography
              key={index}
              className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 m-1"
            >
              {ballot}
            </Typography>
          );
        })}
      </div>
    </div>
  );
};

const Figure = ({ room }) => {
  return (
    <div>
      <img
        src={room?.bingoFigure?.image}
        alt="Figura de Bingo"
        width={"140"}
        height={"100"}
        className="m-auto mt-2"
      />
    </div>
  );
};

// const History = ({ ballotsHistory }) => {
//   return (
//     <div className="m-3 p-2  bg-gray-300 rounded-xl">
//       <Typography variant="h6" className="text-center text-gray-700 my-1">
//         Historial de Balotas
//       </Typography>
//       <div className=" flex flex-wrap justify-center items-center gap-2 ">
//         {ballotsHistory.map((ballot, index) => (
//           <Typography
//             key={index}
//             className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 m-1"
//           >
//             {ballot}
//           </Typography>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Figure = ({ room }) => {
//   return (
//     <div className="h-full p-2">
//       <Typography variant="h6" className="text-center m-0">
//         Figura
//       </Typography>
//       <div className="h-5/6 flex justify-center items-center">
//         <img
//           src={room?.bingoFigure?.image}
//           alt="Figura de Bingo"
//           width={'140'}
//           height={'100'}
//           className=" w-auto h-full"
//         />
//       </div>
//     </div>
//   );
// };

const DataGame = ({ bingoConfig, lastBallot, ballotsHistory, room }) => {
  const dataTabs = [
    {
      label: "Balotas",
      value: "balls",
      content: <BallsDrawn bingoConfig={bingoConfig} lastBallot={lastBallot} />,
    },
    {
      label: "Historial de balotas",
      value: "HistoryBalls",
      content: (
        <History bingoConfig={bingoConfig} ballotsHistory={ballotsHistory} />
      ),
    },
    {
      label: "Figura",
      value: "Figure",
      content: <Figure room={room} />,
    },
  ];

  return (
    <Tabs value="balls">
      {bingoConfig && (
        <TabsHeader>
          {dataTabs.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
      )}
      {bingoConfig && (
        <TabsBody>
          {dataTabs.map(({ value, content }) => (
            <TabPanel key={value} value={value}>
              {content}
            </TabPanel>
          ))}
        </TabsBody>
      )}
    </Tabs>
  );
};

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1 bg-black rounded">
      <div className="cursor-pointer p-4" onClick={() => setIsOpen(!isOpen)}>
        <Typography
          variant="h6"
          color="white"
          className="uppercase text-sm md:text-base"
        >
          {title}
        </Typography>
      </div>
      {isOpen && <div className="p-3 text-white">{children}</div>}
    </div>
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
