import { useContext, useEffect, useState } from "react";
import {
  Card,
  Chip,
  Typography,
  Input,
  Textarea,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";
import { NewBingoContext } from "../../context/NewBingoContext";
import SizeBingoCard from "./components/SizeBingoCard";
import DialogValueCartonAndBallot from "./components/DialogValueCartonAndBallot";
import DialogGenerateBallots from "./components/DialogGenerateBallots";
import Pagination from "../../../../components/Pagination";

const TABLE_HEAD = [
  "Tipo valor en Cartón",
  "Valor en el Cartón",
  "Tipo Balota",
  "Valor en la Balota",
  "Opciones",
];

const DimensionsBingoCard = ({ sendBingoCreated }) => {
  const { bingo, updateBingo } = useContext(NewBingoContext);

  const [numValuesToPlay, setNumValuesToPlay] = useState("");
  const [selectedNumValues, setSelectedNumValues] = useState(null);
  const [openDialogValueCartonAndBallot, setOpenDialogValueCartonAndBallot] =
    useState(false);
  const [openDialogGenerateBallots, setOpenDialogGenerateBallots] =
    useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [positionsDisabled, setPostionDisabled] = useState([]);
  const [dimension, setDimension] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    sendBingoCreated(bingo);
  }, [bingo]);

  useEffect(() => {
    updateBingo((prevState) => ({
      ...prevState,
      bingo_values: [],
      positions_disabled: [],
    }));
  }, []);

  const handleCreateNewBingo = (e) => {
    const { name, value } = e.target;
    updateBingo({ ...bingo, [name]: value });
  };

  const handleNumValuesToPlayChange = (value) => {
    setNumValuesToPlay(value);
    const newBingoValues = Array.from({ length: value }, () => ({
      carton_value: "",
      carton_type: "",
      ballot_value: "",
      ballot_type: "",
      positions: [],
    }));

    updateBingo((prevState) => ({
      ...prevState,
      bingo_values: [...newBingoValues, ...prevState.bingo_values],
    }));

    setSelectedNumValues(value);
  };

  const handleOpenDialogValueCartonAndBallot = (index) => {
    setEditIndex(index);
    setOpenDialogValueCartonAndBallot(true);
  };

  const handleAddBalota = () => {
    const newBalota = {
      carton_value: "",
      carton_type: "",
      ballot_value: "",
      ballot_type: "",
      positions: [],
    };

    updateBingo((prevState) => ({
      ...prevState,
      bingo_values: [newBalota, ...prevState.bingo_values],
    }));
  };

  const handleDeleteValueInBingoValues = (index) => {
    const updatedBingoValues = bingo.bingo_values.filter((_, i) => i !== index);
    updateBingo((prevState) => ({
      ...prevState,
      bingo_values: updatedBingoValues,
    }));
  };

  const getPositionsDisablesAndDimension = (disables, sizeCarton) => {
    setPostionDisabled(disables);
    setDimension(sizeCarton);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderTableHead = () => (
    <thead>
      <tr>
        {TABLE_HEAD.map((head) => (
          <th
            key={head}
            className="w-24 border-b border-blue-gray-100 bg-blue-gray-50 p-4"
          >
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal leading-none opacity-70"
            >
              {head}
            </Typography>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderTableBody = () => {
    const offset = currentPage * itemsPerPage;
    const currentItems = bingo.bingo_values.slice(
      offset,
      offset + itemsPerPage
    );

    return (
      <tbody>
        {currentItems.map((item, index) => (
          <tr key={index} className="even:bg-blue-gray-50/50">
            <td className="p-4">
              <Chip
                color={
                  item.carton_type === "text"
                    ? "green"
                    : item.carton_type === "default"
                    ? "blue"
                    : item.carton_type === "image"
                    ? "pink"
                    : null
                }
                value={
                  !item.carton_type
                    ? "-"
                    : item.carton_type === "default"
                    ? "Number"
                    : item.carton_type
                }
              />
            </td>
            <td className="p-4">
              {item.carton_type === "image" ? (
                <img
                  className="m-auto"
                  src={item.carton_value}
                  alt="Imagen"
                  height={50}
                  width={50}
                />
              ) : (
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {!item.carton_value ? "-" : item.carton_value}
                </Typography>
              )}
            </td>
            <td className="p-4">
              <Chip
                color={
                  item.ballot_type === "text"
                    ? "green"
                    : item.ballot_type === "default"
                    ? "blue"
                    : item.ballot_type === "image"
                    ? "pink"
                    : null
                }
                value={
                  !item.ballot_type
                    ? "-"
                    : item.ballot_type === "default"
                    ? "Number"
                    : item.ballot_type
                }
              />
            </td>
            <td className="p-4">
              {item.ballot_type === "image" ? (
                <img
                  className="m-auto"
                  src={item.ballot_value}
                  alt="Imagen"
                  height={50}
                  width={50}
                />
              ) : (
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {!item.ballot_value ? "-" : item.ballot_value}
                </Typography>
              )}
            </td>
            <td className="p-4 flex items-center justify-center gap-2">
              <IconButton
                variant="text"
                className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
                type="button"
                onClick={() => handleOpenDialogValueCartonAndBallot(index)}
              >
                <PencilSquareIcon className="h-5 w-5" strokeWidth={2} />
              </IconButton>
              <IconButton
                variant="text"
                className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs  text-red-500 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
                type="button"
                onClick={() => handleDeleteValueInBingoValues(index)}
              >
                <TrashIcon className="h-5 w-5" strokeWidth={2} />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <Card className="w-2/5 bg-white p-5 flex justify-start items-center gap-3 border-gray-50 border-2 text-center">
        <Typography variant="h5" className="self-start">
          Nombre
        </Typography>
        <div className="w-72">
          <Input
            type="text"
            placeholder="Nombre"
            name="name"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{ className: "hidden" }}
            containerProps={{ className: "min-w-[100px]" }}
            onChange={handleCreateNewBingo}
            value={bingo.name}
          />
        </div>
        <SizeBingoCard
          getPositionsDisablesAndDimension={getPositionsDisablesAndDimension}
        />
        <div className="w-80">
          <Typography variant="h5" className="text-left my-2">
            Reglamento
          </Typography>
          <Textarea
            label="Escribe las reglas del juego"
            name="rules"
            onChange={handleCreateNewBingo}
            value={bingo.rules}
          />
        </div>
      </Card>
      <Card className="w-full bg-blue-gray-100 p-5 border-2 hover:shadow-2xl">
        <Typography variant="h5" className="mb-3">
          Valores del Bingo
        </Typography>
        <div className="mb-5 flex justify-center gap-3">
          <Button
            variant="gradient"
            size="md"
            className="flex items-center normal-case gap-3"
            onClick={() => setOpenDialogGenerateBallots(true)}
          >
            Generar Balotas
          </Button>
          <Button
            size="md"
            variant="gradient"
            className="flex items-center normal-case gap-3"
            onClick={handleAddBalota}
          >
            Agregar Balota
          </Button>
        </div>
        <Card className="m-auto h-auto w-11/12 overflow-scroll overflow-y-auto">
          <table className="w-full min-w-max table-auto text-center">
            {renderTableHead()}
            {renderTableBody()}
          </table>
        </Card>
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(bingo.bingo_values.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </Card>
      <DialogGenerateBallots
        openDialogGenerateBallots={openDialogGenerateBallots}
        setOpenDialogGenerateBallots={setOpenDialogGenerateBallots}
        handleNumValuesToPlayChange={handleNumValuesToPlayChange}
      />
      <DialogValueCartonAndBallot
        openDialogValueCartonAndBallot={openDialogValueCartonAndBallot}
        setOpenDialogValueCartonAndBallot={setOpenDialogValueCartonAndBallot}
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        positionsDisabled={positionsDisabled}
        dimension={dimension}
      />
    </div>
  );
};

export default DimensionsBingoCard;
