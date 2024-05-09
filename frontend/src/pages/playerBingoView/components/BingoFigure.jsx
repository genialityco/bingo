export const BingoFigure = ({ bingoConfig }) => {
  return (
    <div>
      <img
        src={bingoConfig?.bingo_figure?.image}
        alt="Figura de Bingo"
        width={"140"}
        height={"100"}
        className="m-auto mt-2"
      />
    </div>
  );
};
