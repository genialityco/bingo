import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const BingoCardStatic = ({
  bingoCard,
  rows,
  bingoAppearance,
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
              background: bingoAppearance.background_image
                ? `url(${bingoAppearance.background_image}) no-repeat center center/cover`
                : bingoAppearance.background_color,
            }}
          >
            {bingoCard.map((cell, index) => (
              <div
                key={index}
                className={`aspect-[1/0.6] cursor-pointer rounded-md fontcursor-pointer flex justify-center items-center relative px-2 py-1 ${
                  cell.value === "Disabled" ? "opacity-80" : ""
                } ${cell.isMarked ? "opacity-80" : ""}`}
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
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    {cell.type === "image" ? (
                      <img
                        src={cell.value}
                        alt="Carton"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : cell.value ? (
                      <Typography className="text-black text-3xl font-bold select-none">
                        {cell.value}
                      </Typography>
                    ) : null}
                  </>
                )}
                {bingoCard[index] &&
                  bingoCard[index].isMarked &&
                  bingoCard[index].value !== "Disabled" &&
                  (bingoAppearance.dial_image ? (
                    <img
                      src={bingoAppearance.dial_image}
                      alt="Marked Overlay"
                      className="absolute rounded-md inset-0 w-full h-full object-cover animate-mark-opacity"
                    />
                  ) : (
                    <div className="absolute inset-0 flex justify-center rounded-md items-center bg-opacity-50">
                      <Typography
                        color="red"
                        className="md:text-4xl lg:text-5xl xl:text-6xl font-bold select-none animate-mark-in"
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
