import React, { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const BingoCardStatic = ({
  bingoCard,
  rows,
  bingoAppearance,
  markedSquares,
  onMarkSquare,
}) => {
  if (!bingoCard) {
    return <p>Cargando configuración del bingo...</p>;
  }
  const cols = Number.isInteger(rows) && rows > 0 ? rows : 3;

  return (
    <div className="flex flex-col flex-1 w-full h-full">
      {bingoAppearance.banner && (
        <img
          src={bingoAppearance.banner}
          alt="Bingo Header"
          className="w-full h-auto rounded-t-lg"
        />
      )}

      <div className="w-full h-full">
        <Card className="w-full h-full">
          <CardBody
            className={`grid grid-cols-1 grid-cols-${cols} gap-1`}
            style={{
              backgroundColor: bingoAppearance.background_color,
            }}
          >
            {bingoCard.map((cell, index) => (
              <div
                key={index}
                className="aspect-[1/0.6] bg-blue-100 rounded-md shadow-lg cursor-pointer flex justify-center items-center relative"
                style={{
                  textAlign: "center",
                  position: "relative",
                }}
                onClick={() => onMarkSquare(cell, index)}
              >
                {cell.default_image ? (
                  <img
                    src={cell.default_image}
                    alt="Marked"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <React.Fragment>
                    {
                      cell.type === "image" ? (
                        <img
                          src={cell.value}
                          alt="Carton"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : cell.value ? ( // Añadido condicional para asegurar que cell.value no es undefined
                        <Typography className="text-black text-xl font-bold select-none">
                          {cell.value}
                        </Typography>
                      ) : null // Puedes cambiar esto por un valor por defecto si necesario
                    }
                  </React.Fragment>
                )}
                {bingoCard[index] &&
                  bingoCard[index].isMarked &&
                  bingoCard[index].value != "Disabled" &&
                  (bingoAppearance.dial_image ? (
                    <img
                    src={bingoAppearance.dial_image}
                    alt="Marked Overlay"
                    className="absolute opacity-25 rounded-md inset-0 w-full h-full object-cover animate-mark-opacity"
                  />
                  ) : (
                    <div className="absolute inset-0 flex justify-center rounded-md items-center bg-opacity-50 bg-black">
                      <Typography
                        color="red"
                        className="sm:text-8xl md:text-4xl lg:text-5xl xl:text-6xl font-bold select-none animate-mark-in"
                      >
                        X
                      </Typography>
                    </div>
                  ))}
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
