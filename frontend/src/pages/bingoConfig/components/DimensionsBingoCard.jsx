import { useEffect, useState, useRef } from 'react';
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
} from '@material-tailwind/react';
import TemplatesBingos from './TemplateBingos';

const TABLE_HEAD = [
  'Tipo valor en Cartón',
  'Valor en el Cartón',
  'Tipo Balota',
  'Valor en la Balota',
  'Opciones',
  '-',
];

const DimensionsBingoCard = ({ sendBingoCreated }) => {
  //estados para abrir o cerrar los Dialogs
  const [openOne, setOpenOne] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);

  //estados para editar cada objeto dentro del array bingoValues
  const [editIndex, setEditIndex] = useState(null);

  // Estado para el valor del input
  const [newCustomValue, setNewCustomValue] = useState('');
  // Estado para el tipo seleccionado
  const [selectedType, setSelectedType] = useState('');

  //estado para personalizar el valor del carton y de la balota text y number y tambien imagen si viene de url externa
  const [newCustomValueCarton, setNewCustomValueCarton] = useState('');
  const [newCustomValueBallot, setNewCustomValueBallot] = useState('');

  //estado para personalizar la imagen desde un archivo local
  const [newCustomValueCartonImage, setNewCustomValueCartonImage] =
    useState('');
  const [newCustomValueBallotImage, setNewCustomValueBallotImage] =
    useState('');

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
        positions: [],
      },
    ],
    positions_disabled: [
      {
        position: 0,
        default_image: '',
      },
    ],
    dimensions: '',
  });

  //establecer el nuevo valor de objetos que tendra el array bingoValues
  const [selectedNumValues, setSelectedNumValues] = useState(null);

  // estados para marcar el color de estilo de la opcion seleccionada como el tema, cantidad de valores y dimensiones (posicions en el bingo Tradional)
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedDimensions, setSelectedDimensions] = useState(null);

  const [selectedPositions, setSelectedPositions] = useState([]);
  console.log(selectedPositions);
  const [disabledPositions, setDisabledPositions] = useState([]);
  const [sizeChangeCount, setSizeChangeCount] = useState(0);
  const isFirstSizeChange = useRef(true);

  //estados para capturar el tipo de forma independiente en la tabla para editar
  const [selectedCartonType, setSelectedCartonType] = useState('');

  const [selectedBallotType, setSelectedBallotType] = useState('');

  // Función para manejar el cambio de tipo
  // const handleTypeChange = (type) => {
  //   // Obtener el valor actual del input
  //   const currentValue = newCustomValue;

  //   // Limpiar el valor del input si el tipo cambia y no es 'image'
  //   if (type !== selectedType && selectedType !== 'image') {
  //     setNewCustomValue('');
  //   }

  //   // Actualizar el tipo seleccionado
  //   setSelectedType(type);

  //   // Restaurar el valor del input si el tipo cambia de 'image' a otro tipo
  //   if (type !== 'image' && currentValue !== '') {
  //     setNewCustomValue(currentValue);
  //   }
  // };

  //setea la cantidad de objetos dentro del array bingoValues
  const handleNumValuesToPlayChange = (value) => {
    setNumValuesToPlay(value);
    const newBingoValues = Array.from({ length: value }, (_, index) => ({
      carton_value: '',
      carton_type: '',
      ballot_value: '',
      ballot_type: '',
      positions: [],
    }));

    setBingoCard((prevState) => ({
      ...prevState,
      bingo_values: newBingoValues,
    }));
    setSelectedNumValues(value);
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

    setBingoCard((prevState) => ({
      ...prevState,
      bingo_values: [...prevState.bingo_values, newBalota],
    }));
  };

  //elimina un objeto dentro del array bingoValues
  const handleDeleteValueInBingoValues = (index) => {
    const updatedBingoValues = bingoCard.bingo_values.filter(
      (_, i) => i !== index
    );
    setBingoCard((prevState) => ({
      ...prevState,
      bingo_values: updatedBingoValues,
    }));
  };

  // edita cada uno de los objetos de manera independiente dentro del array "bingo_values"
  const handleSaveCustomValue = () => {
    if (editIndex !== null) {
      const updatedBingoValues = [...bingoCard.bingo_values];
      const editedItem = updatedBingoValues[editIndex];
      editedItem.carton_value = newCustomValueCarton;
      editedItem.carton_type = selectedCartonType;
      editedItem.ballot_value = newCustomValueBallot;
      editedItem.ballot_type = selectedBallotType;
      if (newCustomValueCartonImage) {
        editedItem.carton_value = newCustomValueCartonImage;
      }
      if (newCustomValueBallotImage) {
        editedItem.ballot_value = newCustomValueBallotImage;
      }

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

  // Función para manejar el cambio de imagen desde un archivo local
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'carton') {
          setNewCustomValueCartonImage(reader.result);
        } else if (type === 'balota') {
          setNewCustomValueBallotImage(reader.result);
        }
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
    const currentItem = bingoCard.bingo_values[index];
    setEditIndex(index);
    setOpenTwo(!openTwo);
    setSelectedCartonType(currentItem.carton_type);
    setSelectedBallotType(currentItem.ballot_type);
    setNewCustomValueCarton(currentItem.carton_value);
    setNewCustomValueBallot(currentItem.ballot_value);
    setNewCustomValueCartonImage(currentItem.carton_value);
    setNewCustomValueBallotImage(currentItem.ballot_value);
    setSelectedPositions(currentItem.positions);
  };

  //guarda en el array de position dentro del estado bingoCard los index
  const handleSelectedPosition = (index) => {
    // Verificar si el índice ya está en selectedPositions
    const isSelected = selectedPositions.includes(index);

    // Si está seleccionado, lo removemos; de lo contrario, lo agregamos
    const newSelectedPositions = isSelected
      ? selectedPositions.filter((pos) => pos !== index)
      : [...selectedPositions, index];

    // Actualizamos el estado selectedPositions
    setSelectedPositions(newSelectedPositions);

    // Actualizamos el estado bingoCard con las nuevas posiciones
    setBingoCard((prevBingoCard) => {
      const newBingoCard = { ...prevBingoCard };

      // Actualizamos las posiciones del valor actual
      newBingoCard.bingo_values = newBingoCard.bingo_values.map(
        (value, idx) => {
          if (idx === editIndex) {
            // Asignamos las nuevas posiciones
            value.positions = newSelectedPositions;
          }
          return value;
        }
      );

      return newBingoCard;
    });
  };

  //desabilitar posiciones cuando selecciono un tamaño
  const handleDisabledPosition = (index) => {
    console.log('tamaña desabilitar', index);
    // Verificar si el índice ya está en disabledPositions
    const isSelected = disabledPositions.includes(index);

    // Si está seleccionado, lo removemos; de lo contrario, lo agregamos
    const newDisabledPositions = isSelected
      ? disabledPositions.filter((pos) => pos !== index)
      : [...disabledPositions, index];

    // Actualizamos el estado disabledPositions
    setDisabledPositions(newDisabledPositions);

    // Actualizamos el estado bingoCard con las nuevas posiciones deshabilitadas
    setBingoCard((prevState) => {
      const newBingoCard = { ...prevState };

      // Verificar si el índice ya está en positions_disabled
      const existingIndex = newBingoCard.positions_disabled.findIndex(
        (item) => item.position === index
      );

      if (isSelected) {
        // Si el índice ya está seleccionado, lo eliminamos de positions_disabled
        if (existingIndex !== -1) {
          newBingoCard.positions_disabled.splice(existingIndex, 1);
        }
      } else {
        // Si el índice no está seleccionado, lo agregamos a positions_disabled
        if (existingIndex === -1) {
          newBingoCard.positions_disabled.push({
            position: index,
            default_image: '', // Puedes agregar la imagen predeterminada si es necesario
          });
        }
      }

      return newBingoCard;
    });
  };

  //envia la actualizacion del estado bingoCard al componente BingoConfig a traves de la funcion sendBingoCreated que recibe este componente por props

  // const handleSizeChange = (newSize) => {
  //   if (firstTimeSizeChange) {
  //     // Si es la primera vez, simplemente cambia el tamaño sin preguntar
  //     setFirstTimeSizeChange(false);
  //     setBingoCard((prevBingoCard) => ({
  //       ...prevBingoCard,
  //       dimensions: newSize,
  //     }));
  //   } else {
  //     // Si no es la primera vez, muestra la ventana de confirmación
  //     const confirmChange = window.confirm("¿Estás seguro de querer cambiar el tamaño del cartón? Esto borrará las selecciones y deshabilitaciones actuales.");
  //     if (confirmChange) {
  //       // Limpiar los estados
  //       setSelectedPositions([]);
  //       setDisabledPositions([]);
  //       // Actualizar el estado de bingoCard con el nuevo tamaño
  //       setBingoCard((prevBingoCard) => ({
  //         ...prevBingoCard,
  //         dimensions: newSize,
  //       }));
  //     }
  //   }
  // };

  // const handleSizeChange = (newSize) => {
  //   if (firstTimeSizeChange) {
  //     // Si es la primera vez, simplemente cambia el tamaño sin preguntar
  //     setFirstTimeSizeChange(false);
  //     setBingoCard((prevBingoCard) => ({
  //       ...prevBingoCard,
  //       dimensions: newSize,
  //     }));
  //   } else {
  //     // Si no es la primera vez, muestra la ventana de confirmación
  //     const confirmChange = window.confirm("¿Estás seguro de querer cambiar el tamaño del cartón? Esto borrará las selecciones y deshabilitaciones actuales.");
  //     if (confirmChange) {
  //       // Limpiar los estados
  //       setSelectedPositions([]);
  //       setDisabledPositions([]);
  //       console.log(selectedPositions)
  //       // Actualizar el estado de bingoCard con el nuevo tamaño
  //       setBingoCard((prevBingoCard) => ({
  //         ...prevBingoCard,
  //         dimensions: newSize,
  //       }));
  //     }
  //   }
  // };

  // const handleSizeChange = (newDimension) => {
  //   const currentDimension = bingoCard.dimensions;

  //   // Verificar si el tamaño actual es diferente al nuevo tamaño seleccionado
  //   if (currentDimension !== newDimension) {
  //     // Mostrar mensaje de confirmación
  //     if (!firstTimeSizeChange.current) {
  //       if (!window.confirm('¿Estás seguro de cambiar el tamaño del cartón?')) {
  //         return; // Cancelar si el usuario no confirma
  //       }
  //     } else {
  //       firstTimeSizeChange.current = false;
  //     }

  //     // Limpiar los estados
  //     setSelectedPositions([]);
  //     setDisabledPositions([]);
  //     console.log(selectedPositions)

  //     // Actualizar el estado de bingoCard con el nuevo tamaño
  //     setBingoCard((prevBingoCard) => ({
  //       ...prevBingoCard,
  //       dimensions: newDimension,
  //       bingo_values: prevBingoCard.bingo_values.map((value) => ({
  //         ...value,
  //         positions: [],
  //       })),
  //     }));
  //   }
  // };

  const handleSizeChange = (newDimension) => {
    const currentDimension = bingoCard.dimensions;

    // Verificar si el tamaño actual es diferente al nuevo tamaño seleccionado
    if (currentDimension !== newDimension) {
      // Incrementar el contador de cambios de tamaño
      setSizeChangeCount((prevCount) => prevCount + 1);

      // Mostrar mensaje de confirmación a partir del segundo cambio de tamaño
      if (sizeChangeCount > 0) {
        if (!window.confirm('¿Estás seguro de cambiar el tamaño del cartón?')) {
          return; // Cancelar si el usuario no confirma
        }
      }

      // Limpiar los estados
      setSelectedPositions([]);
      setDisabledPositions([]);

      // Actualizar el estado de bingoCard con el nuevo tamaño
      setBingoCard((prevBingoCard) => ({
        ...prevBingoCard,
        dimensions: newDimension,
        bingo_values: prevBingoCard.bingo_values.map((value) => ({
          ...value,
          positions: [],
        })),
      }));
    }
  };

  useEffect(() => {
    sendBingoCreated(bingoCard);
  }, [bingoCard]);

  //inicialmente aparezcan 75 filas en la tabla para personalizar
  useEffect(() => {
    handleNumValuesToPlayChange(10);
  }, []);

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
        <Typography variant="h5" className="text-center">
          Tamaño del Cartón y desabilitar posiciones
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
            // onClick={() => {
            //   setBingoCard({ ...bingoCard, dimensions: '3x3' });
            //   setSelectedDimensions('3x3');
            //   handleSizeChange('3x3')
            // }}
          >
            <div className=" grid grid-cols-3 grid-rows-3 gap-1 justify-center items-center">
              {[...Array(9)].map((_, index) => (
                <div
                  key={index}
                  className={`square w-6 h-6 m-auto ${
                    disabledPositions.includes(index)
                      ? 'bg-red-500'
                      : 'bg-blue-500 cursor-pointer'
                  } bg-blue-500 cursor-pointer`}
                  onClick={() => handleDisabledPosition(index)}
                ></div>
              ))}
            </div>
            <Typography
              className="text-center"
              onClick={() => {
                setBingoCard({ ...bingoCard, dimensions: '3x3' });
                setSelectedDimensions('3x3');
                handleSizeChange('3x3');
              }}
            >
              3x3
            </Typography>
          </Button>

          <Button
            color="white"
            className={`m-8  ${
              selectedDimensions === '4x4' ? 'bg-yellow-300' : 'bg-white'
            }`}
            // onClick={() => {
            //   setBingoCard({ ...bingoCard, dimensions: '4x4' });
            //   setSelectedDimensions('4x4');
            //   handleSizeChange('4x4')
            // }}
          >
            <div className="grid grid-cols-4 grid-cols-auto grid-rows-4 gap-1 justify-center items-center">
              {[...Array(16)].map((_, index) => (
                <div
                  key={index}
                  className={`square w-6 h-6 m-auto ${
                    disabledPositions.includes(index)
                      ? 'bg-red-500'
                      : 'bg-blue-500 cursor-pointer'
                  } bg-blue-500 cursor-pointer`}
                  onClick={() => handleDisabledPosition(index)}
                ></div>
              ))}
            </div>
            <Typography
              className="text-center"
              onClick={() => {
                setBingoCard({ ...bingoCard, dimensions: '4x4' });
                setSelectedDimensions('4x4');
                handleSizeChange('4x4');
              }}
            >
              4x4
            </Typography>
          </Button>
          <div>
            <Button
              color="white"
              className={`m-8  ${
                selectedDimensions === '5x5' ? 'bg-yellow-300' : 'bg-white'
              }`}
              // onClick={() => {
              //   setBingoCard({ ...bingoCard, dimensions: '5x5' });
              //   setSelectedDimensions('5x5');
              //   handleSizeChange('5x5')
              // }}
            >
              <div className="grid grid-cols-5 grid-rows-6 gap-1 justify-center items-center">
                {[...Array(25)].map((_, index) => (
                  <div
                    key={index}
                    className={`square w-5 h-5 m-auto ${
                      disabledPositions.includes(index)
                        ? 'bg-red-500'
                        : 'bg-blue-500 cursor-pointer'
                    } bg-blue-500 cursor-pointer`}
                    onClick={() => handleDisabledPosition(index)}
                  ></div>
                ))}
              </div>
              <Typography
                className="text-center m-0"
                onClick={() => {
                  setBingoCard({ ...bingoCard, dimensions: '5x5' });
                  setSelectedDimensions('5x5');
                  handleSizeChange('5x5');
                }}
              >
                5x5
              </Typography>
            </Button>
          </div>
        </Carousel>

        <TemplatesBingos />

        <div className="w-80">
          <Typography variant="h5" className="text-left mt-6">
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

        {/* Table del contenido del bingo*/}
        <Card className="m-auto h-[600px] w-11/12 overflow-scroll overflow-y-auto">
          <table className="w-full min-w-max  table-auto text-center">
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
              {bingoCard.bingo_values?.map((item, index) => (
                <tr key={item.id} className="even:bg-blue-gray-50/50">
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
                      onClick={() => handleOpenTwo(index)}
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

      {/* Dialog para personalizar valor de carton y balota */}
      <Dialog
        open={openTwo}
        size="xs"
        handler={() => setOpenTwo(!openTwo)}
        className="overflow-y-auto max-h-[80vh]"
      >
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
                    onChange={(e) => handleImageChange(e, 'carton')}
                  />
                  <Input
                    label="Ingresar valor"
                    placeholder="Ingresar valor"
                    onChange={(e) => setNewCustomValueCarton(e.target.value)}
                    value={newCustomValueCarton}
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
            <Typography color="gray" variant="h6">
              Posiciones
            </Typography>{' '}
            {bingoCard.dimensions === '5x5' && (
              <>
                {' '}
                <div className=" w-[166px] m-auto p-3 grid grid-cols-5 grid-rows-6 gap-1 justify-center items-center bg-blue-gray-900">
                  {/* Agregar la primera fila con la palabra "BINGO" */}
                  {[...Array(25)].map((_, index) => (
                    <div
                      key={index}
                      className={`square w-5 h-5 m-auto ${
                        selectedPositions.includes(index)
                          ? 'bg-yellow-600'
                          : 'bg-blue-500'
                      } ${
                        disabledPositions.includes(index)
                          ? 'bg-red-600 cursor-not-allowed'
                          : 'bg-blue-500 '
                      } bg-blue-500 `}
                      onClick={() => handleSelectedPosition(index)}
                    ></div>
                  ))}
                </div>{' '}
              </>
            )}
            {bingoCard.dimensions === '3x3' && (
              <div className="w-[166px] m-auto p-3  grid grid-cols-3 grid-rows-3 gap-1 justify-center items-center bg-blue-gray-900">
                {[...Array(9)].map((_, index) => (
                  <div
                    key={index}
                    className={`square w-5 h-5 m-auto ${
                      selectedPositions.includes(index)
                        ? 'bg-yellow-600'
                        : 'bg-blue-500'
                    } ${
                      disabledPositions.includes(index)
                        ? 'bg-red-600 cursor-not-allowed'
                        : 'bg-blue-500 '
                    } bg-blue-500 `}
                    onClick={() => handleSelectedPosition(index)}
                  ></div>
                ))}
              </div>
            )}
            {bingoCard.dimensions === '4x4' && (
              <div className="w-[166px] m-auto p-3  grid grid-cols-4 grid-cols-auto grid-rows-4 gap-1 justify-center items-center bg-blue-gray-900">
                {[...Array(16)].map((_, index) => (
                  <div
                    key={index}
                    className={`square w-5 h-5 m-auto ${
                      selectedPositions.includes(index)
                        ? 'bg-yellow-600'
                        : 'bg-blue-500'
                    } ${
                      disabledPositions.includes(index)
                        ? 'bg-red-600 cursor-not-allowed'
                        : 'bg-blue-500 '
                    } bg-blue-500 `}
                    onClick={() => handleSelectedPosition(index)}
                  ></div>
                ))}
              </div>
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
                onClick={() => {
                  setSelectedCartonType('default');
                  setNewCustomValueCarton('');
                }}
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
                    onChange={(e) => handleImageChange(e, 'balota')}
                  />
                  <Input
                    label="Ingresar valor"
                    placeholder="Ingresar valor"
                    onChange={(e) => setNewCustomValueBallot(e.target.value)}
                    value={newCustomValueBallot}
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
