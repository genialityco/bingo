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
  const bingoWinnerRef = useRef(null);

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
    return { value: "", type: "text" }; // Devolver un valor predeterminado si no hay datos
  };

  useEffect(() => {
    if (messageLastBallot === "¡El juego ha comenzado!") {
      bingoStartAudioRef.current.play();
    } else if (
      messageLastBallot ===
      "¡El juego ha sido reiniciado, comienza una nueva ronda!"
    ) {
      bingoRestartAudioRef.current.play();
    } else if (
      messageLastBallot === "Estamos validando el juego, ¡espera un momento!" ||
      messageLastBallot === "Alguien ha cantado, ¡espera un momento!"
    ) {
      bingoValidatingRef.current.play();
    } else if (
      messageLastBallot === "Lo sentimos, no has ganado, revisa las balotas." ||
      messageLastBallot === "Lo sentimos, no es un ganador esta vez."
    ) {
      bingoNoWinRef.current.play();
    } else if (
      messageLastBallot === "Felicidades! Eres el ganador!." ||
      messageLastBallot === "Alguien ha cantado y es un ganador."
    ) {
      bingoWinnerRef.current.play();
    }
  }, [messageLastBallot]);

  return (
    <div className="p-2 relative">
      <audio ref={bingoStartAudioRef} src="/audios/startGame.mp3"></audio>
      <audio ref={bingoRestartAudioRef} src="/audios/restartBingo.mp3"></audio>
      <audio ref={bingoValidatingRef} src="/audios/validatingBingo.mp3"></audio>
      <audio ref={bingoNoWinRef} src="/audios/noWinBingo.mp3"></audio>
      <audio ref={bingoWinnerRef} src="/audios/winner.mp3"></audio>

      <Typography className="text-center">{messageLastBallot}</Typography>
      {lastBallot && lastBallot !== "" && (
        <div className="flex flex-col justify-center items-center">
          {getBallotValueForDom(lastBallot).type === "image" ? (
            <img
              src={getBallotValueForDom(lastBallot).value}
              alt="Ballot"
              className="h-20 w-20 border-2 border-gray-300 object-cover z-50"
            />
          ) : (
            <Typography className="text-black text-xl z-50">
              {getBallotValueForDom(lastBallot).value.length > 3
                ? `${getBallotValueForDom(lastBallot).value.slice(0, 2)}...`
                : getBallotValueForDom(lastBallot).value}
            </Typography>
          )}
          {getBallotValueForDom(lastBallot).type !== "image" && (
            <div>
              <Typography>
                Balota: {getBallotValueForDom(lastBallot).value}
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
