import React from "react";
import { Typography } from "@material-tailwind/react";

export const BallotHistory = ({ bingoConfig, ballotsHistory }) => {
  const getBallotValueForDom = (id) => {
    const ballotData = bingoConfig.bingo_values.find(
      (objeto) => objeto._id === id
    );
    if (ballotData) {
      return {
        value: ballotData.ballot_value,
        type: ballotData.ballot_type,
      };
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex overflow-x-auto">
        {ballotsHistory.map((ballot, index) => {
          const { value, type } = getBallotValueForDom(ballot);
          return (
            <React.Fragment key={index}>
              {type === "image" ? (
                <img
                  src={value}
                  alt="Ballot"
                  style={{
                    width: "10",
                    height: "10",
                    objectFit: "contain",
                  }}
                  className="h-12 w-12 rounded-full shadow-xl shadow-blue-500/50 mb-5"
                />
              ) : (
                <Typography
                  variant="h5"
                  className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 mb-5"
                >
                  {value}
                </Typography>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
