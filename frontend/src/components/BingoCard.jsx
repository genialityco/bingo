import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const BingoCardStatic = ({ bingoConfig }) => {
  const { bingo_appearance, bingo_values, dimensions } = bingoConfig;

  // Calcula el número de filas y columnas a partir de las dimensiones.
  const [rows, cols] = dimensions.format.split("x").map(Number);
  const totalSquares = rows * cols;
  
  // Intenta recuperar los valores del cartón y las casillas marcadas desde localStorage
  const savedCardValues = JSON.parse(localStorage.getItem("cardValues"));
  const savedMarkedSquares = JSON.parse(localStorage.getItem("markedSquares"));

  // Estado para los valores del cartón, inicializado desde localStorage si existe
  const [cardValues, setCardValues] = useState(savedCardValues || []);

  // Estado para las casillas marcadas, inicializado desde localStorage si existe
  const [markedSquares, setMarkedSquares] = useState(
    savedMarkedSquares || new Array(totalSquares).fill(false)
  );

  useEffect(() => {
    if (!savedCardValues) {
      // Genera valores solo si no hay valores guardados
      const generateRandomValues = () => {
        let uniqueValues = new Set();
        while (uniqueValues.size < totalSquares) {
          const randomValue =
            bingo_values[Math.floor(Math.random() * bingo_values.length)];
          uniqueValues.add(randomValue.carton_value.value);
        }
        return Array.from(uniqueValues).map((value) => ({
          carton_value: { value: value },
        }));
      };

      const newCardValues = generateRandomValues();
      setCardValues(newCardValues);
      localStorage.setItem("cardValues", JSON.stringify(newCardValues)); // Guarda los nuevos valores en localStorage
    }
  }, [bingo_values, totalSquares, savedCardValues]);

  useEffect(() => {
    // Guarda las casillas marcadas en localStorage cada vez que cambian
    localStorage.setItem("markedSquares", JSON.stringify(markedSquares));
  }, [markedSquares]);

  // Clase para la grilla según las columnas.
  // const gridClass = `grid grid-cols-${cols} p-1 gap-1`;

  // Función para marcar o desmarcar una casilla.
  const markSquare = (index) => {
    setMarkedSquares((currentMarks) =>
      currentMarks.map((marked, i) => (i === index ? !marked : marked))
    );
  };


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
                onClick={() => markSquare(index)}
              >
                <Typography className="text-black text-4xl font-bold select-none z-10">
                  {item.carton_value.value}
                </Typography>
                {markedSquares[index] && (
                  <div className="absolute inset-0 flex justify-center items-center bg-opacity-50">
                    <Typography
                      color="red"
                      className={`lg:text-5xl xl:text-8xl font-bold select-none ${
                        markedSquares[index] === true
                          ? "animate-mark-in"
                          : "animate-mark-out"
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
