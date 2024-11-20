import React from "react";
import { Typography } from "@material-tailwind/react";

export const BallotHistory = ({ bingoConfig, ballotsHistory }) => {
  // Esta función determina si una balota está en el historial
  const isBallotInHistory = (id) => {
    return ballotsHistory.includes(id);
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center items-center gap-0">
        {bingoConfig.bingo_values.map((ballot, index) => {
          const { _id, ballot_value, ballot_type } = ballot;
          const inHistory = isBallotInHistory(_id);
          const opacityClass = inHistory ? "opacity-100" : "opacity-50";

          return (
            <React.Fragment key={_id}>
              {ballot_type === "image" ? (
                <img
                  src={ballot_value}
                  alt="Ballot"
                  className={`h-8 w-8 rounded-full shadow-xl shadow-blue-500/50 mb-5 ${opacityClass}`}
                  style={{
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography
                  variant="h5"
                  className={`flex justify-center items-center text-xs p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-8 w-8 mb-5 ${opacityClass}`}
                >
                  {ballot_value.length > 3
                    ? `${ballot_value.slice(0, 2)}...`
                    : ballot_value}
                </Typography>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
