import { useContext, useState, useRef, useEffect } from 'react';
import { Carousel, Typography, Button } from '@material-tailwind/react';
import { NewBingoContext } from '../../../context/NewBingoContext';

const SizeBingoCard = ({ getPositionsDisablesAndDimension }) => {
  const { bingoCard, updateBingoCard } = useContext(NewBingoContext);

  const [selectedDimensions, setSelectedDimensions] = useState(null);

  const [disabledPositions, setDisabledPositions] = useState([]);

  const [sizeChangeCount, setSizeChangeCount] = useState(0);
  const isFirstSizeChange = useRef(true);
  const [selectedDivs, setSelectedDivs] = useState([]);
  const [confirmChange, setConfirmChange] = useState(false);

  //desabilitar posiciones cuando selecciono un tamaño
  const handleDisabledPosition = (index) => {
    // Verificar si el índice ya está en disabledPositions
    const isSelected = disabledPositions.includes(index);

    // Si está seleccionado, lo removemos; de lo contrario, lo agregamos
    const newDisabledPositions = isSelected
      ? disabledPositions.filter((pos) => pos !== index)
      : [...disabledPositions, index];

    // Actualizamos el estado disabledPositions
    setDisabledPositions(newDisabledPositions);

    updateBingoCard((prevState) => {
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
            default_image: '',
          });
        }
      }

      return newBingoCard;
    });
  };

  //limpiar estados de disabledPositions y selectedPositions cuando cambio de tamaño del carton
  // const handleSizeChange = (newDimension) => {
  //   const currentDimension = bingoCard.dimensions;

  //   // Verificar si el tamaño actual es diferente al nuevo tamaño seleccionado
  //   if (currentDimension !== newDimension) {
  //     // Incrementar el contador de cambios de tamaño
  //     setSizeChangeCount((prevCount) => prevCount + 1);

  //     // Mostrar mensaje de confirmación a partir del segundo cambio de tamaño
  //     if (sizeChangeCount > 0) {
  //       if (!window.confirm('¿Estás seguro de cambiar el tamaño del cartón?')) {
  //         return; // Cancelar si el usuario no confirma
  //       }
  //     }
     
     

  //     // Actualizar el estado de bingoCard con el nuevo tamaño
  //     updateBingoCard((prevBingoCard) => ({
  //       ...prevBingoCard,
  //       dimensions: newDimension,
  //       bingo_values: prevBingoCard.bingo_values.map((value) => ({
  //         ...value,
  //         positions: [],
  //       })),
  //     }));
  //   }
  // };

  // const handleSizeChange = (newDimension) => {
  // console.log(newDimension)
  //   const currentDimension = bingoCard.dimensions;
  //   console.log(currentDimension)
  
  //   // Verify if the size is different
  //   if (currentDimension !== newDimension) {
  //     // Increase size change count
  //     setSizeChangeCount((prevCount) => prevCount + 1);
  
  //     // Show confirmation message from the second change onwards
  //     if (sizeChangeCount > 0 || currentDimension !== newDimension) {
  //       const confirmChange = window.confirm('¿Estás seguro de cambiar el tamaño del cartón?');
  //       setConfirmChange(confirmChange); // Store confirmation choice in state
  
  //       // Update state only if user confirms
  //       if (confirmChange) {
  //         // Update bingoCard state with new dimension
  //         updateBingoCard((prevBingoCard) => ({
  //           ...prevBingoCard,
  //           dimensions: newDimension,
  //           bingo_values: prevBingoCard.bingo_values.map((value) => ({
  //             ...value,
              
  //           })),
  //         }));
  
  //         // Update selected dimension state with yellow background
  //         setSelectedDimensions(newDimension);
  //       } else {
  //         // Reset selected dimension state to prevent yellow background
  //         setSelectedDimensions(currentDimension); // Revert to previous dimension
  //       }
  //     } else {
  //       // Update state directly on first change (no confirmation needed)
  //       updateBingoCard((prevBingoCard) => ({
  //         ...prevBingoCard,
  //         dimensions: newDimension,
  //         bingo_values: prevBingoCard.bingo_values.map((value) => ({
  //           ...value,
            
  //         })),
  //       }));
  
  //       setSelectedDimensions(newDimension);
  //     }
  //   }
  // };

