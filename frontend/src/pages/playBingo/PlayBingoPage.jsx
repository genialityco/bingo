import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
  Chip,
} from "@material-tailwind/react";
import templatesBingoService from "../../services/templatesBingoService";
import bingoRoomService from "../../services/bingoRoomService";
import bingoService from "../../services/bingoService";
import io from "socket.io-client";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const PlayBingoPage = () => {
  const [currentBallot, setCurrentBallot] = useState(null);
  const [announcedBallots, setAnnouncedBallots] = useState([]);
  const [bingoRoom, setBingoRoom] = useState({});
  const [bingoTemplates, setBingoTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [bingoRequests, setBingoRequests] = useState([]);
  const [bingoConfig, setBingoConfig] = useState({});
  const [isImage, setIsImage] = useState(false);

  const STATUS_WINNER = "Ganador";
  const STATUS_NOT_YET_WINNER = "Aún no ha ganado";
  const STATUS_VALIDATING = "Validando";

  // Función para agregar una nueva solicitud de bingo al estado o actualizar el estado existente
  const addBingoRequest = useCallback((user, status) => {
    setBingoRequests((prevRequests) => {
      const existingRequest = prevRequests.find(
        (request) => request.user === user
      );

      if (existingRequest) {
        if (status === "Validando") {
          const updatedStatus = status;
          const updatedRequests = prevRequests.map((request) =>
            request.user === user
              ? { ...request, status: updatedStatus }
              : request
          );

          localStorage.setItem(
            "bingoRequests",
            JSON.stringify(updatedRequests)
          );
          return updatedRequests;
        } else {
          const updatedStatus = status ? STATUS_WINNER : STATUS_NOT_YET_WINNER;
          const updatedRequests = prevRequests.map((request) =>
            request.user === user
              ? { ...request, status: updatedStatus }
              : request
          );

          localStorage.setItem(
            "bingoRequests",
            JSON.stringify(updatedRequests)
          );
          return updatedRequests;
        }
      } else {
        const newRequest = { user, status: STATUS_VALIDATING };
        const updatedRequests = [...prevRequests, newRequest];

        localStorage.setItem("bingoRequests", JSON.stringify(updatedRequests));
        return updatedRequests;
      }
    });
  }, []);

  useEffect(() => {
    const getBingo = async () => {
      try {
        const response = await bingoService.getBingoById(
          "661d9afc9764e77b40d11bd7"
        );
        setBingoConfig(response);
        setIsImage(response.bingoValues[0].type === "image");

        await fetchRoom(response);
        await fetchTemplates();
      } catch (error) {
        console.error("Error in getBingo:", error);
      }
    };

    getBingo();
  }, []);

  const fetchRoom = async (bingoConfigResponse) => {
    try {
      const room = await bingoRoomService.getRoomById(
        "661c84fba4f025589e4ce1ea"
      );

      setSelectedTemplate(
        room.bingoFigure ? String(room.bingoFigure._id) : null
      );
      const ballotsToAnnounce = room.history_of_ballots
        .filter((ballot) =>
          isImage
            ? bingoConfigResponse.bingoValues.some(
                (bv) => bv.value === ballot && bv.imageUrl
              )
            : true
        )
        .map((ballot) => {
          const foundValue = bingoConfigResponse.bingoValues.find(
            (bv) => bv.value === ballot
          );
          return foundValue ? foundValue.imageUrl : null;
        });

      setAnnouncedBallots(ballotsToAnnounce);

      setBingoRoom(room);
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const templates = await templatesBingoService.getAllTemplates();
      setBingoTemplates(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // Cargar el estado inicial de bingoRequests desde localStorage al montar el componente
  useEffect(() => {
    const storedRequests = localStorage.getItem("bingoRequests");
    if (storedRequests) {
      setBingoRequests(JSON.parse(storedRequests));
    }
  }, []);

  //Jugador que ha cantado bingo
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.on("sangBingo", (data) => {
      addBingoRequest(data.userId, data.status);
    });

    return () => {
      socket.off("sangBingo");
      socket.disconnect();
    };
  }, []);

  // Función para sacar una balota al azar
  const drawBallot = async () => {
    // Primero, determina qué balotas se han anunciado basándote en si es una imagen o no
    const announcedValues = !isImage
      ? announcedBallots
      : announcedBallots
          .map((ballot) => {
            // Esto asume que announcedBallots puede contener tanto URLs como valores, dependiendo de si isImage es true o false
            // Si es una imagen, usamos la URL, si no, solo el valor
            const foundBallot = bingoConfig.bingoValues.find(
              (bv) => bv.imageUrl === ballot
            );
            return foundBallot ? foundBallot.value : null;
          })
          .filter((value) => value !== null); // Filtra valores nulos si no se encontraron coincidencias

    // Filtrar las balotas que aún no se han anunciado
    const remainingBallots = bingoConfig.bingoValues.filter(
      (ballot) => !announcedValues.includes(ballot.value)
    );

    if (remainingBallots.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingBallots.length);
      const selectedBallot = remainingBallots[randomIndex];

      if (selectedBallot.imageUrl) {
        setCurrentBallot(selectedBallot.imageUrl); // Muestra la imagen de la balota
        setIsImage(true);
        setAnnouncedBallots((prevBallots) => [
          ...prevBallots,
          selectedBallot.imageUrl,
        ]); // Añade la URL de la imagen al estado de balotas anunciadas
      } else {
        setCurrentBallot(selectedBallot.value); // Muestra el valor de la balota
        setIsImage(false);
        setAnnouncedBallots((prevBallots) => [
          ...prevBallots,
          selectedBallot.value,
        ]); // Añade el valor al estado de balotas anunciadas
      }

      await handleAddBallotToHistory(selectedBallot.value); // Añade la balota al historial en el servidor
    } else {
      alert("Todas las balotas han sido anunciadas.");
    }
  };

  const handleAddBallotToHistory = async (ballot) => {
    try {
      await bingoRoomService.addBallotToHistory(bingoRoom._id, ballot);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-300 p-4">
      <section className="mb-5 text-center">
        <Typography variant="h3">Panel de control {bingoRoom.title}</Typography>
      </section>

      <div className="flex flex-1 flex-col gap-2 md:flex-row md:justify-between  mb-4">
        {/* Sección izquierda para la balota actual */}
        <div className="w-full md:w-1/4 flex flex-col items-center mb-4">
          <Card className="w-full h-48 mb-4">
            <CardBody className="flex flex-col items-center justify-center">
              {isImage === false ? (
                <Typography
                  variant="h5"
                  className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
                >
                  {currentBallot ? currentBallot : "—"}
                </Typography>
              ) : (
                <img
                  src={currentBallot}
                  alt="Marked"
                  className="rounded-full shadow-xl shadow-blue-500/50 h-16 w-16 animate-mark-in mb-5"
                />
              )}
              <Button onClick={drawBallot}>Sacar Balota</Button>
            </CardBody>
          </Card>
        </div>

        {/* Sección central para la figura del Bingo */}
        <div className="w-full md:w-1/3 flex flex-col items-center mb-4">
          <Card className="w-full h-64">
            <CardBody className="flex justify-center items-center">
              <SelectFigure
                bingoTemplates={bingoTemplates}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                bingoRoom={bingoRoom}
              />
            </CardBody>
          </Card>
        </div>

        {/* Sección derecha para solicitudes de Bingo y validador de cartones */}
        <div className="w-full md:w-2/5 flex flex-col items-center">
          <Card className="w-full h-64">
            <CardBody className="flex flex-col justify-between">
              {/* Espacio para las solicitudes de Bingo */}
              <Typography variant="h6">Solicitudes de bingo</Typography>
              {/* Mapea las solicitudes de bingo y renderiza cada una */}
              <div className="overflow-y-auto max-h-40">
                <table className="w-full  min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
                        <Typography
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          Jugador
                        </Typography>
                      </th>
                      <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2">
                        <Typography
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          Estado
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bingoRequests.map((request, index) => {
                      const isLast = index === bingoRequests.length - 1;
                      const classes = isLast
                        ? "p-1"
                        : "p-1 border-b border-blue-gray-50";
                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <Typography>{request.user}</Typography>
                          </td>
                          <td className={classes}>
                            <Typography key={index}>
                              <Chip
                                size="md"
                                value={request.status}
                                color={
                                  request.status === "Validando"
                                    ? "deep-orange"
                                    : request.status === "Ganador"
                                    ? "green"
                                    : "red"
                                }
                                className=" text-center p-1"
                                style={{
                                  width: `${request.status.length * 10}px`,
                                }}
                              />
                            </Typography>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Espacio para el validador de cartones, aquí podría ir un formulario */}
              <Typography variant="h6">Validador de cartones</Typography>
            </CardBody>
          </Card>
        </div>
      </div>
      {/* Sección para las balotas anunciadas */}
      <div className="w-full">
        <Card className="w-full">
          <CardBody className="flex flex-wrap justify-center items-center gap-2">
            <Typography variant="h6" className="w-full text-center">
              Balotas anunciadas
            </Typography>
            {announcedBallots.map((ballot, index) =>
              isImage === false ? (
                <Typography
                  variant="h5"
                  className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
                >
                  {ballot}
                </Typography>
              ) : (
                <img
                  src={ballot}
                  alt="Marked"
                  className="rounded-full shadow-xl shadow-blue-500/50 h-16 w-16 animate-mark-in mb-5"
                />
              )
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

const SelectFigure = ({
  bingoTemplates,
  selectedTemplate,
  setSelectedTemplate,
  bingoRoom,
}) => {
  const handleChangeFigure = async (figureId) => {
    try {
      bingoRoomService.updateRoom(bingoRoom._id, {
        ...bingoRoom,
        bingoFigure: figureId,
      });
      setSelectedTemplate(figureId);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      {/* Selector para las figuras de Bingo */}
      <Select
        label="Elige una figura de Bingo"
        onChange={handleChangeFigure}
        // value={selectedTemplate}
      >
        {bingoTemplates.map((template) => (
          <Option key={template._id} value={template._id}>
            {template.title} - {template.format}
          </Option>
        ))}
      </Select>
      {/* Mostrar la imagen de la figura seleccionada si existe */}
      {selectedTemplate && (
        <img
          src={bingoTemplates.find((t) => t._id === selectedTemplate)?.image}
          alt="Figura de Bingo"
          width={"140"}
          height={"100"}
          className="m-auto mt-2"
        />
      )}
      {/* Mostrar el título de la figura seleccionada si existe */}
      <Typography className="mt-2">
        Figura:{" "}
        {bingoTemplates.find((t) => t._id === selectedTemplate)?.title ||
          "Ninguna seleccionada"}
      </Typography>
    </div>
  );
};
