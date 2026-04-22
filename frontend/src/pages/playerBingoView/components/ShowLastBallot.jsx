import { useEffect, useRef } from "react";

export const ShowLastBallot = ({ messageLastBallot }) => {
  const bingoStartAudioRef = useRef(null);
  const bingoRestartAudioRef = useRef(null);
  const bingoValidatingRef = useRef(null);
  const bingoNoWinRef = useRef(null);
  const bingoWinnerRef = useRef(null);

  useEffect(() => {
    if (messageLastBallot === "¡El juego ha comenzado!") {
      bingoStartAudioRef.current.play();
    } else if (
      messageLastBallot ===
      "¡El juego ha sido reiniciado, comienza una nueva ronda!"
    ) {
      bingoRestartAudioRef.current.play();
    } else if (
      messageLastBallot ===
        "Estamos validando el juego, ¡espera un momento!" ||
      messageLastBallot === "Alguien ha cantado, ¡espera un momento!"
    ) {
      bingoValidatingRef.current.play();
    } else if (
      messageLastBallot ===
        "Lo sentimos, no has ganado, revisa las balotas." ||
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

  // Audio-only component — no visual output
  return (
    <div className="hidden">
      <audio ref={bingoStartAudioRef} src="/audios/startGame.mp3" />
      <audio ref={bingoRestartAudioRef} src="/audios/restartBingo.mp3" />
      <audio ref={bingoValidatingRef} src="/audios/validatingBingo.mp3" />
      <audio ref={bingoNoWinRef} src="/audios/noWinBingo.mp3" />
      <audio ref={bingoWinnerRef} src="/audios/winner.mp3" />
    </div>
  );
};
