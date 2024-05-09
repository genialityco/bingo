import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
export const LiveStream = ({
  bingoConfig,
  playerName,
  cardboardCode,
  logs,
}) => {
  return (
    <div>
      <section>
        {bingoConfig && (
          <Accordion name={bingoConfig?.name}>
            <Typography variant="small" className="mb-1">
              <strong>Código de cartón:</strong> {cardboardCode}
            </Typography>
            <Typography variant="small">
              <strong>Jugador:</strong> {playerName}
            </Typography>
          </Accordion>
        )}
      </section>
      <section className="hidden sm:block">
        <SectionLiveStream />
      </section>
      <section>
        <div>
          <Typography variant="h6" className="mb-2">
            Logs del Juego
          </Typography>
          <div className="bg-gray-200 p-3 rounded">
            {logs &&
              logs.length > 0 &&
              logs.map((log, index) => (
                <Typography key={index} variant="small">
                  {log}
                </Typography>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const SectionLiveStream = () => {
  return (
    <>
      <Typography variant="h5">Transmisión</Typography>
    </>
  );
};

const Accordion = ({ name, children }) => {
  return (
    <div className="mb-1 bg-black rounded">
      <Typography
        variant="h6"
        color="white"
        className=" pl-3 pt-2 uppercase text-sm md:text-base"
      >
        {name}
      </Typography>
      <div className="p-3 text-white">{children}</div>
    </div>
  );
};
