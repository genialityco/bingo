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

const bingoConfig = {
  _id: {
    $oid: "660ade84bae479acfb0af052",
  },
  name: "Bingo fiesta",
  amount_of_bingo: 0,
  regulation: "Combinación ganadora en L",
  bingo_appearance: {
    background_color: "#00bcd4",
    background_image: null,
    banner:
      "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FbingoHeader.png?alt=media&token=973f45a2-deab-42f4-9479-546d9a0315aa",
    footer:
      "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FbingoFooter.png?alt=media&token=08c9bac6-563d-419a-b207-d2dd2846ba1d",
    dial_image: null,
  },
  bingo_values: [
    {
      carton_value: {
        type: "text",
        value: "1",
      },
      ballot_value: {
        type: "text",
        value: "1",
      },
      id: "660ade9c25a980.32569211",
    },
    {
      carton_value: {
        type: "text",
        value: "2",
      },
      ballot_value: {
        type: "text",
        value: "2",
      },
      id: "660adea4d2c902.01233147",
    },
    {
      carton_value: {
        type: "text",
        value: "3",
      },
      ballot_value: {
        type: "text",
        value: "3",
      },
      id: "660adeb21c8811.28628692",
    },
    {
      carton_value: {
        type: "text",
        value: "4",
      },
      ballot_value: {
        type: "text",
        value: "4",
      },
      id: "660adeb6851e25.12228377",
    },
    {
      carton_value: {
        type: "text",
        value: "5",
      },
      ballot_value: {
        type: "text",
        value: "5",
      },
      id: "660adebb346b63.01598284",
    },
    {
      carton_value: {
        type: "text",
        value: "9",
      },
      ballot_value: {
        type: "text",
        value: "9",
      },
      id: "660adecca3ead7.65120290",
    },
    {
      carton_value: {
        type: "text",
        value: "10",
      },
      ballot_value: {
        type: "text",
        value: "10",
      },
      id: "660adf94810f30.86570050",
    },
    {
      carton_value: {
        type: "text",
        value: "11",
      },
      ballot_value: {
        type: "text",
        value: "11",
      },
      id: "660adf9a59de89.86574502",
    },
    {
      carton_value: {
        type: "text",
        value: "12",
      },
      ballot_value: {
        type: "text",
        value: "12",
      },
      id: "660adf9ea6b8b5.39437622",
    },
    {
      carton_value: {
        type: "text",
        value: "13",
      },
      ballot_value: {
        type: "text",
        value: "13",
      },
      id: "660adfa366dec0.37280184",
    },
    {
      carton_value: {
        type: "text",
        value: "14",
      },
      ballot_value: {
        type: "text",
        value: "14",
      },
      id: "660adfa7b27c87.77710858",
    },
    {
      carton_value: {
        type: "text",
        value: "19",
      },
      ballot_value: {
        type: "text",
        value: "19",
      },
      id: "660adfbf7463a0.91690949",
    },
    {
      carton_value: {
        type: "text",
        value: "20",
      },
      ballot_value: {
        type: "text",
        value: "20",
      },
      id: "660adfc5742250.95888449",
    },
    {
      carton_value: {
        type: "text",
        value: "21",
      },
      ballot_value: {
        type: "text",
        value: "21",
      },
      id: "660adfc968e0b6.79109486",
    },
    {
      carton_value: {
        type: "text",
        value: "22",
      },
      ballot_value: {
        type: "text",
        value: "22",
      },
      id: "660adfcde02b54.21404474",
    },
    {
      carton_value: {
        type: "text",
        value: "23",
      },
      ballot_value: {
        type: "text",
        value: "23",
      },
      id: "660adfd1f2bc24.09131204",
    },
  ],
  dimensions: {
    amount: 16,
    format: "4x4",
    minimun_values: 32,
  },
  event_id: "660ade4a4cea7dc676010c72",
  updated_at: {
    $date: "2024-04-03T20:24:53.157Z",
  },
  created_at: {
    $date: "2024-04-01T16:19:16.603Z",
  },
};

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
      const historyBallots = await bingoRoomService.addBallotToHistory(
        bingoRoom._id,
        ballot
      );
      console.log(historyBallots);
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
        onChange={(e) => handleChangeFigure(e)}
        value={selectedTemplate}
      >
        {bingoTemplates.map((template) => (
          <Option key={template._id} value={template._id}>
            {template.title}
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
