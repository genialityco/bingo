import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  ButtonGroup,
  CardFooter,
  Chip,
} from "@material-tailwind/react";
import templatesBingoService from "../../services/templatesBingoService";
import bingoRoomService from "../../services/bingoRoomService";
import bingoService from "../../services/bingoService";
import io from "socket.io-client";
import { SelectFigure } from "./components/SelectFigure";
import { BallotMachine } from "./components/BallotMachine";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const PlayBingoPage = () => {
  const { roomId } = useParams();
  const [currentBallot, setCurrentBallot] = useState(null);
  const [announcedBallots, setAnnouncedBallots] = useState([]);
  const [bingoRoom, setBingoRoom] = useState(null);
  const [bingoTemplates, setBingoTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [bingoRequests, setBingoRequests] = useState([]);
  const [bingoConfig, setBingoConfig] = useState({});

  const STATUS_WINNER = "Ganador";
  const STATUS_NOT_YET_WINNER = "Aún no ha ganado";
  const STATUS_VALIDATING = "Validando";

  const addBingoRequest = useCallback((user, status) => {
    setBingoRequests((prevRequests) => {
      const existingRequest = prevRequests.find(
        (request) => request.user === user
      );
      const updatedStatus =
        status === "Validando"
          ? status
          : status
          ? STATUS_WINNER
          : STATUS_NOT_YET_WINNER;

      const updatedRequests = existingRequest
        ? prevRequests.map((request) =>
            request.user === user
              ? { ...request, status: updatedStatus }
              : request
          )
        : [...prevRequests, { user, status: STATUS_VALIDATING }];

      localStorage.setItem("bingoRequests", JSON.stringify(updatedRequests));
      return updatedRequests;
    });
  }, []);

  const fetchInitialData = async () => {
    try {
      const bingoRoomResponse = await bingoRoomService.getRoomById(roomId);
      setBingoRoom(bingoRoomResponse);
      setAnnouncedBallots(bingoRoomResponse.history_of_ballots);
      setSelectedTemplate(bingoRoomResponse.bingoFigure?._id || null);

      // Obtén el bingoId de la sala
      const bingoConfigResponse = await bingoService.getBingoById(
        bingoRoomResponse.bingoId
      );

      setBingoConfig(bingoConfigResponse);

      const lastBallotId =
        bingoRoomResponse.history_of_ballots[
          bingoRoomResponse.history_of_ballots.length - 1
        ];
      const lastBallot = bingoConfigResponse.bingo_values.find(
        (ballot) => ballot._id === lastBallotId
      );
      setCurrentBallot(lastBallot);

      const templates = await templatesBingoService.getAllTemplates();
      setBingoTemplates(templates);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (roomId) {
      fetchInitialData();
    }
  }, [roomId]);

  useEffect(() => {
    const storedRequests = localStorage.getItem("bingoRequests");
    if (storedRequests) {
      setBingoRequests(JSON.parse(storedRequests));
    }
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.on("sangBingo", (data) => addBingoRequest(data.userId, data.status));
    return () => {
      socket.disconnect();
    };
  }, [addBingoRequest]);

  const restartBingo = async () => {
    try {
      const updateData = { history_of_ballots: [] };
      const response = await bingoRoomService.updateRoom(roomId, updateData);
      fetchInitialData();
    } catch (error) {
      console.error(error);
    }
  };

  const drawBallot = async () => {
    const remainingBallots = bingoConfig.bingo_values.filter(
      (ballot) => !announcedBallots.includes(ballot._id)
    );

    if (remainingBallots.length === 0) {
      alert("Todas las balotas han sido anunciadas.");
      return;
    }

    const randomBallot =
      remainingBallots[Math.floor(Math.random() * remainingBallots.length)];
    setCurrentBallot(randomBallot);
    setAnnouncedBallots((prevBallots) => [...prevBallots, randomBallot._id]);
    try {
      await bingoRoomService.addBallotToHistory(roomId, randomBallot._id);
    } catch (error) {
      console.error("Error adding ballot to history:", error);
    }
  };

  const getBallotValueForDom = (id) => {
    if (bingoConfig && id) {
      const ballotData = bingoConfig.bingo_values.find(
        (ballot) => ballot._id === id
      );
      return {
        value: ballotData?.ballot_value ?? null,
        type: ballotData?.ballot_type ?? null,
      };
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-300 p-2">
      <section className="mb-1 text-center">
        <Card className="w-full">
          <CardBody className="flex flex-col items-center justify-center">
            <Typography variant="h3">
              Panel de control {bingoRoom?.title}
            </Typography>
          </CardBody>
        </Card>
      </section>

      <div className="flex flex-1 flex-col gap-0 md:flex-row md:justify-between">
        {/* Sección izquierda para la balota actual */}
        <div className="w-full md:w-1/4 flex flex-col items-center mb-1">
          <Card className="w-full mb-1">
            <CardBody className="flex flex-col items-center justify-center">
              {currentBallot ? (
                currentBallot.type === "image" && currentBallot.ballot_value ? (
                  <img
                    src={currentBallot.ballot_value}
                    alt="Ballot"
                    className="h-12 w-12 rounded-full shadow-xl shadow-blue-500/50 mb-5"
                  />
                ) : (
                  <Typography
                    variant="h5"
                    className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
                  >
                    {currentBallot.ballot_value}
                  </Typography>
                )
              ) : (
                <Typography
                  variant="h5"
                  className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
                >
                  —
                </Typography>
              )}
              <Button onClick={drawBallot}>Sacar Balota</Button>
            </CardBody>
          </Card>

          {bingoConfig.dimensions && (
            <Card className="w-full">
              <CardBody className="flex justify-center items-center">
                {bingoConfig.dimensions && (
                  <SelectFigure
                    bingoTemplates={bingoTemplates}
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                    bingoRoom={bingoRoom}
                    dimensions={bingoConfig.dimensions}
                  />
                )}
              </CardBody>
            </Card>
          )}
        </div>

        {/* <div className="w-auto flex flex-col items-center mb-1">
          <Card className="w-full h-auto">
            <CardBody className="flex flex-col justify-between">
              <BallotMachine
                drawBallot={drawBallot}
                currentBallot={currentBallot}
              />
            </CardBody>
          </Card>
        </div> */}

        {/* Sección derecha para solicitudes de Bingo y validador de cartones */}
        <div className="w-full md:w-1/4 flex flex-col items-center mb-1">
          <Card className="w-full h-64">
            <CardBody className="flex flex-col justify-between">
              <Typography variant="h6">Solicitudes de bingo</Typography>
              <div className="overflow-y-auto max-h-40">
                <table className="w-full min-w-max table-auto text-left">
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
                    {bingoRequests.map((request, index) => (
                      <tr key={index}>
                        <td className="p-1 border-b border-blue-gray-50">
                          <Typography>{request.user}</Typography>
                        </td>
                        <td className="p-1 border-b border-blue-gray-50">
                          <Chip
                            size="md"
                            value={request.status}
                            color={
                              request.status === STATUS_VALIDATING
                                ? "deep-orange"
                                : request.status === STATUS_WINNER
                                ? "green"
                                : "red"
                            }
                            className="text-center p-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Sección para las balotas anunciadas */}
      <div className="w-full">
        {/* Verifica que bingoConfig exista */}
        {bingoConfig &&
          Object.keys(bingoConfig).length > 0 &&
          announcedBallots && (
            <Card className="w-full">
              <CardBody className="flex flex-wrap justify-center items-center gap-2">
                <Typography variant="h6" className="w-full text-center">
                  Balotas anunciadas {announcedBallots.length}
                </Typography>
                {announcedBallots.map((ballot) => {
                  const { value, type } = getBallotValueForDom(ballot);
                  return (
                    <React.Fragment key={ballot}>
                      {type === "image" ? (
                        <img
                          src={value}
                          alt="Ballot"
                          className="h-12 w-12 rounded-full shadow-xl shadow-blue-500/50 mb-5"
                        />
                      ) : (
                        <Typography
                          variant="h5"
                          className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
                        >
                          {value}
                        </Typography>
                      )}
                    </React.Fragment>
                  );
                })}
              </CardBody>
              <CardFooter>
                <ButtonGroup className="flex justify-center">
                  <Button>Acciones</Button>
                  <Button onClick={restartBingo}>
                    Reiniciar/Limpiar bingo
                  </Button>
                  <Button>Invitar</Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          )}
      </div>
    </div>
  );
};
