import { Typography } from "@material-tailwind/react";

export const ShowLastBallot = ({ bingoConfig, lastBallot }) => {
  const getBallotValueForDom = (id) => {
    if (bingoConfig && lastBallot != "") {
      const ballotData = bingoConfig.bingo_values.find(
        (objeto) => objeto._id == id
      );
      return {
        value: ballotData.ballot_value,
        type: ballotData.ballot_type,
      };
    }
  };
  return (
    <div className="p-2">
      <Typography className="text-center">
        {lastBallot
          ? "¡El bingo ha iniciado!"
          : "¡El bingo aún no ha iniciado!"}
      </Typography>
      {lastBallot && (
        <Typography variant="h6" className="text-center">
          Última balota sacada:{" "}
          {getBallotValueForDom(lastBallot).type === "image" ? (
            <img
              src={getBallotValueForDom(lastBallot).value}
              alt="Ballot"
              style={{
                width: "10",
                height: "10",
                objectFit: "contain",
              }}
              className="h-12 w-12 rounded-full shadow-xl shadow-blue-500/50"
            />
          ) : (
            <Typography className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12">
              {getBallotValueForDom(lastBallot).value}
            </Typography>
          )}
        </Typography>
      )}
    </div>
  );
};
