import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const BingoCardStatic = ({ bingoConfig, markedSquares, onMarkSquare }) => {
  if (!bingoConfig) {
    return <p>Cargando configuración del bingo...</p>;
  }

  const { bingoAppearance, bingoValues, dimensions } = bingoConfig;

  // Calcula el número de filas y columnas a partir de las dimensiones.
  const [rows, cols] = dimensions.split("x").map(Number);
  const totalSquares = rows * cols;

  // Estado para los valores del cartón, inicializado desde localStorage si existe
  const savedCardValues = JSON.parse(localStorage.getItem("cardValues"));
  const [cardValues, setCardValues] = useState(savedCardValues || []);

  useEffect(() => {
    if (!savedCardValues && bingoValues.length > 0) {
      // Genera valores solo si no hay valores guardados y bingoValues está disponible
      const generateRandomValues = () => {
        let uniqueValues = new Set();
        while (uniqueValues.size < totalSquares) {
          const randomIndex = Math.floor(Math.random() * bingoValues.length);
          const randomValue = bingoValues[randomIndex];

          // Usamos el ID como identificador único para asegurar que no haya duplicados
          uniqueValues.add(randomValue.id);
        }

        // Transformamos los IDs únicos de nuevo en objetos de bingoValues
        return Array.from(uniqueValues).map((id) => {
          const item = bingoValues.find((value) => value.id === id);
          return item;
        });
      };

      const newCardValues = generateRandomValues();
      setCardValues(newCardValues);
      localStorage.setItem("cardValues", JSON.stringify(newCardValues)); // Guarda los nuevos valores en localStorage
    }
  }, [bingoValues, totalSquares, savedCardValues]);

  // useEffect(() => {
  //   // Guarda las casillas marcadas en localStorage cada vez que cambian
  //   localStorage.setItem("markedSquares", JSON.stringify(markedSquares));
  // }, [markedSquares]);

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      {bingoAppearance.banner && (
        <img
          src={bingoAppearance.banner}
          alt="Bingo Header"
          className="w-full h-auto rounded-t-lg"
        />
      )}

      <div className="relative w-full h-full">
        <Card className="h-full">
          <CardBody
            className={`grid grid-cols-${rows} gap-1 relative w-full h-full `}
            style={{ backgroundColor: bingoAppearance.background_color }}
          >
            {cardValues.map((item, index) => (
              <div
                key={index}
                className="relative bg-blue-100 rounded-md shadow-lg m-0.5 flex justify-center items-center cursor-pointer"
                onClick={() => onMarkSquare(item, index)}
              >
                {item.type === "default" || item.type === "text" ? (
                  <Typography className="text-black text-4xl font-bold select-none z-10">
                    {item.value}
                  </Typography>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt="Marked"
                    className="animate-mark-in"
                  />
                )}
                {markedSquares[index] && markedSquares[index].isMarked && (
                  <div className="absolute inset-0 flex justify-center items-center bg-opacity-50">
                    <Typography
                      color="red"
                      className="lg:text-5xl xl:text-8xl font-bold select-none animate-mark-in"
                    >
                      X
                    </Typography>
                  </div>
                )}
              </div>
            ))}
          </CardBody>
          {bingoAppearance.footer && (
            <div className="flex flex-col items-center justify-center h-auto">
              <img
                src={bingoAppearance.footer}
                alt="Bingo Footer"
                className="w-full rounded-b-lg"
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BingoCardStatic;
