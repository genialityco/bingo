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
      {/* Banner */}
      {bingoAppearance.banner && (
        <img
          src={bingoAppearance.banner}
          alt="Bingo Header"
          className="w-full h-auto rounded-t-lg"
        />
      )}

      {/* Bingo Card */}
      <div className="flex flex-1 w-full h-full">
        <Card className="w-full h-full">
          <CardBody
            className={`grid grid-cols-${cols} gap-2 p-2`}
            style={{
              background: bingoAppearance.background_image
                ? `url(${bingoAppearance.background_image}) no-repeat center center/cover`
                : bingoAppearance.background_color || "#fff",
            }}
          >
            {bingoCard.map((cell, index) => (
              <div
                key={index}
                className={`aspect-square cursor-pointer flex justify-center items-center rounded-md relative ${
                  cell.value === "Disabled"
                    ? "opacity-50 pointer-events-none"
                    : ""
                } ${cell.isMarked ? "bg-opacity-80" : "bg-opacity-100"}`}
                onClick={() => onMarkSquare(cell, index)}
                style={{
                  backgroundColor: cell.isMarked
                    ? "rgba(255, 0, 0, 0.1)"
                    : "transparent",
                }}
              >
                {/* Default Image */}
                {cell.default_image ? (
                  <img
                    src={cell.default_image}
                    alt="Marked"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    {/* Content based on type */}
                    {cell.type === "image" ? (
                      <img
                        src={cell.value}
                        alt="Carton"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : cell.value ? (
                      <Typography
                        className="text-black text-2xl font-bold select-none"
                        style={{
                          fontSize: cell.value.length > 3 ? "16px" : "20px",
                          lineHeight: "1",
                        }}
                      >
                        {cell.value}
                      </Typography>
                    ) : null}
                  </>
                )}

                {/* Marked Overlay */}
                {cell.isMarked && cell.value !== "Disabled" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                    {bingoAppearance.dial_image ? (
                      <img
                        src={bingoAppearance.dial_image}
                        alt="Marked Overlay"
                        className="w-full h-full object-cover animate-fade-in"
                      />
                    ) : (
                      <Typography
                        color="red"
                        className="text-4xl font-bold select-none animate-pulse"
                      >
                        X
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardBody>

          {/* Footer */}
          {bingoAppearance.footer && (
            <div className="flex items-center justify-center w-full">
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
