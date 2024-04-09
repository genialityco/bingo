import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
  Chip,
} from '@material-tailwind/react';
import templatesBingoService from '../../services/templatesBingoService';
import bingoRoomService from '../../services/bingoRoomService';
import bingoConfigJson from '../room/bingoConfig.json';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';

const bingoConfig = bingoConfigJson;

export const PlayBingoPage = () => {
  const [currentBallot, setCurrentBallot] = useState(null);
  const [announcedBallots, setAnnouncedBallots] = useState([]);
  const [bingoRoom, setBingoRoom] = useState({});
  const [bingoTemplates, setBingoTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [bingoRequests, setBingoRequests] = useState([]);

  // Función para agregar una nueva solicitud de bingo al estado o actualizar el estado existente
  const addBingoRequest = (user, status) => {
    user = JSON.parse(localStorage.getItem('userId'));
    setBingoRequests((prevRequests) => {
      // Verificar si ya hay una solicitud para el usuario
      const existingRequestIndex = prevRequests.findIndex(
        (request) => request.user === user
      );

      // Si existe, actualiza el estado del usuario
      if (existingRequestIndex !== -1) {
        const updatedRequests = [...prevRequests];
        if (status === true) {
          updatedRequests[existingRequestIndex] = {
            ...updatedRequests[existingRequestIndex],
            status: 'Ganador',
          };
        } else if (status === false) {
          updatedRequests[existingRequestIndex] = {
            ...updatedRequests[existingRequestIndex],
            status: 'Aun no ha ganado',
          };
        }
        return updatedRequests;
      } else {
        // Si no existe, agrega una nueva solicitud con el estado "Validando"
        return [...prevRequests, { user, status: 'Validando' }];
      }
    });
  };

  // Cargar los templates al montar el componente
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await templatesBingoService.getAllTemplates();
        setBingoTemplates(templates);
      } catch (error) {
        console.error('Error fetching templates:', error);
        // Manejo del error
      }
    };

    const fetchRoom = async () => {
      try {
        const room = await bingoRoomService.getRoomById(
          '661077c0bfb6c413af382930'
        );
        if (room.bingoFigure) {
          setSelectedTemplate(String(room.bingoFigure._id));
        }
        if (room.history_of_ballots.length > 0) {
          setAnnouncedBallots(room.history_of_ballots);
        }
        setBingoRoom(room);
      } catch (error) {
        console.error('Error fetching room:', error);
      }
    };

    fetchRoom();
    fetchTemplates();
  }, []);

  //Jugador que ha cantado bingo
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on('sangBingo', (data) => {
      console.log('Datos recibidos del servidor:', data);
      const { userId, status } = data;

      // Agrega la nueva solicitud de bingo al estado
      addBingoRequest(userId, status);
    });

    return () => {
      socket.off('sangBingo');
      socket.disconnect();
    };
  }, []);

  // Función para sacar una balota al azar
  const drawBallot = async () => {
    const remainingBallots = bingoConfig.bingo_values.filter(
      (ballot) => !announcedBallots.includes(ballot.ballot_value.value)
    );
    if (remainingBallots.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingBallots.length);
      const selectedBallot = remainingBallots[randomIndex];
      setCurrentBallot(selectedBallot.ballot_value.value);
      setAnnouncedBallots([
        ...announcedBallots,
        selectedBallot.ballot_value.value,
      ]);
      await handleAddBallotToHistory(selectedBallot.ballot_value.value);
    } else {
      alert('Todas las balotas han sido anunciadas.');
    }
  };

  const handleAddBallotToHistory = async (ballot) => {
    try {
      await bingoRoomService.addBallotToHistory(bingoRoom._id, ballot);
    } catch (error) {
      console.error(error);
    }
  };

  const [histoySangBingo, setHistoySangBingo] = useState([]);

//   useEffect(() => {
//     const socket = io(SOCKET_SERVER_URL);

//     socket.on("sangBingo", (data) => {
//       console.log("Datos recibidos del servidor:", data);
//       let message;
//       let color;

//       if (data === "Validando") {
//         message = "Estamos validando el bingo, ¡espera un momento!";
//         color = "Grey"; // o cualquier color de tu elección
//       } else if (data === true) {
//         message = "¡Felicidades! Han cantado bingo y es un ganador.";
//         color = "green"; // o cualquier color de tu elección
//       } else if (data === false) {
//         message = "Lo sentimos, no es un ganador esta vez.";
//         color = "red"; // o cualquier color de tu elección
//       }

//       setAlertData({ color, message });
//       setShowAlert(true);

//       // Ocultar la alerta después de un tiempo
//       setTimeout(() => {
//         setShowAlert(true);
//       }, 2000); // Ajusta el tiempo según tus necesidades
//     });

//     return () => {
//       socket.off("ballotUpdate");
//       socket.off("sangBingo");
//       socket.disconnect();
//     };
//   }, []);


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
              <Typography
                variant="h5"
                className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
              >
                {currentBallot ? currentBallot : '—'}{' '}
              </Typography>{' '}
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
                        ? 'p-1'
                        : 'p-1 border-b border-blue-gray-50';
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
                                  request.status === 'Validando'
                                    ? 'deep-orange'
                                    : request.status === 'Ganador'
                                    ? 'green'
                                    : 'red'
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
            {announcedBallots.map((ballot, index) => (
              <Typography
                key={index}
                className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12"
              >
                {ballot}
              </Typography>
            ))}
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
          width={'140'}
          height={'100'}
          className="m-auto mt-2"
        />
      )}
      {/* Mostrar el título de la figura seleccionada si existe */}
      <Typography className="mt-2">
        Figura:{' '}
        {bingoTemplates.find((t) => t._id === selectedTemplate)?.title ||
          'Ninguna seleccionada'}
      </Typography>
    </div>
  );
};
