export const BingoHeader = ({ bingoConfig }) => {
  const banner = bingoConfig?.bingo_appearance?.banner;
  const name = bingoConfig?.name;

  return (
    <header className="flex items-center justify-between bg-gray-900 px-4 py-2">
      <div className="flex items-center gap-3">
        {banner && (
          <img
            src={banner}
            alt={name || "Bingo"}
            className="h-8 md:h-10 object-contain"
          />
        )}
        {name && (
          <span className="text-white text-sm md:text-base font-medium truncate max-w-[150px] md:max-w-none">
            {name}
          </span>
        )}
      </div>
      <span
        className="text-white text-xl md:text-2xl font-extrabold tracking-wider"
        style={{
          fontStyle: "italic",
          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        ¡BINGO!
      </span>
    </header>
  );
};
