export const PlayerBingoCard = ({
  bingoCard,
  rows,
  cols,
  bingoAppearance,
  onMarkSquare,
  cardboardCode,
  desktop = false,
}) => {
  if (!bingoCard) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-400">Cargando carton...</p>
      </div>
    );
  }

  const dimension = Number.isInteger(cols) && cols > 0 ? cols : 5;

  const gridColsClass = {
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  }[dimension] || "grid-cols-5";

  return (
    <div className={`w-full mx-auto ${desktop ? "max-w-lg" : "max-w-md"}`}>
      <div
        className="rounded-xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          backgroundColor: bingoAppearance?.background_color || "#1e293b",
          ...(bingoAppearance?.background_image
            ? {
                backgroundImage: `url(${bingoAppearance.background_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : {
                backgroundImage: `
                  linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
                  linear-gradient(-45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.04) 75%),
                  linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.04) 75%)
                `,
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
              }),
        }}
      >
        {/* Banner / Header Image */}
        {bingoAppearance?.banner && (
          <img
            src={bingoAppearance.banner}
            alt="Banner"
            className="w-full h-auto"
          />
        )}

        {/* Bingo Grid */}
        <div className={`grid ${gridColsClass} gap-1.5 p-3 md:p-4`}>
          {bingoCard.map((cell, index) => (
            <div
              key={index}
              className={`
                aspect-square cursor-pointer flex justify-center items-center
                rounded-md relative border
                ${cell.value === "Disabled"
                  ? "pointer-events-none border-transparent"
                  : cell.isMarked
                    ? "border-indigo-400/50 shadow-md shadow-indigo-500/20"
                    : "border-white/20 hover:border-white/40 hover:shadow-md active:scale-95"
                }
                transition-all duration-150
              `}
              style={{
                backgroundColor: cell.isMarked && cell.value !== "Disabled"
                  ? "rgba(165, 180, 252, 0.25)"
                  : "rgba(255, 255, 255, 0.85)",
              }}
              onClick={() => onMarkSquare(cell, index)}
            >
              {/* Disabled cell: show dial_image without opacity */}
              {cell.value === "Disabled" && bingoAppearance?.dial_image && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md">
                  <img
                    src={bingoAppearance.dial_image}
                    alt="Blocked"
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              )}

              {/* Cell Content */}
              {cell.default_image ? (
                <img
                  src={cell.default_image}
                  alt="Free"
                  className="w-3/4 h-3/4 object-contain"
                />
              ) : cell.type === "image" ? (
                <img
                  src={cell.value}
                  alt="Carton"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : cell.value && cell.value !== "Disabled" ? (
                <span
                  className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-800 select-none"
                  style={{
                    fontSize: cell.value.length > 3 ? "clamp(10px, 3vw, 14px)" : undefined,
                  }}
                >
                  {cell.value}
                </span>
              ) : null}

              {/* Mark Overlay */}
              {cell.isMarked && cell.value !== "Disabled" && (
                <div className="absolute inset-0 flex items-center justify-center rounded-md animate-mark-in">
                  {bingoAppearance?.dial_image ? (
                    <img
                      src={bingoAppearance.dial_image}
                      alt="Marked"
                      className="w-full h-full object-cover rounded-md opacity-70"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-500/25 flex items-center justify-center rounded-md">
                      <span className="text-indigo-600 text-3xl md:text-4xl font-bold select-none drop-shadow-sm">
                        X
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative">
          {bingoAppearance?.footer && (
            <img
              src={bingoAppearance.footer}
              alt="Footer"
              className="w-full h-auto"
            />
          )}
          {/* Cardboard code overlay */}
          <div className={`
            ${bingoAppearance?.footer ? "absolute bottom-1 right-2" : "text-right px-3 pb-2"}
            text-[10px] md:text-xs font-bold
          `}>
            <span className="bg-black/50 text-white/80 px-2 py-0.5 rounded">
              CARTON # {cardboardCode || "-----"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
