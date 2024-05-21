import { useContext, useEffect, useState } from 'react';
import {
  Card,
  Chip,
  Typography,
  Input,
  Textarea,
  Button,
} from '@material-tailwind/react';
import { NewBingoContext } from '../../context/NewBingoContext';
import SizeBingoCard from './components/SizeBingoCard';
import DialogValueCartonAndBallot from './components/DialogValueCartonAndBallot';
import DialogGenerateBallots from './components/DialogGenerateBallots';

const TABLE_HEAD = [
  'Tipo valor en Cartón',
  'Valor en el Cartón',
  'Tipo Balota',
  'Valor en la Balota',
  'Opciones',
  '-',
];

const DimensionsBingoCard = ({ sendBingoCreated }) => {
  const { bingo, updateBingo } = useContext(NewBingoContext);

  const [numValuesToPlay, setNumValuesToPlay] = useState('');
  //establecer el nuevo valor de objetos que tendra el array bingoValues
  const [selectedNumValues, setSelectedNumValues] = useState(null);

  //abrir o cerrar Dialog para configurar valores del carton y de la balota
  const [openDialogValueCartonAndBallot, setOpenDialogValueCartonAndBallot] =
    useState(false);
  //estados para abrir o cerrar los Dialogs
  const [openDialogGenerateBallots, setOpenDialogGenerateBallots] =
    useState(false);

  //estados para editar cada objeto dentro del array bingoValues
  const [editIndex, setEditIndex] = useState(null);
  //guardar el array de posiciones desabilitadas y dimension
  const [positionsDisabled, setPostionDisabled] = useState([]);
  const [dimension, setDimension] = useState(null);

  //captura  el titulo y las reglas
  const handleCreateNewBingo = (e) => {
    const { name, value } = e.target;
    updateBingo({ ...bingo, [name]: value });
  };

  const handleNumValuesToPlayChange = (value) => {
    setNumValuesToPlay(value);
    const newBingoValues = Array.from({ length: value }, (_, index) => ({
      carton_value: '',
      carton_type: '',
      ballot_value: '',
      ballot_type: '',
      positions: [],
    }));

    updateBingo((prevState) => ({
      ...prevState,
      bingo_values: [...newBingoValues, ...prevState.bingo_values],
    }));

    setSelectedNumValues(value);
  };

  //maneja cerrar o abrir el Dialog
  const handleOpenDialogValueCartonAndBallot = (index) => {
    setEditIndex(index);
    setOpenDialogValueCartonAndBallot(true);
  };

  //Agregar mas objetos al array de bingoValues listos para personalizar
  const handleAddBalota = () => {
    const newBalota = {
      carton_value: '',
      carton_type: '',
      ballot_value: '',
      ballot_type: '',
      positions: [],
    };

    updateBingo((prevState) => ({
      ...prevState,
      bingo_values: [newBalota, ...prevState.bingo_values],
    }));
  };

  //elimina un objeto dentro del array bingoValues
  const handleDeleteValueInBingoValues = (index) => {
    const updatedBingoValues = bingo.bingo_values.filter((_, i) => i !== index);
    updateBingo((prevState) => ({
      ...prevState,
      bingo_values: updatedBingoValues,
    }));
  };

  //obtener las posiciones desabilitadas y el tamaño seleccionado:
  const getPositionsDisablesAndDimension = (disables, sizeCarton) => {
    setPostionDisabled(disables);
    setDimension(sizeCarton);
  };


  //mantener actualizado el estado bingo con la config y enviarlo al padre "BingoConfig"
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

  return (
    <div className=" flex flex-col lg:flex-row gap-3 ">
      {/* 1st Card: Titulo, Dimensiones y Reglas */}
      <Card className="w-2/5 bg-white p-5 flex justify-center items-center gap-3 border-gray-50 border-2 text-center">
        <Typography variant="h5" className="self-start">
          Nombre
        </Typography>
        <div className="w-72">
          <Input
            type="text"
            placeholder="Nombre"
            name="name"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: 'hidden',
            }}
            containerProps={{ className: 'min-w-[100px]' }}
            onChange={(e) => handleCreateNewBingo(e)}
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
            onChange={(e) => handleCreateNewBingo(e)}
            value={bingo.rules}
          />
        </div>
      </Card>

      {/* 2nd Card:  personalizar el contenido del carton */}
      <Card className="w-full bg-blue-gray-100 p-5 border-2 hover:shadow-2xl">
        <Typography variant="h5" className="mb-3">
          Valores del Bingo
        </Typography>
        <div className="mb-5 flex justify-center gap-3">
          {/* <Button variant="gradient" className="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            Importar valores del Bingo
          </Button> */}
          <Button
            variant="gradient"
            className="flex items-center gap-3"
            onClick={setOpenDialogGenerateBallots}
          >
            Generar Balotas
          </Button>
          <Button
            variant="gradient"
            className="flex items-center gap-3"
            onClick={handleAddBalota}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Agregar Balota
          </Button>
        </div>

        {/* Tabla del contenido del bingo*/}
        <Card className="m-auto h-[600px] w-11/12 overflow-scroll overflow-y-auto">
          <table className="w-full min-w-max table-auto text-center">
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
            <tbody>
              {bingo.bingo_values?.map((item, index) => (
                <tr key={index} className="even:bg-blue-gray-50/50">
                  {/* tipo valor en carton */}
                  <td className="p-4">
                    {' '}
                    <Chip
                      color={
                        item.carton_type === 'text'
                          ? 'green'
                          : item.carton_type === 'default'
                          ? 'blue'
                          : item.carton_type === 'image'
                          ? 'pink'
                          : null
                      }
                      value={
                        !item.carton_type
                          ? '-'
                          : item.carton_type === 'default'
                          ? 'Number'
                          : item.carton_type
                      }
                    />
                  </td>
                  {/* valor carton */}
                  <td className="p-4">
                    {item.carton_type === 'image' ? (
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
                        {!item.carton_value ? '-' : item.carton_value}
                      </Typography>
                    )}
                  </td>
                  {/* tipo de balota */}
                  <td className="p-4">
                    <Chip
                      color={
                        item.ballot_type === 'text'
                          ? 'green'
                          : item.ballot_type === 'default'
                          ? 'blue'
                          : item.ballot_type === 'image'
                          ? 'pink'
                          : null
                      }
                      value={
                        !item.ballot_type
                          ? '-'
                          : item.ballot_type === 'default'
                          ? 'Number'
                          : item.ballot_type
                      }
                    />
                  </td>
                  {/* valor balota */}
                  <td className="p-4">
                    {item.ballot_type === 'image' ? (
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
                        {!item.ballot_value ? '-' : item.ballot_value}
                      </Typography>
                    )}
                  </td>
                  {/* iconos editar y eliminar */}
                  <td className="p-4 flex  items-center justify-center gap-2">
                    <button
                      className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
                      type="button"
                      onClick={() =>
                        handleOpenDialogValueCartonAndBallot(index)
                      }
                    >
                      <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </span>
                    </button>
                    <button
                      className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs  text-red-500 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
                      type="button"
                      onClick={() => handleDeleteValueInBingoValues(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                  <td className="p-4">
                    <Typography>{index + 1}</Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
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
