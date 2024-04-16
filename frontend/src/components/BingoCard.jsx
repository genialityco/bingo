import React, { useState, useEffect } from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import bingoService from '../services/bingoService';

const BingoCardStatic = ({ bingoConfig, markedSquares, onMarkSquare }) => {

  // State for each bingo
  const [bingoOfNumbers, setBingoOfNumbers] = useState({
    bingoAppearance: {},
    bingoValues: [],
    dimensions: '',
  });
 

  const [bingoOfText, setBingoOfText] = useState({
    bingoAppearance: {},
    bingoValues: [],
    dimensions: '',
  });

  const [bingoOfImages, setBingoOfImages] = useState({
    bingoAppearance: {},
    bingoValues: [],
    dimensions: '',
  });



   const { bingo_appearance, bingo_values, dimensions } = bingoConfig;
  //console.log(bingo_values)

  // Calcula el número de filas y columnas a partir de las dimensiones.
  const [rows, cols] = dimensions.format.split('x').map(Number);
  const totalSquares = rows * cols;

  // Intenta recuperar los valores del cartón y las casillas marcadas desde localStorage
  const savedCardValues = JSON.parse(localStorage.getItem('cardValues'));
  // const savedMarkedSquares = JSON.parse(localStorage.getItem("markedSquares"));

  // Estado para los valores del cartón, inicializado desde localStorage si existe
  const [cardValues, setCardValues] = useState(savedCardValues || []);

  // Estado para las casillas marcadas, inicializado desde localStorage si existe
  // const [markedSquares, setMarkedSquares] = useState(
  //   savedMarkedSquares || new Array(totalSquares).fill(false)
  // );

  useEffect(() => {

    const getAllBingos = async () => {
      try {
        const api = await bingoService.listAllBingos();
        const response = await api.data;
        setBingoOfNumbers({
          bingoAppearance: response[0].bingoAppearance,
          bingoValues: response[0].bingoValues,
          dimensions: response[0].dimensions,
        });
        setBingoOfText({
          bingoAppearance: response[1].bingoAppearance,
          bingoValues: response[1].bingoValues,
          dimensions: response[1].dimensions,
        });
        setBingoOfImages({
          bingoAppearance: response[2].bingoAppearance,
          bingoValues: response[2].bingoValues,
          dimensions: response[2].dimensions,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getAllBingos();
  }, []);


  //bingoImages with totalSquares
 /*  useEffect(() => {
    if (!savedCardValues && bingoOfImages.bingoValues.length > 0) {
     // Generar valores aleatorios y establecer la propiedad imageUrl para el tercer bingo
      const generateRandomValues = () => {
        const uniqueValues = new Set();
        const randomIndexes = [];
        const bingoValues = bingoOfImages.bingoValues;
        while (uniqueValues.size < totalSquares) {
          const randomIndex = Math.floor(Math.random() * bingoValues.length);
          if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
            const randomValue = bingoValues[randomIndex].value;
            const randomImage = bingoValues[randomIndex].imageUrl;
            uniqueValues.add({ value: randomValue, image_url: randomImage });
          }
        }
        return Array.from(uniqueValues);
      };
  
      const newBingoThreeValues = generateRandomValues();
      setBingoOfImages({
        ...bingoOfImages,
        imageUrl: newBingoThreeValues.length > 0 ? newBingoThreeValues[0].image_url : "",
      });
  
     // Guardar los nuevos valores en localStorage
      localStorage.setItem("cardValues", JSON.stringify(newBingoThreeValues));
    }
  }, [bingoOfImages.bingoValues, totalSquares, savedCardValues]); */
  
   //bingoImages without totalSquares
/*   useEffect(() => {
    console.log("segundo")
    if (!savedCardValues && bingoOfImages.bingoValues.length > 0) {
      // Generar valores aleatorios y establecer la propiedad imageUrl para el tercer bingo
      const generateRandomValues = () => {
        const uniqueValues = new Set();
        const randomIndexes = [];
        while (uniqueValues.size < bingoOfImages.bingoValues.length) {
          const randomIndex = Math.floor(Math.random() * bingoOfImages.bingoValues.length);
          if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
            const randomValue = bingoOfImages.bingoValues[randomIndex].value;
            const randomImage = bingoOfImages.bingoValues[randomIndex].imageUrl;
            uniqueValues.add({ value: randomValue, image_url: randomImage });
          }
        }
        return Array.from(uniqueValues);
      };
      
      const newBingoThreeValues = generateRandomValues();
      setBingoOfImages({
        ...bingoOfImages,
        imageUrl: newBingoThreeValues.length > 0 ? newBingoThreeValues[0].image_url : "",
      });
  
      // Guardar los nuevos valores en localStorage
      localStorage.setItem("cardValues", JSON.stringify(newBingoThreeValues));
    }
  }, [bingoOfImages.bingoValues, savedCardValues]);  */
  
  //bingoOfText
 useEffect(() => {
    if (!savedCardValues && bingoOfText.bingoValues.length > 0) {
      // Generar valores aleatorios para bingoOfText
      const generateRandomValues = () => {
        const uniqueValues = new Set();
        const randomIndexes = [];
        const bingoValues = bingoOfText.bingoValues;
        while (uniqueValues.size < totalSquares) {
          const randomIndex = Math.floor(Math.random() * bingoValues.length);
          if (!randomIndexes.includes(randomIndex)) {
            randomIndexes.push(randomIndex);
            const randomValue = bingoValues[randomIndex].value;
            uniqueValues.add({ value: randomValue });
          }
        }
        return Array.from(uniqueValues);
      };
  
      const newValues = generateRandomValues();
      setBingoOfText({
        ...bingoOfText,
        bingoValues: newValues,
      });
  
      // Guardar los nuevos valores en localStorage
      localStorage.setItem("cardValues", JSON.stringify(newValues));
    }
  }, [bingoOfText.bingoValues, totalSquares, savedCardValues]); 

  // bingoOfNumbers
  // useEffect(() => {
  //   if (!savedCardValues && bingoOfNumbers.bingoValues.length > 0) {
  //     // Generar valores aleatorios para bingoOfNumbers
  //     const generateRandomValues = () => {
  //       const uniqueValues = new Set();
  //       const randomIndexes = [];
  //       const bingoValues = bingoOfNumbers.bingoValues;
  //       while (uniqueValues.size < totalSquares) {
  //         const randomIndex = Math.floor(Math.random() * bingoValues.length);
  //         if (!randomIndexes.includes(randomIndex)) {
  //           randomIndexes.push(randomIndex);
  //           const randomValue = bingoValues[randomIndex].value;
  //           uniqueValues.add({ value: randomValue });
  //         }
  //       }
  //       return Array.from(uniqueValues);
  //     };
  
  //     const newValues = generateRandomValues();
  //     setBingoOfNumbers({
  //       ...bingoOfNumbers,
  //       bingoValues: newValues,
  //     });
  
  //     // Guardar los nuevos valores en localStorage
  //     localStorage.setItem("cardValues", JSON.stringify(newValues));
  //   }
  // }, [bingoOfNumbers.bingoValues, totalSquares, savedCardValues]);

  
  useEffect(() => {
    // Guarda las casillas marcadas en localStorage cada vez que cambian
    localStorage.setItem('markedSquares', JSON.stringify(markedSquares));
  }, [markedSquares]);

  // Clase para la grilla según las columnas.
  // const gridClass = `grid grid-cols-${cols} p-1 gap-1`;

  // Función para marcar o desmarcar una casilla.
  // const markSquare = (index) => {
  //   setMarkedSquares((currentMarks) =>
  //     currentMarks.map((marked, i) => (i === index ? !marked : marked))
  //   );
  // };

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      {bingo_appearance.banner && (
        <img
          src={bingo_appearance.banner}
          alt="Bingo Header"
          className="w-full h-auto rounded-t-lg"
        />
      )}

      <div className="relative w-full h-full">
        <Card className="h-full">
          <CardBody
            // className={`relative w-full h-full ${gridClass}`}
            className={`grid grid-cols-4  gap-1 relative w-full h-full `}
            style={{ backgroundColor: bingo_appearance.background_color }}
          >
            {cardValues.map((item, index) => (

              
              <div
                key={index}
                className="relative bg-blue-100 rounded-md shadow-lg m-0.5 flex justify-center items-center cursor-pointer"
                onClick={() => onMarkSquare(item, index)}
              >
               {/* <img src={item.image_url} alt="bingoCard" /> */}
                <Typography className="text-black text-4xl font-bold select-none z-10">
                  {item.value}
            </Typography> 
                {markedSquares[index] && (
                  <div className="absolute inset-0 flex justify-center items-center bg-opacity-50">
                    <Typography
                      color="red"
                      className={`lg:text-5xl xl:text-8xl font-bold select-none ${
                        markedSquares[index].isMarked === true
                          ? 'animate-mark-in'
                          : 'animate-mark-out'
                      }`}
                    >
                      X
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </CardBody>
          <div className="flex flex-col items-center justify-center h-auto">
            {bingo_appearance.footer && (
              <img
                src={bingo_appearance.footer}
                alt="Bingo Footer"
                className="w-full rounded-b-lg"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BingoCardStatic;
