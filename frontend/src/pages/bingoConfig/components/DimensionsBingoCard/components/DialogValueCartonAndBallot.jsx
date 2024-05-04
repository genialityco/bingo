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
import {
  validationsEditInputsBallot,
  validationsEditInputsCarton,
} from '../../../../../utils/validationsEditInputs';
import { storage } from '../../../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const DialogValueCartonAndBallot = ({
  openDialogValueCartonAndBallot,
  setOpenDialogValueCartonAndBallot,
  editIndex,
  setEditIndex,
  positionsDisabled,
  dimension,
}) => {
  const { bingoCard, updateBingoCard } = useContext(NewBingoContext);

  //estado para editar dependiendo del tipo que eliga el usuario
  const [editInputsCarton, setEditInputsCarton] = useState({
    number: '',
    text: '',
    imageUrl: '',
  });

  const [editInputsBallot, setEditInputsBallot] = useState({
    number: '',
    text: '',
    imageUrl: '',
  });

  //estados para guardar el tipo para el carton y la balota
  const [selectedCartonType, setSelectedCartonType] = useState('');
  const [selectedBallotType, setSelectedBallotType] = useState('');
  //seleccionar posiciones para el valor del carton
  const [selectedPositions, setSelectedPositions] = useState([]);
  //estados para personalizar la imagen desde un archivo local
  const [newCustomValueCartonImage, setNewCustomValueCartonImage] =
    useState(null);
  const [newCustomValueBallotImage, setNewCustomValueBallotImage] =
    useState(null);
  //guarda el valor de carton y balota del objeto que se esta editando
  const [selectedItem, setSelectedItem] = useState(null);

  //guarda errores en el ingreso de los valores al carton
  const [errorsInputsCarton, setErrorsInputsCarton] = useState({});

  //guarda errores en el ingreso de los valores para la balota
  const [errorsInputsBallot, setErrorsInputsBallot] = useState({});

  // UseEffect para actualizar los valores cuando el índice de edición cambie
  useEffect(() => {
    if (editIndex !== null) {
      setSelectedItem(bingoCard.bingo_values[editIndex]);
    }
  }, [editIndex, bingoCard.bingo_values]);

  // UseEffect para establecer los valores iniciales de los campos
  useEffect(() => {
    if (selectedItem) {
      setSelectedCartonType(selectedItem.carton_type || '');
      setSelectedBallotType(selectedItem.ballot_type || '');
      setSelectedPositions(selectedItem.positions || []);

      setEditInputsCarton({
        number: '',
        text: '',
        imageUrl: '',
      });
      setEditInputsBallot({
        number: '',
        text: '',
        imageUrl: '',
      });

      // Establecer los valores iniciales del cartón según el tipo seleccionado
      if (selectedItem.carton_type === 'default') {
        setEditInputsCarton({
          number: selectedItem.carton_value || '',
          text: '',
          imageUrl: '',
        });
      } else if (selectedItem.carton_type === 'text') {
        setEditInputsCarton({
          number: '',
          text: selectedItem.carton_value || '',
          imageUrl: '',
        });
      } else if (selectedItem.carton_type === 'image') {
        setEditInputsCarton({
          number: '',
          text: '',
          imageUrl: selectedItem.carton_value || '',
        });
      }

      // Establecer los valores iniciales de la balota según el tipo seleccionado
      if (selectedItem.ballot_type === 'default') {
        setEditInputsBallot({
          number: selectedItem.ballot_value || '',
          text: '',
          imageUrl: '',
        });
      } else if (selectedItem.ballot_type === 'text') {
        setEditInputsBallot({
          number: '',
          text: selectedItem.ballot_value || '',
          imageUrl: '',
        });
      } else if (selectedItem.ballot_type === 'image') {
        setEditInputsBallot({
          number: '',
          text: '',
          imageUrl: selectedItem.ballot_value || '',
        });
      }
    }
  }, [selectedItem]);

  const renderCartonInputs = () => {
    if (selectedCartonType === 'default') {
      return (
        <div>
          <Input
            label="Ingresar valor numérico"
            placeholder="Ingrese un número"
            name="number"
            onChange={(e) => handleOnChangeEditInputsCarton(e)}
            value={editInputsCarton.number}
          />
          {errorsInputsCarton.number && <p>{errorsInputsCarton.number}</p>}
        </div>
      );
    } else if (selectedCartonType === 'text') {
      return (
        <div>
          <Input
            label="Ingresar valor de texto"
            placeholder="Ingrese un texto"
            name="text"
            onChange={(e) => handleOnChangeEditInputsCarton(e)}
            value={editInputsCarton.text}
          />
          {errorsInputsCarton.text && <p>{errorsInputsCarton.text}</p>}
        </div>
      );
    } else if (selectedCartonType === 'image') {
      return (
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
              label="Ingresar URL de la imagen"
              placeholder="URL de la imagen"
              name="imageUrl"
              onChange={(e) => handleOnChangeEditInputsCarton(e)}
              value={editInputsCarton.imageUrl}
            />
            {errorsInputsCarton.imageUrl && (
              <p>{errorsInputsCarton.imageUrl}</p>
            )}
          </div>
        </>
      );
    }
  };

  const renderBallotInputs = () => {
    if (selectedBallotType === 'default') {
      return (
        <div>
          <Input
            label="Ingresar valor numérico"
            placeholder="Ingrese un número"
            name="number"
            onChange={(e) => handleOnChangeEditInputsBallot(e)}
            value={editInputsBallot.number}
          />
          {errorsInputsBallot.number && <p>{errorsInputsBallot.number}</p>}
        </div>
      );
    } else if (selectedBallotType === 'text') {
      return (
        <div>
          <Input
            label="Ingresar valor de texto"
            placeholder="Ingrese un texto"
            name="text"
            onChange={(e) => handleOnChangeEditInputsBallot(e)}
            value={editInputsBallot.text}
          />
          {errorsInputsBallot.text && <p>{errorsInputsBallot.text}</p>}
        </div>
      );
    } else if (selectedBallotType === 'image') {
      return (
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
              label="Ingresar URL de la imagen"
              placeholder="URL de la imagen"
              name="imageUrl"
              onChange={(e) => handleOnChangeEditInputsBallot(e)}
              value={editInputsBallot.imageUrl}
            />
            {errorsInputsBallot.imageUrl && (
              <p>{errorsInputsBallot.imageUrl}</p>
            )}
          </div>
        </>
      );
    }
  };

  const handleOnChangeEditInputsCarton = (e) => {
    const { name, value } = e.target;
    if (name === 'text') {
      setEditInputsCarton({
        ...editInputsCarton,
        [name]: value,
      });
      setErrorsInputsCarton({
        ...errorsInputsCarton,
        [name]: validationsEditInputsCarton({
          ...editInputsCarton,
          [name]: value,
        })[name],
      });
    } else if (name === 'number') {
      setEditInputsCarton({
        ...editInputsCarton,
        [name]: value,
      });
      setErrorsInputsCarton({
        ...errorsInputsCarton,
        [name]: validationsEditInputsCarton({
          ...editInputsCarton,
          [name]: value,
        })[name],
      });
    } else if (name === 'imageUrl') {
      setEditInputsCarton({
        ...editInputsCarton,
        [name]: value,
      });
      setErrorsInputsCarton({
        ...errorsInputsCarton,
        [name]: validationsEditInputsCarton({
          ...editInputsCarton,
          [name]: value,
        })[name],
      });
    }
  };

  const handleOnChangeEditInputsBallot = (e) => {
    const { name, value } = e.target;
    if (name === 'text') {
      setEditInputsBallot({
        ...editInputsCarton,
        [name]: value,
      });
      setErrorsInputsBallot({
        ...errorsInputsCarton,
        [name]: validationsEditInputsBallot({
          ...editInputsCarton,
          [name]: value,
        })[name],
      });
    } else if (name === 'number') {
      setEditInputsBallot({
        ...editInputsCarton,
        [name]: value,
      });
      setErrorsInputsBallot({
        ...errorsInputsCarton,
        [name]: validationsEditInputsBallot({
          ...editInputsCarton,
          [name]: value,
        })[name],
      });
    } else if (name === 'imageUrl') {
      setEditInputsBallot({
        ...editInputsCarton,
        [name]: value,
      });
      setErrorsInputsBallot({
        ...errorsInputsCarton,
        [name]: validationsEditInputsBallot({
          ...editInputsCarton,
          [name]: value,
        })[name],
      });
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

  // Función para manejar el cambio de imagen desde un archivo local
  // const handleImageChange = (e, type) => {
  //   const file = e.target.files[0];
  //   console.log(file)
  //   if (file) {
  //     // const reader = new FileReader();
  //     // reader.onloadend = () => {
  //       if (type === 'carton') {
  //         setNewCustomValueCartonImage(file);
  //       } else if (type === 'balota') {
  //         setNewCustomValueBallotImage(file);
  //        }
  //     // };
  //     // reader.readAsDataURL(file);
  //   }
  // };

  // const handleImageChange = (e, type) => {
  //   const file = e.target.files[0];
  //   console.log(file);
  //   if (file && type === 'carton') {
  //     setNewCustomValueCartonImage(file)
  //     const storageRef = ref(storage, `${newCustomValueCartonImage}`);
  //     // 'file' comes from the Blob or File API
  //     uploadBytes(storageRef, file).then((snapshot) => {
  //       console.log('Uploaded a blob or file!');
  //     });
  //   }
  //   if (file && type === 'balota') {
  //     setNewCustomValueBallotImage(file)
  //     const storageRef = ref(storage, `${newCustomValueBallotImage}`);
  //     // 'file' comes from the Blob or File API
  //     uploadBytes(storageRef, file).then((snapshot) => {
  //       console.log('Uploaded a blob or file!');
  //     });
  //   }
  // };

  const handleImageChange = (e, type) => {
    // console.log(e.target.files[0].name)
    const file = e.target.files[0];
    if (file) {
      if (type === 'carton') {
        setNewCustomValueCartonImage(file);
      } else if (type === 'balota') {
        setNewCustomValueBallotImage(file);
      }
    }
  };

  //guarda el valores editados en el estado "bingoCard"
  const handleSaveCustomValue = () => {
    if (editIndex !== null) {
      const updatedBingoValues = [...bingoCard.bingo_values];
      const editedItem = updatedBingoValues[editIndex];
      editedItem.carton_type = selectedCartonType;
      editedItem.ballot_type = selectedBallotType;

      // Actualizar el valor del cartón según el tipo seleccionado
      if (selectedCartonType === 'default') {
        editedItem.carton_value = editInputsCarton.number;
      }
      if (selectedCartonType === 'text') {
        editedItem.carton_value = editInputsCarton.text;
      }
      if (selectedCartonType === 'image' && editInputsCarton.imageUrl) {
        editedItem.carton_value = editInputsCarton.imageUrl;
      } else if (selectedCartonType === 'image') {
        // Obtener una referencia al bucket de almacenamiento de Firebase
        const storageRef = ref(
          storage,
          `images/${newCustomValueCartonImage.name}`
        );

        // Subir el archivo al bucket de almacenamiento
        uploadBytes(storageRef, newCustomValueCartonImage)
          .then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            // Aquí podrías hacer más cosas después de que se complete la carga del archivo, si es necesario
            getDownloadURL(ref(storageRef)).then((url) => {
              console.log('retorna url: ', url);
              editedItem.carton_value = url;
            });
          })
          .catch((error) => {
            console.error('Error al subir el archivo:', error);
          });
      }

      // Actualizar el valor de la balota según el tipo seleccionado
      if (selectedBallotType === 'default') {
        editedItem.ballot_value = editInputsBallot.number;
      }
      if (selectedBallotType === 'text') {
        editedItem.ballot_value = editInputsBallot.text;
      }
      if (selectedBallotType === 'image' && editInputsBallot.imageUrl) {
        editedItem.ballot_value = editInputsBallot.imageUrl;
      } else if (selectedBallotType === 'image') {
        // Obtener una referencia al bucket de almacenamiento de Firebase
        const storageRef = ref(
          storage,
          `images/${newCustomValueBallotImage.name}`
        );

        // Subir el archivo al bucket de almacenamiento
        uploadBytes(storageRef, newCustomValueBallotImage)
          .then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            // Aquí podrías hacer más cosas después de que se complete la carga del archivo, si es necesario
            getDownloadURL(ref(storageRef)).then((url) => {
              console.log('retorna url: ', url);
              editedItem.ballot_value = url;
            });
          })
          .catch((error) => {
            console.error('Error al subir el archivo:', error);
          });
      }

      // Actualizar el estado con los nuevos valores
      updateBingoCard((prevState) => ({
        ...prevState,
        bingo_values: updatedBingoValues,
      }));
    }

    // Limpiar el índice de edición y cerrar el diálogo
    setEditIndex(null);
    setOpenDialogValueCartonAndBallot(false);
  };

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
          {renderCartonInputs()}
          <Typography color="gray" variant="h6">
            Posiciones
          </Typography>{' '}
          {dimension === '3x3' && (
            <div className="w-[166px] m-auto p-3  grid grid-cols-3 grid-rows-3 gap-1 justify-center items-center bg-blue-gray-900">
              {[...Array(9)].map((_, index) => (
                <button
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
                  disabled={positionsDisabled.includes(index)}
                ></button>
              ))}
            </div>
          )}
          {dimension === '4x4' && (
            <div className="w-[166px] m-auto p-3  grid grid-cols-4 grid-cols-auto grid-rows-4 gap-1 justify-center items-center bg-blue-gray-900">
              {[...Array(16)].map((_, index) => (
                <button
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
                  disabled={positionsDisabled.includes(index)}
                ></button>
              ))}
            </div>
          )}
          {dimension === '5x5' && (
            <>
              {' '}
              <div className=" w-[166px] m-auto p-3 grid grid-cols-5 grid-rows-6 gap-1 justify-center items-center bg-blue-gray-900">
                {[...Array(25)].map((_, index) => (
                  <button
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
                    disabled={positionsDisabled.includes(index)}
                  ></button>
                ))}
              </div>{' '}
            </>
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
              onClick={() => {
                setSelectedCartonType('default');
              }}
            >
              <h6>Numeros</h6>
            </Button>
            {/* Texto */}
            <Button
              className={`h-10 bg-gray-200 cursor-pointer  text-gray-700 text-center  ${
                selectedCartonType === 'text' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => setSelectedCartonType('text')}
            >
              <h6>Texto</h6>
            </Button>
            {/* Imagenes */}
            <Button
              className={`h-10 bg-gray-200 cursor-pointer text-gray-700  text-center ${
                selectedCartonType === 'image' ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => setSelectedCartonType('image')}
            >
              <h6>Imagenes</h6>
            </Button>
          </div>
          <Typography color="gray" variant="h6">
            Ingresar Valor en la Balota
          </Typography>
          {renderBallotInputs()}
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
        <Button
          variant="gradient"
          color="gray"
          onClick={handleSaveCustomValue}
          disabled={
            errorsInputsCarton.number ||
            errorsInputsCarton.text ||
            errorsInputsCarton.imageUrl ||
            errorsInputsBallot.number ||
            errorsInputsBallot.text ||
            errorsInputsBallot.imageUrl
          }
        >
          Enviar
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DialogValueCartonAndBallot;
