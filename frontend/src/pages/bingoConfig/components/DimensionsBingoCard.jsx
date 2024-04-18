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
  'Tipo de Cartón',
  'Cantidad Valores',
  'Valor de la Balota',
  'Opciones',
];

const DimensionsBingoCard = ({ sendBingoCreated }) => {
  //estados para abrir o cerer los Dialogs
  const [openOne, setOpenOne] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  //estados para editar cada objeto dentro del array bingoValues
  const [editIndex, setEditIndex] = useState(null);
  const [newCustomValue, setNewCustomValue] = useState('');
  const [numValuesToPlay, setNumValuesToPlay] = useState('');

  //estado creación de un objeto del carton del bingo personalizado
  const [bingoCard, setBingoCard] = useState({
    title: '',
    rules: '',
    creatorId: null,
    bingoAppearance: {},
    bingoValues: [
      {
        id: '',
        value: '',
        type: '',
        imageUrl: '',
      },
    ],
    dimensions: '',
  });

  // estados para marcar el color de estilo de la opcion seleccionada como el tema, cantidad de valores y dimensiones
  const [selectedNumValues, setSelectedNumValues] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedDimensions, setSelectedDimensions] = useState(null);

  //setea la cantidad de objetos dentro del array bingoValues y les asigna un id
  const handleNumValuesToPlayChange = (value) => {
    setNumValuesToPlay(value);
    const newBingoValues = Array.from({ length: value }, (_, index) => ({
      id: index + 1,
      value: '',
      type: selectedTheme,
      imageUrl: '',
    }));

    setBingoCard((prevState) => ({
      ...prevState,
      bingoValues: newBingoValues,
    }));
    setSelectedNumValues(value);
  };

  //maneja el editar cada uno de los valores que es el contenido de cada celda dentro del carton del bingo
  const handleSaveCustomValue = () => {
    if (editIndex !== null) {
      const updatedBingoValues = [...bingoCard.bingoValues];
      const editedItem = updatedBingoValues[editIndex];
      if (editedItem.type === 'image') {
        editedItem.imageUrl = newCustomValue;
      } else {
        editedItem.value = newCustomValue;
      }
      setBingoCard((prevState) => ({
        ...prevState,
        bingoValues: updatedBingoValues,
      }));
    }
    setOpenTwo(false);
    setNewCustomValue('');
    setEditIndex(null);
  };

  //cambia el valor de la propiedad type dentro del array de bingoValues y tambien captura lo que entra por input como el titulo y las reglas
  const handleCreateNewBingo = (e, type) => {
    const name = e.target.name;
    const value = e.target.value;
    const updatedBingoValues = bingoCard.bingoValues.map((item) => ({
      ...item,
      type: type,
    }));

    if (name === 'title' || name === 'rules') {
      setBingoCard((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      setBingoCard((prevState) => ({
        ...prevState,
        bingoValues: updatedBingoValues,
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
  const handleOpenTwo = (index) => {
    setEditIndex(index);
    setOpenTwo(!openTwo);
  };

  //envia la actualizacion del estado bingoCard al componente BingoConfig a traves de la funcion sendBingoCreated que recibe este componente por props
  useEffect(() => {
    sendBingoCreated(bingoCard);
  }, [bingoCard]);

  return (
    <div className=" flex flex-col lg:flex-row gap-3 ">
      {/* 1st Card: Tittle,  Dimentions and Rules */}
      <Card className="w-2/5 bg-white p-5 flex justify-center items-center gap-3 border-gray-50 border-2 text-center">
        <Typography variant="h5" className="text-center">
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
            <div className="grid grid-cols-5 grid-rows-5 gap-1 justify-center items-center">
              {[...Array(25)].map((_, index) => (
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
            Agregar
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
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
              {bingoCard.bingoValues.length === 1
                ? null
                : bingoCard.bingoValues?.map((item, index) => (
                    <tr key={item.id} className="even:bg-blue-gray-50/50">
                      <td className="p-4">
                        {' '}
                        <Chip
                          color={item.type === 'text' ? 'blue' : 'green'}
                          value={item.type}
                        />
                      </td>
                      <td className="p-4">
                        {' '}
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {item.id}
                        </Typography>{' '}
                      </td>

                      <td className="p-4">
                        {item.type === 'image' ? (
                          item.imageUrl ? (
                            <img
                              className="m-auto"
                              src={item.imageUrl}
                              alt="Imagen"
                              height={50}
                              width={50}
                              key={item.imageUrl}
                            />
                          ) : (
                            '-'
                          )
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {!item.value ? '-' : item.value}
                          </Typography>
                        )}
                      </td>
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
      <Dialog open={openOne} size="xl" handler={handleOpenOne}>
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
          {/* establecer los valores */}
          <Typography className="mt-5" color="gray" variant="lead">
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
                selectedNumValues === 20 ? 'bg-blue-500' : 'bg-violet-500'
              } hover:bg-violet-600  focus:ring-violet-300`}
              onClick={() => handleNumValuesToPlayChange(20)}
            >
              20
            </button>
          </div>
          <Typography className="mb-3 " color="gray" variant="lead">
            Tema del Cartón
          </Typography>
          <div className="grid grid-cols-3 gap-3">
            {/* Numeros */}
            <Card
              className={`bg-gray-200 cursor-pointer ${
                selectedTheme === 'default' ? 'bg-blue-500 text-white' : ''
              }`}
              name="default"
              onClick={(e) => handleCreateNewBingo(e, 'default')}
            >
              <CardBody className="text-center">
                <h6>Numeros</h6>
              </CardBody>
            </Card>
            {/* Texto */}
            <Card
              className={`bg-gray-200 cursor-pointer ${
                selectedTheme === 'text' ? 'bg-blue-500 text-white' : ''
              }`}
              name="text"
              onClick={(e) => handleCreateNewBingo(e, 'text')}
              value={bingoCard.bingoValues.map((item) => {
                item.type;
              })}
            >
              <CardBody className="text-center">
                <h6>Texto</h6>
              </CardBody>
            </Card>
            {/* Imagenes */}
            <Card
              className={`bg-gray-200 cursor-pointer ${
                selectedTheme === 'image' ? 'bg-blue-500 text-white' : ''
              }`}
              name="image"
              onClick={(e) => handleCreateNewBingo(e, 'image')}
            >
              <CardBody className="text-center">
                <h6>Imagenes</h6>
              </CardBody>
            </Card>
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
          {selectedTheme === 'image' ? (
            <>
              <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
                Elige una Imagen
              </Typography>
              <div className="grid gap-6">
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
            <>
              <Typography className="mb-10 -mt-7 " color="gray" variant="lead">
                Ingresar Valores
              </Typography>
              <div className="grid gap-6">
                <Input
                  label="Ingresar valor"
                  placeholder="Ingresar valor"
                  onChange={(e) => setNewCustomValue(e.target.value)}
                  value={newCustomValue}
                />
              </div>
            </>
          )}
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
