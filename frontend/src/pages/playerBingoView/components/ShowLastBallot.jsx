import { useState, useEffect, useRef } from "react";
import { Typography } from "@material-tailwind/react";

export const ShowLastBallot = ({
  bingoConfig,
  lastBallot,
  messageLastBallot,
}) => {
  const bingoStartAudioRef = useRef(null);
  const bingoRestartAudioRef = useRef(null);
  const bingoValidatingRef = useRef(null);
  const bingoNoWinRef = useRef(null);

  const getBallotValueForDom = (id) => {

    if (bingoConfig && lastBallot !== "") {
      const ballotData = bingoConfig.bingo_values.find(
        (objeto) => objeto._id === id
      );
      return {
        value: ballotData.ballot_value,
        type: ballotData.ballot_type,
      };
    }
  };

  useEffect(() => {
    if (messageLastBallot === "¡El bingo ha comenzado!") {
      // bingoStartAudioRef.current.play();
    } else if (
      messageLastBallot ===
      "¡El bingo ha sido reiniciado, comienza una nueva ronda!"
    ) {
      bingoRestartAudioRef.current.play();
    } else if (
      messageLastBallot === "¡Alguien ha cantado bingo, estamos validando!"
    ) {
      bingoValidatingRef.current.play();
    } 
  }, [messageLastBallot]);

  return (
    <div className="p-2">
      <audio ref={bingoStartAudioRef} src="/audios/startBingo.mp3"></audio>
      <audio ref={bingoRestartAudioRef} src="/audios/restartBingo.mp3"></audio>
      <audio ref={bingoValidatingRef} src="/audios/validatingBingo.mp3"></audio>
      <Typography className="text-center">{messageLastBallot}</Typography>
      {lastBallot && lastBallot !== "" && (
        <Typography variant="h6" className="text-center">
          Última balota sacada:{" "}
          {getBallotValueForDom(lastBallot).type === "image" ? (
            <img
              src={getBallotValueForDom(lastBallot).value}
              alt="Ballot"
              style={{ width: "10", height: "10", objectFit: "contain" }}
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