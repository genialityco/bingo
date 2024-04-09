import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import templatesBingoService from "../../services/templatesBingoService";
import bingoRoomService from "../../services/bingoRoomService";
import bingoConfigJson from "../room/bingoConfig.json";

const bingoConfig = bingoConfigJson;

export const PlayBingoPage = () => {
  const [currentBallot, setCurrentBallot] = useState(null);
  const [announcedBallots, setAnnouncedBallots] = useState([]);
  const [bingoRoom, setBingoRoom] = useState({});
  const [bingoTemplates, setBingoTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Cargar los templates al montar el componente
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const templates = await templatesBingoService.getAllTemplates();
        setBingoTemplates(templates);
      } catch (error) {
        console.error("Error fetching templates:", error);
        // Manejo del error
      }
    };

    const fetchRoom = async () => {
      try {
        const room = await bingoRoomService.getRoomById(
          "661077c0bfb6c413af382930"
        );
        if (room.bingoFigure) {
          setSelectedTemplate(String(room.bingoFigure._id));
        }
        if (room.history_of_ballots.length > 0) {
          setAnnouncedBallots(room.history_of_ballots);
        }
        setBingoRoom(room);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };
    fetchRoom();
    fetchTemplates();
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
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-300 p-4">
      <section className="mb-5 text-center">
        <Typography variant="h3">Panel de control {bingoRoom.title}</Typography>
      </section>

      <div className="flex flex-1 flex-col md:flex-row gap-2 mb-4">
        {/* Sección izquierda para la balota actual */}
        <div className="w-full md:w-1/3 flex flex-col items-center mb-4">
          <Card className="w-full h-48 mb-4">
            <CardBody className="flex flex-col items-center justify-center">
              <Typography
                variant="h5"
                className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
              >
                {currentBallot ? currentBallot : "—"}{" "}
              </Typography>{" "}
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
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <Card className="w-full h-64">
            <CardBody className="flex flex-col justify-between">
              {/* Espacio para las solicitudes de Bingo */}
              <Typography variant="h6">Solicitudes de bingo</Typography>
              <Typography>No han gritado bingo</Typography>
              {/* Espacio para el validador de cartones, aquí podría ir un formulario */}
              <Typography variant="h6">Validador de cartones</Typography>
            </CardBody>
          </Card>
        </div>
      </div>
      {/* Sección para las balotas anunciadas */}
      <div className="w-full">
        <Card className="w-full h-60">
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
