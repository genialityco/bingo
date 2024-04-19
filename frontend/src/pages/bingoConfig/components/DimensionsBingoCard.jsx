import { useEffect, useState } from 'react';
import {
  Card,
  Carousel,
  Typography,
  Input,
  Textarea,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  CardBody,
} from '@material-tailwind/react';

const TABLE_HEAD = [
  'Tipo valor en Cartón',
  'Valor en el Cartón',
  'Tipo Balota',
  'Valor en la Balota',
  'Opciones',
];

const DimensionsBingoCard = ({ sendBingoCreated }) => {
  //estados para abrir o cerer los Dialogs
  const [openOne, setOpenOne] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  //estados para editar cada objeto dentro del array bingoValues
  const [editIndex, setEditIndex] = useState(null);
  const [newCustomValue, setNewCustomValue] = useState('');
  //estado para personalizar el valor del carton y de la balota
  const [newCustomValueCarton, setNewCustomValueCarton] = useState('');
  const [newCustomValueBallot, setNewCustomValueBallot] = useState('');
  const [numValuesToPlay, setNumValuesToPlay] = useState('');

  //estado creación de un objeto del carton del bingo personalizado
  const [bingoCard, setBingoCard] = useState({
    title: '',
    rules: '',
    creator_id: null,
    bingo_appearance: {},
    bingo_values: [
      {
        carton_value: '',
        carton_type: '',
        ballot_value: '',
        ballot_type: '',
        position: [],
      },
    ],
    dimensions: '',
  });

  // estados para marcar el color de estilo de la opcion seleccionada como el tema, cantidad de valores y dimensiones
  const [selectedNumValues, setSelectedNumValues] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedDimensions, setSelectedDimensions] = useState(null);

  //estados para capturar el tipo de forma independiente en la tabla para editar
  const [selectedCartonType, setSelectedCartonType] = useState('');
  console.log(selectedCartonType);
  const [selectedBallotType, setSelectedBallotType] = useState('');

  //setea la cantidad de objetos dentro del array bingoValues y les asigna un id tanto al objeto carton_value como al objeto ballot_value
  const handleNumValuesToPlayChange = (value) => {
    setNumValuesToPlay(value);
    const newBingoValues = Array.from({ length: value }, (_, index) => ({
      carton_value: '',
      carton_type: '',
      ballot_value: '',
      ballot_type: '',
      position: [],
    }));

    setBingoCard((prevState) => ({
      ...prevState,
      bingo_values: newBingoValues,
    }));
    setSelectedNumValues(value);
  };

  //maneja el editar cada uno de los valores que es el contenido de cada celda dentro del carton del bingo
  const handleSaveCustomValue = () => {
    if (editIndex !== null) {
      const updatedBingoValues = [...bingoCard.bingo_values];
      const editedItem = updatedBingoValues[editIndex];
      editedItem.carton_value = newCustomValueCarton;
      editedItem.carton_type = selectedCartonType;
      editedItem.ballot_value = newCustomValueBallot;
      editedItem.ballot_type = selectedBallotType;

      setBingoCard((prevState) => ({
        ...prevState,
        bingo_values: updatedBingoValues,
      }));
    }
    setOpenTwo(false);
    setNewCustomValueCarton('');
    setNewCustomValueBallot('');
    setEditIndex(null);
  };

  //cambia el valor de la propiedad type dentro del array de bingoValues y tambien captura lo que entra por input como el titulo y las reglas
  const handleCreateNewBingo = (e, type) => {
    const name = e.target.name;
    const value = e.target.value;
    const updatedBingoValues = bingoCard.bingo_values.map((item) => ({
      ...item,
      carton_type: type,
      ballot_type: type,
    }));

    if (name === 'title' || name === 'rules') {
      setBingoCard((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setBingoCard((prevState) => ({
        ...prevState,
        bingo_values: [...updatedBingoValues],
      }));
      setSelectedTheme(type);
    }
  };

  // maneja la carga de imagenes locales
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewCustomValue(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //handle para abrir  o cerrar el primer diaglog cuando se oprime el boton de agregar o el icono de "x"
  const handleOpenOne = () => {
    setOpenOne(!openOne);
  };

  //handle para abrir o cerrar el segundo diaglog cuando se oprime el boton de editar en la tabla que es un icono de "lapiz" o el icono de "x"
  // const handleOpenTwo = (index) => {
  //   setEditIndex(index);
  //   setOpenTwo(!openTwo);
  // };
  const handleOpenTwo = (index) => {
    const currentItem = bingoCard.bingo_values[index];
    setEditIndex(index);
    setOpenTwo(!openTwo);
    setSelectedCartonType(currentItem.carton_type);
    setSelectedBallotType(currentItem.ballot_type);
  };

  //envia la actualizacion del estado bingoCard al componente BingoConfig a traves de la funcion sendBingoCreated que recibe este componente por props
  useEffect(() => {
    sendBingoCreated(bingoCard);
  }, [bingoCard]);

  return (
    <div className=" flex flex-col lg:flex-row gap-3 ">
      {/* 1st Card: Tittle,  Dimentions and Rules */}
      <Card className="w-2/5 bg-white p-5 flex justify-center items-center gap-3 border-gray-50 border-2 text-center">
        <Typography variant="h5" className="self-start">
          Titulo
        </Typography>
        <div className="w-72">
          <Input
            type="text"
            placeholder="Titulo"
            name="title"
            className="!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10"
            labelProps={{
              className: 'hidden',
            }}
            containerProps={{ className: 'min-w-[100px]' }}
            onChange={(e) => handleCreateNewBingo(e)}
            value={bingoCard.title}
          />
        </div>
        <Typography variant="h5" className="self-start">
          Tamaño del Cartón
        </Typography>
        <Carousel
          className="rounded-xl h-full w-full bg-blue-gray-50"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="w-20 absolute bottom-4 left-2/4 z-50 -translate-x-2/4 flex justify-evenly items-center">
              {new Array(length).fill('').map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                    activeIndex === i ? 'w-8 bg-white' : 'w-4 bg-white/50'
                  }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
        >
          <Button
            color="white"
            className={`m-8  ${
              selectedDimensions === '3x3' ? 'bg-yellow-300' : 'bg-white'
            }`}
            onClick={() => {
              setBingoCard({ ...bingoCard, dimensions: '3x3' });
              setSelectedDimensions('3x3');
            }}
          >
            <div className=" grid grid-cols-3 grid-rows-3 gap-1 justify-center items-center">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className="square w-6 h-6 m-auto bg-blue-500"
                ></div>
              ))}
            </div>
            <Typography className="text-center">3x3</Typography>
          </Button>

          <Button
            color="white"
            className={`m-8  ${
              selectedDimensions === '4x4' ? 'bg-yellow-300' : 'bg-white'
            }`}
            onClick={() => {
              setBingoCard({ ...bingoCard, dimensions: '4x4' });
              setSelectedDimensions('4x4');
            }}
          >
            <div className="grid grid-cols-4 grid-cols-auto grid-rows-4 gap-1 justify-center items-center">
              {[...Array(16)].map((_, index) => (
                <div
                  key={index}
                  className="square w-6 h-6 m-auto bg-blue-500"
                ></div>
              ))}
            </div>
            <Typography className="text-center">4x4</Typography>
          </Button>

          <Button
            color="white"
            className={`m-8  ${
              selectedDimensions === '5x5' ? 'bg-yellow-300' : 'bg-white'
            }`}
            onClick={() => {
              setBingoCard({ ...bingoCard, dimensions: '5x5' });
              setSelectedDimensions('5x5');
            }}
          >
            <div className="grid grid-cols-5 grid-rows-6 gap-1 justify-center items-center">
              {/* Agregar la primera fila con la palabra "BINGO" */}
              <div className="col-span-5 flex justify-center items-center">
                <div className="font-bold text-sm grid grid-cols-5 gap-3">
                  <div className="col-span-1">B</div>
                  <div className="col-span-1">I</div>
                  <div className="col-span-1">N</div>
                  <div className="col-span-1">G</div>
                  <div className="col-span-1">O</div>
                </div>
              </div>

              {[...Array(30)].map((_, index) => (
                <div
                  key={index}
                  className="square w-5 h-5 m-auto bg-blue-500"
                ></div>
              ))}
            </div>

            <Typography className="text-center m-0">5x5</Typography>
          </Button>
        </Carousel>

        <div className="w-80">
          <Typography variant="h5" className="text-left my-2">
            Reglamento
          </Typography>
          <Textarea
            label="Escribe las reglas del juego"
            name="rules"
            onChange={(e) => handleCreateNewBingo(e)}
            value={bingoCard.rules}
          />
        </div>
      </Card>

      {/* 2nd Card Bingo personalizar el contenido del carton */}
      <Card className="w-full bg-blue-gray-100 p-5 border-2 hover:shadow-2xl">
        <Typography variant="h5" className="mb-3">
          Valores del Bingo
        </Typography>
        <div className="mb-3 flex justify-center gap-2">
          <Button variant="gradient" className="flex items-center gap-3">
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
          </Button>
          <Button
            variant="gradient"
            className="flex items-center gap-3"
            onClick={handleOpenOne}
          >
            Generar Balotas
          </Button>
          <Button variant="gradient" className="flex items-center gap-3">
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
            Agregar Balotas
          </Button>
        </div>

        {/* Table del contenido del bingo*/}
        <Card className="m-auto h-96 w-11/12 overflow-scroll overflow-y-auto">
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
              {bingoCard.bingo_values.length === 1
                ? null
                : bingoCard.bingo_values?.map((item, index) => (
                    <tr key={item.id} className="even:bg-blue-gray-50/50">
                      {/* tipo valor en carton */}
                      <td className="p-4">
                        {' '}
                        <Chip
                          color={item.carton_type === 'text' ? 'blue' : 'green'}
                          value={item.carton_type}
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
                          color={item.ballot_type === 'text' ? 'blue' : 'green'}
                          value={item.ballot_type}
                        />
                      </td>
                      {/* valor balota */}
                      <td className="p-4">
                        {item.carton_type === 'image' ? (
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
                      <td className="p-4 flex flex-col items-center justify-center ">
                        <button
                          className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-5 max-w-[40px] h-5 max-h-[40px] text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20 rounded-full"
                          type="button"
                          onClick={() => handleOpenTwo(index)}
                        >
                          <span class="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
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
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </Card>
      </Card>

      {/* Dialog para configurar tema de carton y cantidad de valores */}
      <Dialog open={openOne} size="xs" handler={handleOpenOne}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            Gestionar Valores
          </DialogHeader>
          {/* Icono X */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpenOne}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>
          {/* establecer cantidad */}
          <Typography color="gray" variant="lead">
            Cantidad de valores a jugar
          </Typography>
          <div className="w-1/4  flex justify-around">
            <button
              className={`w-10 border-2 ${
                selectedNumValues === 3 ? 'bg-blue-500' : 'bg-violet-500'
              } hover:bg-violet-600  focus:ring-violet-300`}
              onClick={() => handleNumValuesToPlayChange(3)}
            >
              3
            </button>
            <button
              className={`w-10 border-2 ${
                selectedNumValues === 5 ? 'bg-blue-500' : 'bg-violet-500'
              } hover:bg-violet-600  focus:ring-violet-300`}
              onClick={() => handleNumValuesToPlayChange(5)}
            >
              5
            </button>
            <button
              className={`w-10 border-2 ${
                selectedNumValues === 10 ? 'bg-blue-500' : 'bg-violet-500'
              } hover:bg-violet-600  focus:ring-violet-300`}
              onClick={() => handleNumValuesToPlayChange(10)}
            >
              10
            </button>
            <button
              className={`w-10 border-2 ${
                selectedNumValues === 75 ? 'bg-blue-500' : 'bg-violet-500'
              } hover:bg-violet-600  focus:ring-violet-300`}
              onClick={() => handleNumValuesToPlayChange(75)}
            >
              75
            </button>
          </div>
          {/* establecer el tema */}
          <Typography className="mb-3 " color="gray" variant="lead">
            Tema del Cartón
          </Typography>
          <div className="grid grid-cols-3 gap-3">
            {/* Numeros */}
            <Button
              className={`bg-gray-200 cursor-pointer text-gray-700  text-center ${
                selectedTheme === 'default' ? 'bg-blue-500 text-white' : ''
              }`}
              name="default"
              onClick={(e) => handleCreateNewBingo(e, 'default')}
            >
              <h6>Numeros</h6>
            </Button>
            {/* Texto */}
            <Button
              className={`h-10 bg-gray-200 cursor-pointer  text-gray-700 text-center  ${
                selectedTheme === 'text' ? 'bg-blue-500 text-white' : ''
              }`}
              name="text"
              onClick={(e) => handleCreateNewBingo(e, 'text')}
            >
              <h6>Texto</h6>
            </Button>
            {/* Imagenes */}
            <Button
              className={`h-10 bg-gray-200 cursor-pointer text-gray-700  text-center ${
                selectedTheme === 'image' ? 'bg-blue-500 text-white' : ''
              }`}
              name="image"
              onClick={(e) => handleCreateNewBingo(e, 'image')}
            >
              <h6>Imagenes</h6>
            </Button>
          </div>
        </DialogBody>
      </Dialog>

      {/* Dialog */}
      <Dialog open={openTwo} size="xs" handler={() => setOpenTwo(!openTwo)}>
        <div className="flex items-center justify-between">
          <DialogHeader className="flex flex-col items-start">
            <Typography color="gray" variant="lead">
              Personalizar Contenido
            </Typography>
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpenTwo}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody>
          <div className="flex flex-col gap-2">
            <Typography color="gray" variant="h6">
              Ingresar Valor en el Cartón
            </Typography>
            {selectedCartonType === 'image' ? (
              <>
                <Typography className="mb-1" color="gray" variant="lead">
                  Elige una Imagen
                </Typography>
                <div className="grid gap-2">
                  <Input
                    label="Selecciona un archivo"
                    type="file"
                    placeholder="Selecciona un archivo de imagen"
                    onChange={handleImageChange}
                  />
                  <Input
                    label="Ingresar valor"
                    placeholder="Ingresar valor"
                    onChange={(e) => setNewCustomValue(e.target.value)}
                    value={newCustomValue}
                  />
                </div>
              </>
            ) : (
              <Input
                label="Ingresar valor"
                placeholder="Ingresar valor"
                onChange={(e) => setNewCustomValueCarton(e.target.value)}
                value={newCustomValueCarton}
              />
            )}

            {/* Cambiar de tipo */}
            <Typography color="gray" variant="h6">
              Cambiar el tipo
            </Typography>
            <div className="grid grid-cols-3 gap-3">
              {/* Numeros */}
              <Button
                className={`bg-gray-200 cursor-pointer text-gray-700  text-center ${
                  selectedCartonType === 'default'
                    ? 'bg-blue-500 text-white'
                    : ''
                }`}
                name="default"
                onClick={() => setSelectedCartonType('default')}
              >
                <h6>Numeros</h6>
              </Button>
              {/* Texto */}
              <Button
                className={`h-10 bg-gray-200 cursor-pointer  text-gray-700 text-center  ${
                  selectedCartonType === 'text' ? 'bg-blue-500 text-white' : ''
                }`}
                name="text"
                onClick={() => setSelectedCartonType('text')}
              >
                <h6>Texto</h6>
              </Button>
              {/* Imagenes */}
              <Button
                className={`h-10 bg-gray-200 cursor-pointer text-gray-700  text-center ${
                  selectedCartonType === 'image' ? 'bg-blue-500 text-white' : ''
                }`}
                name="image"
                onClick={() => setSelectedCartonType('image')}
              >
                <h6>Imagenes</h6>
              </Button>
            </div>
            <Typography color="gray" variant="h6">
              Ingresar Valor en la Balota
            </Typography>
            {selectedBallotType === 'image' ? (
              <>
                <Typography className="mb-1" color="gray" variant="lead">
                  Elige una Imagen
                </Typography>
                <div className="grid gap-2">
                  <Input
                    label="Selecciona un archivo"
                    type="file"
                    placeholder="Selecciona un archivo de imagen"
                    onChange={handleImageChange}
                  />
                  <Input
                    label="Ingresar valor"
                    placeholder="Ingresar valor"
                    onChange={(e) => setNewCustomValue(e.target.value)}
                    value={newCustomValue}
                  />
                </div>
              </>
            ) : (
              <Input
                label="Ingresar valor"
                placeholder="Ingresar valor"
                onChange={(e) => setNewCustomValueBallot(e.target.value)}
                value={newCustomValueBallot}
              />
            )}
            {/* cambiar de tipo */}
            <Typography color="gray" variant="h6">
              Cambiar el tipo
            </Typography>
            <div className="grid grid-cols-3 gap-3">
              {/* Numeros */}
              <Button
                className={`bg-gray-200 cursor-pointer text-gray-700  text-center ${
                  selectedBallotType === 'default'
                    ? 'bg-blue-500 text-white'
                    : ''
                }`}
                name="default"
                onClick={() => setSelectedBallotType('default')}
              >
                <h6>Numeros</h6>
              </Button>
              {/* Texto */}
              <Button
                className={`h-10 bg-gray-200 cursor-pointer  text-gray-700 text-center  ${
                  selectedBallotType === 'text' ? 'bg-blue-500 text-white' : ''
                }`}
                name="text"
                onClick={() => setSelectedBallotType('text')}
              >
                <h6>Texto</h6>
              </Button>
              {/* Imagenes */}
              <Button
                className={`h-10 bg-gray-200 cursor-pointer text-gray-700  text-center ${
                  selectedBallotType === 'image' ? 'bg-blue-500 text-white' : ''
                }`}
                name="image"
                onClick={() => setSelectedBallotType('image')}
              >
                <h6>Imagenes</h6>
              </Button>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={() => setOpenTwo(false)}>
            Cancelar
          </Button>
          <Button
            variant="gradient"
            color="gray"
            onClick={handleSaveCustomValue}
          >
            Enviar
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default DimensionsBingoCard;
