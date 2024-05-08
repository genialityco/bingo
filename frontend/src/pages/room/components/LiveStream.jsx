import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
export const LiveStream = ({
  bingoConfig,
  playerName,
  cardboardCode,
  logs,
}) => {
  console.log(logs);
  return (
    <div>
      <section>
        {bingoConfig && (
          <Accordion title={bingoConfig?.title}>
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

const Accordion = ({ title, children }) => {
  return (
    <div className="mb-1 bg-black rounded">
      {/* <div className="p-4">
        <Typography
          variant="h6"
          color="white"
          className="uppercase text-sm md:text-base"
        >
          {title}
        </Typography>
      </div> */}
      <div className="p-3 text-white">{children}</div>
    </div>
  );
};
