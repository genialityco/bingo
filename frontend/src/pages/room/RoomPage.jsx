import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
} from '@material-tailwind/react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import BingoCardStatic from '../../components/BingoCard';
import io from 'socket.io-client';
import bingoRoomService from '../../services/bingoRoomService';

const SOCKET_SERVER_URL = 'http://localhost:5000';

export const RoomPage = () => {
  const bottomSectionRef = useRef(null);
  const [liveStreamPosition, setLiveStreamPosition] = useState({ x: 0, y: 0 });
  const [ballots, setBallots] = useState([]);
  const [lastBallot, setLastBallot] = useState(null);
  

  useEffect(() => {
    if (bottomSectionRef.current) {
      bottomSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleDragEnd = (event) => {
    const { delta } = event;
    setLiveStreamPosition({
      x: liveStreamPosition.x + delta.x,
      y: liveStreamPosition.y + delta.y,
    });
  };

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on('ballotUpdate', (data) => {
      console.log('Datos recibidos del servidor:', data);

      // Si los campos actualizados incluyen el historial de balotas,
      // extrae el número de la última balota.
      const updateDescription = data.updateDescription;
      if (updateDescription && updateDescription.updatedFields) {
        const updatedFields = updateDescription.updatedFields;

        // Encuentra la clave que contiene la cadena 'history_of_ballots'
        // y obtén el valor de la última balota actualizada.
        for (const key in updatedFields) {
          if (key.startsWith('history_of_ballots')) {
            const lastBallot = updatedFields[key];
            setLastBallot(lastBallot); // Asumiendo que setLastBallot es tu función de estado
            break; // Rompe el bucle después de encontrar la primera coincidencia
          }
        }
      }
    });

    return () => {
      socket.off('ballotUpdate');
      socket.disconnect();
    };
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className="flex flex-col h-screen w-full overflow-hidden bg-gray-300 p-4"
        ref={bottomSectionRef}
      >
        {/* Información del evento */}
        <section>
          <Accordion title="Bingo especial de fin de semana">
            <Typography variant="small" className="mb-1">
              <strong>Sala:</strong> 10025
            </Typography>
            <Typography variant="small" className="mb-1">
              <strong>Código de cartón:</strong> QC525
            </Typography>
            <Typography variant="small">
              <strong>Jugador:</strong> Juan Mosquera
            </Typography>
            {/* Agrega aquí más detalles que quieras mostrar al expandir */}
          </Accordion>
        </section>

        {/* Contenido principal dividido en dos */}
        <div className="flex flex-1 min-h-0 flex-col md:flex-row">
          {/* Sección del cartón de bingo */}
          <div className="flex flex-col md:hidden">
            <Card className="flex-none">
              <CardBody>
                {/* Balotas y controles */}
                <DataGame lastBallot={lastBallot} />
              </CardBody>
            </Card>
          </div>

          <div className="flex flex-col flex-1 mb-4 md:mb-0 md:mr-2">
            <Card className="flex flex-col flex-1 overflow-y-auto">
              <BingoCard />
            </Card>
          </div>

          {/* Transmisión en miniatura arrastrable para móviles */}

          <DraggableLiveStream position={liveStreamPosition} />

          {/* Sección de transmisión y balotas */}
          <div className="hidden md:flex flex-col flex-1">
            {/* <Card className="mb-4 md:mb-2 flex-1">
              <CardBody className="overflow-auto"> */}
            <Card className="h-full mb-4 md:mb-2 flex-1">
              <CardBody className="relative h-full">
                {/* Contenido de la transmisión */}
                <LiveStream />
                <ButtonWinBingo />
              </CardBody>
            </Card>
            <Card className="flex-none">
              <DataGame lastBallot={lastBallot} />
            </Card>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

const BingoCard = () => {
  // Componente para renderizar el cartón de bingo
  const bingoConfig = {
    _id: {
      $oid: '660ade84bae479acfb0af052',
    },
    name: 'Bingo fiesta',
    amount_of_bingo: 0,
    regulation: 'Combinación ganadora en L',
    bingo_appearance: {
      background_color: '#00bcd4',
      background_image: null,
      banner:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FbingoHeader.png?alt=media&token=973f45a2-deab-42f4-9479-546d9a0315aa',
      footer:
        'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/template%2FbingoFooter.png?alt=media&token=08c9bac6-563d-419a-b207-d2dd2846ba1d',
      dial_image: null,
    },
    bingo_values: [
      {
        carton_value: {
          type: 'text',
          value: '1',
        },
        ballot_value: {
          type: 'text',
          value: '1',
        },
        id: '660ade9c25a980.32569211',
      },
      {
        carton_value: {
          type: 'text',
          value: '2',
        },
        ballot_value: {
          type: 'text',
          value: '2',
        },
        id: '660adea4d2c902.01233147',
      },
      {
        carton_value: {
          type: 'text',
          value: '3',
        },
        ballot_value: {
          type: 'text',
          value: '3',
        },
        id: '660adeb21c8811.28628692',
      },
      {
        carton_value: {
          type: 'text',
          value: '4',
        },
        ballot_value: {
          type: 'text',
          value: '4',
        },
        id: '660adeb6851e25.12228377',
      },
      {
        carton_value: {
          type: 'text',
          value: '5',
        },
        ballot_value: {
          type: 'text',
          value: '5',
        },
        id: '660adebb346b63.01598284',
      },
      {
        carton_value: {
          type: 'text',
          value: '9',
        },
        ballot_value: {
          type: 'text',
          value: '9',
        },
        id: '660adecca3ead7.65120290',
      },
      {
        carton_value: {
          type: 'text',
          value: '10',
        },
        ballot_value: {
          type: 'text',
          value: '10',
        },
        id: '660adf94810f30.86570050',
      },
      {
        carton_value: {
          type: 'text',
          value: '11',
        },
        ballot_value: {
          type: 'text',
          value: '11',
        },
        id: '660adf9a59de89.86574502',
      },
      {
        carton_value: {
          type: 'text',
          value: '12',
        },
        ballot_value: {
          type: 'text',
          value: '12',
        },
        id: '660adf9ea6b8b5.39437622',
      },
      {
        carton_value: {
          type: 'text',
          value: '13',
        },
        ballot_value: {
          type: 'text',
          value: '13',
        },
        id: '660adfa366dec0.37280184',
      },
      {
        carton_value: {
          type: 'text',
          value: '14',
        },
        ballot_value: {
          type: 'text',
          value: '14',
        },
        id: '660adfa7b27c87.77710858',
      },
      {
        carton_value: {
          type: 'text',
          value: '19',
        },
        ballot_value: {
          type: 'text',
          value: '19',
        },
        id: '660adfbf7463a0.91690949',
      },
      {
        carton_value: {
          type: 'text',
          value: '20',
        },
        ballot_value: {
          type: 'text',
          value: '20',
        },
        id: '660adfc5742250.95888449',
      },
      {
        carton_value: {
          type: 'text',
          value: '21',
        },
        ballot_value: {
          type: 'text',
          value: '21',
        },
        id: '660adfc968e0b6.79109486',
      },
      {
        carton_value: {
          type: 'text',
          value: '22',
        },
        ballot_value: {
          type: 'text',
          value: '22',
        },
        id: '660adfcde02b54.21404474',
      },
      {
        carton_value: {
          type: 'text',
          value: '23',
        },
        ballot_value: {
          type: 'text',
          value: '23',
        },
        id: '660adfd1f2bc24.09131204',
      },
    ],
    dimensions: {
      amount: 16,
      format: '4x4',
      minimun_values: 32,
    },
    event_id: '660ade4a4cea7dc676010c72',
    updated_at: {
      $date: '2024-04-03T20:24:53.157Z',
    },
    created_at: {
      $date: '2024-04-01T16:19:16.603Z',
    },
  };

  return <BingoCardStatic bingoConfig={bingoConfig} />;
};

const LiveStream = () => {
  // Componente para la transmisión en vivo
  return <div>Transmisión en vivo aquí</div>;
};

const BallsDrawn = ({ lastBallot }) => {
  // Componente para mostrar las balotas que salen
  return (
    <div>
      <Typography>
        {lastBallot
          ? '¡El bingo ha iniciado!'
          : '¡El bingo aún no ha iniciado!'}
      </Typography>
      {lastBallot && (
        <Typography variant="h5" className="bg-green-500">
          Última balota sacada: {lastBallot}
        </Typography>
      )}
      {/* Puedes agregar más lógica aquí para mostrar las balotas como lo necesites */}
    </div>
  );
};

const History = ({ lastBallot }) => {
  const [ballotsHistory, setBallotsHistory] = useState([]);
 
  useEffect(() => {
    const getBallotsHistory = async () => {
      try {
        const roomData = await bingoRoomService.getRoomById(
          '661077c0bfb6c413af382930'
        );
        setBallotsHistory(roomData.history_of_ballots);
      } catch (error) {
        console.error(error);
      }
    };
    getBallotsHistory();
  }, [lastBallot]);

  return (
    <div className="w-full md:max-w-xs lg:max-w-md xl:max-w-2xl overflow-hidden">
      <div className="w-full flex overflow-x-auto ">
        {ballotsHistory.map((ballot, index) => (
          <Typography
            key={index}
            className="flex justify-center items-center text-xl p-4 bg-blue-50 rounded-full shadow-xl shadow-blue-500/50 h-12 w-12 m-1"
          >
            {ballot}
          </Typography>
        ))}
      </div>
    </div>
  );
};

const Figure = () => {
  return <div>Figura aquí</div>;
};

const DataGame = ({ lastBallot }) => {
  const dataTabs = [
    {
      label: 'Balotas',
      value: 'balls',
      content: <BallsDrawn lastBallot={lastBallot} />,
    },
    {
      label: 'Historial de balotas',
      value: 'HistoryBalls',
      content: <History lastBallot={lastBallot} />,
    },
    {
      label: 'Figura',
      value: 'Figure',
      content: <Figure />,
    },
  ];

  return (
    <Tabs value="balls">
      <TabsHeader>
        {dataTabs.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody>
        {dataTabs.map(({ value, content }) => (
          <TabPanel key={value} value={value}>
            {content}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );
};

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 bg-black rounded">
      <div className="cursor-pointer p-4" onClick={() => setIsOpen(!isOpen)}>
        <Typography
          variant="h6"
          color="white"
          className="uppercase text-sm md:text-base"
        >
          {title}
        </Typography>
      </div>
      {isOpen && <div className="p-3 text-white">{children}</div>}
    </div>
  );
};

const DraggableLiveStream = ({ position }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: 'draggable-live-stream',
  });

  const style = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: 'transform 0.2s',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="absolute bottom-4 left-4 w-40 h-24 bg-black opacity-90 hover:opacity-100 z-10 md:hidden"
    >
      <LiveStream />
    </div>
  );
};

const ButtonWinBingo = () => {
  const [bingoNumbers, setBingoNumbers] = useState([]);
  const [templateSelected, setTemplateSelected] = useState({});
  console.log(templateSelected)

  
  const handleClickSingBingo = () => {
    // Extraer el objeto del template seleccionado del localStorage
    const storedTemplate = localStorage.getItem('selectedBingoTemplate');
    if (storedTemplate) {
      const template = JSON.parse(storedTemplate);
      setTemplateSelected(template);
      // Verifica si el patrón seleccionado coincide con los números marcados en la cartilla de bingo
  switch (template.category) {
    case 'linea':
      // Verifica si alguna fila tiene todos sus números marcados
      for (let i = 0; i < bingoNumbers.length; i++) {
        const row = bingoNumbers[i];
        if (row.every(number => number.isMarked)) {
          return true;
        }
      }
      return false;
    case 'columna':
      // Verifica si alguna columna tiene todos sus números marcados
      for (let i = 0; i < bingoNumbers[0].length; i++) {
        let column = [];
        for (let j = 0; j < bingoNumbers.length; j++) {
          column.push(bingoNumbers[j][i]);
        }
        if (column.every(number => number.isMarked)) {
          return true;
        }
      }
      return false;
    case 'cartilla':
      // Verifica si todos los números en la cartilla están marcados
      return bingoNumbers.every(row => row.every(number => number.isMarked));
    default:
      return false;
  }

    //   
    }
  };

  return (
    <div className="absolute right-1 bottom-1">
      <Button size="sm" onClick={handleClickSingBingo}>
        Cantar Bingo!
      </Button>
    </div>
  );
};



