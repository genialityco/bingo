export const BingoFigure = ({ room }) => {
  return (
    <div>
      <img
        src={room?.bingoFigure?.image}
        alt="Figura de Bingo"
        width={"140"}
        height={"100"}
        className="m-auto mt-2"
      />
    </div>
  );
};
