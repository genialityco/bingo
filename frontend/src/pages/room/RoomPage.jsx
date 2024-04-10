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
import BingoCardStatic from "../../components/BingoCard";
import io from "socket.io-client";
import bingoRoomService from "../../services/bingoRoomService";
import bingoConfig from "./bingoConfig.json";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const RoomPage = () => {
  const bottomSectionRef = useRef(null);
  const [liveStreamPosition, setLiveStreamPosition] = useState({ x: 0, y: 0 });
  const [lastBallot, setLastBallot] = useState(null);

  const { dimensions } = bingoConfig;
  // Calcula el número de filas y columnas a partir de las dimensiones.
  const [rows, cols] = dimensions.format.split("x").map(Number);
  const totalSquares = rows * cols;

  const savedMarkedSquares = JSON.parse(localStorage.getItem("markedSquares"));

  const [markedSquares, setMarkedSquares] = useState(
    savedMarkedSquares ||
      new Array(totalSquares).fill({ isMarked: false, value: 0 })
  );

  // Función para actualizar las casillas marcadas
  const handleMarkSquare = (item, index) => {
    setMarkedSquares((currentMarks) =>
      currentMarks.map((marked, i) => {
        if (i === index) {
          return {
            isMarked: !marked.isMarked,
            value: item.carton_value.value,
          };
        }
        return marked;
      })
    );
  };

  // Si quieres ver el estado actualizado en la consola, considera usar useEffect
  // con markedSquares como dependencia, o realizar el console.log dentro de
  // una promesa o función asíncrona si setMarkedSquares lo permite.

  //extraer el userId de la localStorage
  const storageUserId = JSON.parse(localStorage.getItem("userId"));

  // Función para manejar "Cantar Bingo"
  const handleBingoCall = async () => {
    try {
      console.log(markedSquares, room._id, storageUserId)
      await bingoRoomService.sangBingo(markedSquares, room._id, storageUserId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Guarda las casillas marcadas en localStorage cada vez que cambian
    localStorage.setItem("markedSquares", JSON.stringify(markedSquares));
  }, [markedSquares]);

  useEffect(() => {
    if (bottomSectionRef.current) {
      bottomSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleDragEnd = (event) => {
    const { delta } = event;
    setLiveStreamPosition({
      x: liveStreamPosition.x + delta.x,
      y: liveStreamPosition.y + delta.y,
    });
  };

  const getBallotsHistory = async () => {
    try {
      const roomData = await bingoRoomService.getRoomById(
        "661077c0bfb6c413af382930"
      );
      setRoom(roomData);
      setBallotsHistory(roomData.history_of_ballots);
    } catch (error) {
      console.error(error);
    }
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "lightBlue",
    message: "",
  });

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on("ballotUpdate", (data) => {
      console.log("Datos recibidos del servidor:", data);

      // Si los campos actualizados incluyen el historial de balotas,
      // extrae el número de la última balota.
      const updateDescription = data.updateDescription;
      if (updateDescription && updateDescription.updatedFields) {
        const updatedFields = updateDescription.updatedFields;

        // Encuentra la clave que contiene la cadena 'history_of_ballots'
        // y obtén el valor de la última balota actualizada.
        for (const key in updatedFields) {
          if (key.startsWith("history_of_ballots")) {
            const lastBallot = updatedFields[key];
            setLastBallot(lastBallot); // Asumiendo que setLastBallot es tu función de estado
            break; // Rompe el bucle después de encontrar la primera coincidencia
          }
          if (key.startsWith("bingoFigure")) {
            getBallotsHistory(); // Asumiendo que setLastBallot es tu función de estado
            break; // Rompe el bucle después de encontrar la primera coincidencia
          }
        }
      }
    });

    socket.on("sangBingo", (data) => {
      console.log("Datos recibidos del servidor:", data);
      // const data={userId:"123", status:"Validando"}
      let message;
      let color;
      let storageUserId = JSON.parse(localStorage.getItem("userId"));

      const { userId, status } = data;
      console.log(userId, storageUserId);
      if (userId === storageUserId && status == "Validando") {
        message = "Estamos validando el bingo, ¡espera un momento!";
        color = "Grey";
      } else if (userId === storageUserId && status === true) {
        message = "Felicidades! Eres el ganador del bingo.";
        color = "green";
      } else if (userId === storageUserId && status === false) {
        message = "Lo sentimos, no has ganado, revisa las balotas.";
        color = "red";
      } else if (status == "Validando") {
        message = "Alguien ha cantado bingo, ¡espera un momento!";
        color = "Grey";
      } else if (status === true) {
        message = "Alguien han cantado bingo y es un ganador.";
        color = "green"; // o cualquier color de tu elección
      } else if (status === false) {
        message = "Lo sentimos, no es un ganador esta vez.";
        color = "red"; // o cualquier color de tu elección
      }

      setAlertData({ color, message });
      setShowAlert(true);

      // Ocultar la alerta después de un tiempo
      setTimeout(() => {
        setShowAlert(true);
      }, 2000); // Ajusta el tiempo según tus necesidades
    });

    return () => {
      socket.off("ballotUpdate");
      socket.off("sangBingo");
      socket.disconnect();
    };
  }, []);

  const [ballotsHistory, setBallotsHistory] = useState([]);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    getBallotsHistory();
  }, [lastBallot]);

  return (
    <>
      <DndContext onDragEnd={handleDragEnd}>
        <div
          // className="flex flex-col h-screen w-full overflow-hidden bg-gray-300 p-4"
          className="flex flex-col lg:h-screen w-full  bg-gray-300 p-1"
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
          {/* Información del evento */}
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
              {/* Agrega aquí más detalles que quieras mostrar al expandir */}
            </Accordion>
          </section>

          {/* Contenido principal dividido en dos */}
          <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            {/* Sección del cartón de bingo */}
            <div className="flex flex-col md:hidden">
              <Card className="flex-none">
                <CardBody>
                  {/* Balotas y controles */}
                  <DataGame
                    lastBallot={lastBallot}
                    ballotsHistory={ballotsHistory}
                    room={room}
                  />
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-col flex-1 mb-4 md:mb-0 md:mr-2">
              <Card className="flex flex-col flex-1 overflow-y-auto">
                <div className="shadow-lg p-2 flex justify-evenly items-center">
                  <Button size="sm" color="green" onClick={handleBingoCall}>
                    Cantar Bingo
                  </Button>
                  <Button size="sm" color="blue">
                    Limpiar Cartón
                  </Button>
                  <Button size="sm" color="gray">
                    Chat
                  </Button>
                </div>
                <BingoCard
                  markedSquares={markedSquares}
                  onMarkSquare={handleMarkSquare}
                />
              </Card>
            </div>

            {/* Transmisión en miniatura arrastrable para móviles */}

            <DraggableLiveStream position={liveStreamPosition} />

            {/* Sección de transmisión y balotas */}
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
    console.log("Enviando", userId);
    localStorage.setItem("userId", JSON.stringify(userId));
    setOpen(false);
    setHasUserEntered(true); // Marcar que el usuario ha ingresado
  };

  const handleCancel = () => {
    setOpen(false);
    // Puedes agregar lógica adicional aquí si es necesario
  };

  // Si el usuario ya ha ingresado, no renderizar el componente
  if (hasUserEntered) {
    return null;
  }

  return (
    <>
      <Dialog
        open={open}
        size="xs"
        /*  handler={handleClose} */
      >
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

const BingoCard = ({ markedSquares, onMarkSquare }) => {
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

const BallsDrawn = ({ lastBallot }) => {
  // Componente para mostrar las balotas que salen
  return (
    <div>
      <Typography>
        {lastBallot
          ? "¡El bingo ha iniciado!"
          : "¡El bingo aún no ha iniciado!"}
      </Typography>
      {lastBallot && (
        <Typography variant="h5">
          Última balota sacada:{" "}
          <Typography className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12">
            {lastBallot}
          </Typography>
        </Typography>
      )}
      {/* Puedes agregar más lógica aquí para mostrar las balotas como lo necesites */}
    </div>
  );
};

const History = ({ ballotsHistory }) => {
  return (
    <div className="w-full md:max-w-xs lg:max-w-md xl:max-w-2xl overflow-hidden">
      <div className="w-full flex overflow-x-auto ">
        {ballotsHistory.map((ballot, index) => (
          <Typography
            key={index}
            className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 m-1"
          >
            {ballot}
          </Typography>
        ))}
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

const DataGame = ({ lastBallot, ballotsHistory, room }) => {
  const dataTabs = [
    {
      label: "Balotas",
      value: "balls",
      content: <BallsDrawn lastBallot={lastBallot} />,
    },
    {
      label: "Historial de balotas",
      value: "HistoryBalls",
      content: <History ballotsHistory={ballotsHistory} />,
    },
    {
      label: "Figura",
      value: "Figure",
      content: <Figure room={room} />,
    },
  ];

  return (
    <Tabs value="balls">
      <TabsHeader>
        {dataTabs.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {dataTabs.map(({ value, content }) => (
          <TabPanel key={value} value={value}>
            {content}
          </TabPanel>
        ))}
      </TabsBody>
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
