import {
  Typography,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from '@material-tailwind/react';
import { useContext, useState, useEffect } from 'react';
import { NewBingoContext } from '../../../context/NewBingoContext';

const DialogValueCartonAndBallot = ({
  openDialogValueCartonAndBallot,
  setOpenDialogValueCartonAndBallot,
  editIndex,
  setEditIndex,
  positionsDisabled,
}) => {
  const { bingoCard, updateBingoCard } = useContext(NewBingoContext);

  //guarda el valor de carton y balota del objeto que se esta editando
  const [selectedItem, setSelectedItem] = useState(null);

  //estado para personalizar el valor del carton y de la balota text y number y tambien imagen si viene de url externa
  const [newCustomValueCarton, setNewCustomValueCarton] = useState('');
  // console.log('valor del carton', newCustomValueCarton);
  const [newCustomValueBallot, setNewCustomValueBallot] = useState('');
  // console.log('valor balota', newCustomValueBallot);
  const [newCustomImageCartonUrl, setNewCustomImageCartonUrl] = useState('');
  const [newCustomImageBallotUrl, setNewCustomImageBallotUrl] = useState('');
  //estados para capturar el tipo de forma independiente en la tabla para editar
  const [selectedCartonType, setSelectedCartonType] = useState('');
  // console.log('tipo carton', selectedCartonType);
  const [selectedBallotType, setSelectedBallotType] = useState('');
  // console.log('tipo balota', selectedBallotType);
  //estado para personalizar la imagen desde un archivo local
  const [newCustomValueCartonImage, setNewCustomValueCartonImage] =
    useState('');
  const [newCustomValueBallotImage, setNewCustomValueBallotImage] =
    useState('');

  //seleccionar posiciones para el valor del carton
  const [selectedPositions, setSelectedPositions] = useState([]);

  // UseEffect para actualizar los valores cuando el índice de edición cambie
  useEffect(() => {
    if (editIndex !== null) {
      setSelectedItem(bingoCard.bingo_values[editIndex]);
    }
  }, [editIndex, bingoCard.bingo_values]);

  // UseEffect para establecer los valores iniciales de los campos
  useEffect(() => {
    if (selectedItem) {
      setNewCustomValueCarton(selectedItem.carton_value || '');
      setNewCustomValueBallot(selectedItem.ballot_value || '');
      setSelectedCartonType(selectedItem.carton_type || '');
      setSelectedBallotType(selectedItem.ballot_type || '');
      setSelectedPositions(selectedItem.positions || []);
    }
  }, [selectedItem]);

  const handleSaveCustomValue = () => {
    if (editIndex !== null) {
      const updatedBingoValues = [...bingoCard.bingo_values];
      const editedItem = updatedBingoValues[editIndex];
      editedItem.carton_value = newCustomValueCarton;
      editedItem.carton_type = selectedCartonType;
      editedItem.ballot_value = newCustomValueBallot;
      editedItem.ballot_type = selectedBallotType;
      if (editedItem.carton_type ==="image" && newCustomValueCartonImage) {
        editedItem.carton_value = newCustomValueCartonImage;
      }
      if (editedItem.ballot_type ==="image" && newCustomValueBallotImage) {
        editedItem.ballot_value = newCustomValueBallotImage;
      }

      updateBingoCard((prevState) => ({
        ...prevState,
        bingo_values: updatedBingoValues,
      }));
    }

    setNewCustomValueCarton('');
    setNewCustomValueBallot('');
    setEditIndex(null);
    setOpenDialogValueCartonAndBallot(false);
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
    updateBingoCard((prevBingoCard) => {
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

  // UseEffect para actualizar los valores cada vez que el índice de edición cambie
  useEffect(() => {
    if (editIndex !== null) {
      const currentItem = bingoCard.bingo_values[editIndex];
      setNewCustomValueCarton(currentItem.carton_value || '');
      setNewCustomValueBallot(currentItem.ballot_value || '');
    }
  }, [editIndex]);

  return (
    <Dialog
      open={openDialogValueCartonAndBallot}
      size="xs"
      handler={() => setOpenDialogValueCartonAndBallot(false)}
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
          onClick={() => setOpenDialogValueCartonAndBallot(false)}
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
                  onChange={(e) => setNewCustomImageCartonUrl(e.target.value)}
                  value={newCustomImageCartonUrl}
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
                      positionsDisabled.includes(index)
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
                    positionsDisabled.includes(index)
                      ? 'bg-red-600 cursor-not-allowed'
                      : 'bg-blue-500 '
                  }
                      bg-blue-500 `}
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
                    positionsDisabled.includes(index)
                      ? 'bg-red-600 cursor-not-allowed'
                      : 'bg-blue-500 '
                  }
                      bg-blue-500 `}
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
                selectedCartonType === 'default' ? 'bg-blue-500 text-white' : ''
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
                  onChange={(e) => setNewCustomImageBallotUrl(e.target.value)}
                  value={newCustomImageBallotUrl}
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
                selectedBallotType === 'default' ? 'bg-blue-500 text-white' : ''
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
        <Button
          variant="text"
          color="gray"
          onClick={() => setOpenDialogValueCartonAndBallot(false)}
        >
          Cancelar
        </Button>
        <Button variant="gradient" color="gray" onClick={handleSaveCustomValue}>
          Enviar
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogValueCartonAndBallot;
