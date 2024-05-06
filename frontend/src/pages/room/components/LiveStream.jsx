import { useState } from "react";
import { Typography } from "@material-tailwind/react";
export const LiveStream = ({ bingoConfig, playerName, cardboardCode }) => {
  // Componente para la transmisión en vivo
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1 bg-black rounded">
      <div
        className="flex justify-between cursor-pointer p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Typography
          variant="h6"
          color="white"
          className="uppercase text-sm md:text-base"
        >
          {title}
        </Typography>

        {!isOpen ? (
          <Typography
            variant="h6"
            color="white"
            className="text-sm md:text-base"
          >
            Ver más...
          </Typography>
        ) : (
          <Typography
            variant="h6"
            color="white"
            className="text-sm md:text-base"
          >
            Ocultar
          </Typography>
        )}
      </div>
      {isOpen && <div className="p-3 text-white">{children}</div>}
    </div>
  );
};