/* const handleSizeChange = (newDimension) => {
  console.log(newDimension);
  const currentDimension = bingoCard.dimensions;
  console.log(currentDimension);

  // Verify if the size is different
  if (currentDimension !== newDimension) {
    // Increase size change count
    setSizeChangeCount((prevCount) => prevCount + 1);

    // Show confirmation message from the second change onwards,
    // but only if the new size is different
    if (sizeChangeCount > 0  && currentDimension !== newDimension) {
      const confirmChange = window.confirm('¿Estás seguro de cambiar el tamaño del cartón?');
      setConfirmChange(confirmChange); // Store confirmation choice in state

      // Update state only if user confirms and size is different
      if (confirmChange) {
        updateBingoCard((prevBingoCard) => ({
          ...prevBingoCard,
          dimensions: newDimension,
          bingo_values: prevBingoCard.bingo_values.map((value) => ({
            ...value,
            positions: [],
          })),
        }));

        setSelectedDimensions(newDimension);
      } else {
        // Reset selected dimension state and prevent yellow background
        // if confirmation is cancelled or size is the same
        setSelectedDimensions(currentDimension);
      }
    } else {
      // Update state directly on first change (no confirmation needed)
      updateBingoCard((prevBingoCard) => ({
        ...prevBingoCard,
        dimensions: newDimension,
        bingo_values: prevBingoCard.bingo_values.map((value) => ({
          ...value,
          positions: [],
        })),
      }));

      setSelectedDimensions(newDimension);
    }
  }
}; */

const handleSizeChange = (newDimension) => {
  console.log("newDimension: ",newDimension);
  const currentDimension = bingoCard.dimensions;
  console.log("currentDimension ",currentDimension);

  // Verify if the size is different
  if (currentDimension !== newDimension) {
    // Increase size change count
    setSizeChangeCount((prevCount) => prevCount + 1);

    // Show confirmation message from the second change onwards,
    // but only if the new size is different
    if (sizeChangeCount > 0) {
      const confirmChange = window.confirm('¿Estás seguro de cambiar el tamaño del cartón?');
      setConfirmChange(confirmChange); // Store confirmation choice in state

      // Update state only if user confirms and size is different
      if (confirmChange && (currentDimension !== newDimension)) {
        updateBingoCard((prevBingoCard) => ({
          ...prevBingoCard,
          dimensions: newDimension,
          bingo_values: prevBingoCard.bingo_values.map((value) => ({
            ...value,
            positions: [],
          })),
        }));

        setSelectedDimensions(newDimension);
        console.log(selectedDimensions)
      } else {
        // **Do not update currentDimension if confirmation is cancelled**
        setSelectedDimensions(currentDimension);
      }
    } else {
      // Update state directly on first change (no confirmation needed)
      updateBingoCard((prevBingoCard) => ({
        ...prevBingoCard,
        dimensions: newDimension,
        bingo_values: prevBingoCard.bingo_values.map((value) => ({
          ...value,
          positions: [],
        })),
      }));

      setSelectedDimensions(newDimension);
    }
  }
};

  


  
  

  useEffect(() => {
    getPositionsDisablesAndDimension(disabledPositions,selectedDimensions);
  }, [disabledPositions, selectedDimensions]);

  return (
    <Carousel
      className="rounded-xl h-full w-full bg-blue-gray-50 pb-7"
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
      <div className="flex flex-col justify-center items-center">
        <Typography variant="h6" className="text-center mt-2">
          Deshabilita Posiciones
        </Typography>
        <Button
          color="white"
          className={`my-2  ${
            selectedDimensions === '3x3' ? 'bg-yellow-300' : 'bg-white'
          }`}
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
        </Button>
        <Typography variant="h6" className="text-center mb-1">
          Selecciona Tamaño del Cartón
        </Typography>
        <Button
          className="text-center"
          size="sm"
          onClick={() => {
            updateBingoCard({ ...bingoCard, dimensions: '3x3' });
            setSelectedDimensions('3x3');
            handleSizeChange('3x3');
          }}
        >
          3x3
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <Typography variant="h6" className="text-center mt-1">
          Deshabilita Posiciones
        </Typography>
        <Button
          color="white"
          className={`m-1  ${
            selectedDimensions === '4x4' ? 'bg-yellow-300' : 'bg-white'
          }`}
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
        </Button>
        <Typography variant="h6" className="text-center">
          Selecciona Tamaño del Cartón
        </Typography>
        <Button
          className="text-center"
          size="sm"
          onClick={() => {
            updateBingoCard({ ...bingoCard, dimensions: '4x4' });
            setSelectedDimensions('4x4');
            handleSizeChange('4x4');
          }}
        >
          4x4
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center">
        <Typography variant="h6" className="text-center mt-1">
          Deshabilita Posiciones
        </Typography>
        <Button
          color="white"
          className={`pb-0  ${
            selectedDimensions === '5x5' ? 'bg-yellow-300' : 'bg-white'
          }`}
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
        </Button>
        <Typography variant="h6" className="text-center">
          Selecciona Tamaño del Cartón
        </Typography>
        <Button
          className="text-center"
          size="sm"
          onClick={() => {
            updateBingoCard({ ...bingoCard, dimensions: '5x5' });
            setSelectedDimensions('5x5');
            handleSizeChange('5x5');
          }}
        >
          5x5
        </Button>
      </div>
    </Carousel>
  );
};

export default SizeBingoCard;
