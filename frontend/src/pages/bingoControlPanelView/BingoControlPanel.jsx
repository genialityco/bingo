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
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import bingoServices from "../../services/bingoService";
import bingoFigureServices from "../../services/bingoFigureServices";
import io from "socket.io-client";
import { SelectFigure } from "./components/SelectFigure";
import { BallotMachine } from "./components/BallotMachine";
import InvitePopover from "./components/InvitePopover";
import { FormEditRoom } from "./components/FormEditRoom";
import { BingoRequestTable } from "./components/BingoRequestTable";

const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL;

export const BingoControlPanel = () => {
  const { bingoId } = useParams();
  const [currentBallot, setCurrentBallot] = useState(null);
  const [announcedBallots, setAnnouncedBallots] = useState([]);
  const [bingo, setBingo] = useState(null);
  const [figures, setFigures] = useState([]);
  const [selectedFigure, setSelectedFigure] = useState(null);
  const [bingoRequests, setBingoRequests] = useState([]);

  const [invitationLink, setInvitationLink] = useState("");

  const STATUS_WINNER = "Ganador";
  const STATUS_NOT_YET_WINNER = "Aún no ha ganado";
  const STATUS_VALIDATING = "Validando";

  const addBingoRequest = useCallback((user, status, cardboardCode) => {
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
              ? { ...request, status: updatedStatus, cardboardCode }
              : request
          )
        : [...prevRequests, { user, status: STATUS_VALIDATING, cardboardCode }];

      localStorage.setItem("bingoRequests", JSON.stringify(updatedRequests));
      return updatedRequests;
    });
  }, []);

  const fetchInitialData = async () => {
    try {
      const bingoResponse = await bingoServices.getBingoById(bingoId);
      setBingo(bingoResponse);
      setAnnouncedBallots(bingoResponse.history_of_ballots);
      setSelectedFigure(bingoResponse.bingo_figure?._id || null);

      const lastBallotId =
        bingoResponse.history_of_ballots[
          bingoResponse.history_of_ballots.length - 1
        ];
      const lastBallot = bingoResponse.bingo_values.find(
        (ballot) => ballot._id === lastBallotId
      );
      setCurrentBallot(lastBallot);

      const figures = await bingoFigureServices.getAllFigures()
      setFigures(figures);
      generateInvitationLink(
        bingoResponse.bingo_code,
        bingoResponse._id,
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (bingoId) {
      fetchInitialData();
    }
  }, [bingoId]);

  useEffect(() => {
    const storedRequests = localStorage.getItem("bingoRequests");
    if (storedRequests) {
      setBingoRequests(JSON.parse(storedRequests));
    }
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.on("sangBingo", (data) =>
      addBingoRequest(data.userId, data.status, data.cardboardCode)
    );
    return () => {
      socket.disconnect();
    };
  }, [addBingoRequest]);

  const generateInvitationLink = (bingoCode, bingoId) => {
    const baseURL = window.location.origin;
    const state = JSON.stringify({ bingoId });
    const encodedState = encodeURIComponent(state);
    setInvitationLink(`${baseURL}/bingo-game/${bingoCode}?state=${encodedState}`);
  };

  const restartBingo = async () => {
    try {
      const updateData = { history_of_ballots: [] };
      const response = await bingoServices.updateBingo(bingoId, updateData);
      fetchInitialData();
    } catch (error) {
      console.error(error);
    }
  };

  const drawBallot = async () => {
    const remainingBallots = bingo.bingo_values.filter(
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
      await bingoServices.addBallotToHistory(bingoId, randomBallot._id);
    } catch (error) {
      console.error("Error adding ballot to history:", error);
    }
  };

  const getBallotValueForDom = (id) => {
    if (bingo && id) {
      const ballotData = bingo.bingo_values.find(
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
            <Typography variant="h4">Panel de control</Typography>
            <Typography>{bingo?.name}</Typography>
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

          {bingo?.dimensions && (
            <Card className="w-full">
              <CardBody className="flex justify-center items-center">
                {bingo.dimensions && (
                  <SelectFigure
                    figures={figures}
                    selectedFigure={selectedFigure}
                    setSelectedFigure={setSelectedFigure}
                    bingo={bingo}
                    dimensions={bingo.dimensions}
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
        <div className="w-full md:w-2/6 flex flex-col items-center mb-1">
          <Card className="w-full h-64">
            <CardBody className="flex flex-col justify-between">
              <Typography variant="h6">Solicitudes de bingo</Typography>
              <div className="overflow-y-auto max-h-40">
                <BingoRequestTable
                  bingoRequests={bingoRequests}
                  STATUS_VALIDATING={STATUS_VALIDATING}
                  STATUS_WINNER={STATUS_WINNER}
                />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Sección para las balotas anunciadas */}
      <div className="w-full">
        {/* Verifica que bingoConfig exista */}
        {bingo &&
          Object.keys(bingo).length > 0 &&
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
                  <FormEditRoom
                    bingo={bingo}
                    fetchBingoData={fetchInitialData}
                  />
                  <Button onClick={restartBingo}>
                    Reiniciar/Limpiar bingo
                  </Button>
                  <InvitePopover
                    invitationLink={invitationLink}
                    bingo={bingo}
                  />
                </ButtonGroup>
              </CardFooter>
            </Card>
          )}
      </div>
    </div>
  );
};
