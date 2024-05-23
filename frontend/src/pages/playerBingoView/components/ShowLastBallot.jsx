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
    if (messageLastBallot === "¡El bingo ha comenzado!") {
      bingoStartAudioRef.current.play();
    } else if (
      messageLastBallot ===
      "¡El bingo ha sido reiniciado, comienza una nueva ronda!"
    ) {
      bingoRestartAudioRef.current.play();
    } else if (
      messageLastBallot === "Estamos validando el bingo, ¡espera un momento!" ||
      messageLastBallot === "Alguien ha cantado bingo, ¡espera un momento!"
    ) {
      bingoValidatingRef.current.play();
    } else if (
      messageLastBallot === "Lo sentimos, no has ganado, revisa las balotas." ||
      messageLastBallot === "Lo sentimos, no es un ganador esta vez."
    ) {
      bingoNoWinRef.current.play();
    } else if (
      messageLastBallot === "Felicidades! Eres el ganador del bingo." ||
      messageLastBallot === "Alguien ha cantado bingo y es un ganador."
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
        <div className="flex justify-center items-center">
          <div className="h-24 w-24 rounded-full flex justify-center items-center relative">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/images%2Ffc34d411-a873-4bb7-b172-6f8f9397f932?alt=media&token=91fd632d-4093-4627-a64e-2d69b9bc80a0" // Ruta a la imagen de fondo
              className="absolute top-0 left-0 w-full h-full object-cover rounded-full shadow-2xl"
              alt="Background ballot"
            />
            {getBallotValueForDom(lastBallot).type === "image" ? (
              <img
                src={getBallotValueForDom(lastBallot).value}
                alt="Ballot"
                className="h-12 w-12 rounded-full z-50"
              />
            ) : (
              <Typography className="text-black text-xl z-50">
                {getBallotValueForDom(lastBallot).value}
              </Typography>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
