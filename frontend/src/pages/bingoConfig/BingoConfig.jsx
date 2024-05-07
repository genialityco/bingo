import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Typography,
  Button,
} from '@material-tailwind/react';
import DimensionsBingoCard from './components/DimensionsBingoCard/DimensionsBingoCard';
import AppearanceCard from './components/AppearanceBingo/AppearanceCard';
import CardAssigment from './components/CardAssigment';
import { useState, useContext, useEffect } from 'react';
import bingoService from '../../services/bingoService';
import { useNavigate, useLocation } from 'react-router-dom';
import { NewBingoContext } from './context/NewBingoContext';
import { isBase64Url, uploadBase64ImageToFirebase } from '../../utils/validationImageExternalUrl';
import { v4 } from 'uuid';

const BingoConfig = () => {
  const { bingoCard, updateBingoCard } = useContext(NewBingoContext);
  // console.log(bingoCard)
  const [newBingoCreated, setNewBingoCreated] = useState(null);
  // console.log(newBingoCreated);
  const [modifiedBingoTemplate, setModifiedBingoTemplate] = useState(null);
  // console.log(modifiedBingoTemplate);

  const { search } = useLocation();
  const templateid = search.substring(4);
  // console.log(templateid)

  const navigate = useNavigate();

  useEffect(() => {
    const getTemplateByIdToEdit = async () => {
      const response = await bingoService.getBingoById(templateid);
      updateBingoCard(response);
      setModifiedBingoTemplate(response);
      // Aquí también podrías inicializar newBingoCreated si lo necesitas
      // setNewBingoCreated(response);
    };
    if (templateid) {
      getTemplateByIdToEdit();
    } else {
      // Si no se selecciona un template existente, inicializa newBingoCreated con un objeto vacío
      setNewBingoCreated({});
    }
  }, [templateid]);

  const sendBingoCreated = (customBingo) => {
    setNewBingoCreated(customBingo);
  };

  //crear una config de bingo desde cero o modificar sobre un template de bingo
  const newBingoData = newBingoCreated
    ? newBingoCreated
    : modifiedBingoTemplate;
  console.log(newBingoData);

 
  //Envia los datos del objeto del carton bingo creado
  const handleOnClickSendBingoCreated = async (e) => {
    e.preventDefault();
    try {
      
      const response = await bingoService.createBingo(newBingoData);
      const { status, message, data } = response;
    
      if (status === 'success') {
        alert(message);
      }
      navigate('/list-bingos');
    } catch (error) {
      console.log('Error en el envio de la configuración del bingo', error);
      alert(
        'Hubo un error al enviar la configuración del bingo. Por favor, intenta nuevamente.'
      );
    }
  };

  // Función para manejar los cambios en la configuración del bingo
  const handleBingoConfigChange = (updatedConfig) => {
    setModifiedBingoTemplate(updatedConfig);
  };

  //Taps de los componentes que renderiza este componente BingoConfig
  const data = [
    {
      label: 'Configurar Bingo',
      value: 'configurar bingo',
      desc: (
        <DimensionsBingoCard
          sendBingoCreated={sendBingoCreated}
          modifiedBingoTemplate={modifiedBingoTemplate}
          onConfigChange={handleBingoConfigChange}
        />
      ),
    },
    {
      label: 'Apariencia del cartón',
      value: 'apariencia del cartón',
      desc: <AppearanceCard />,
    },
    {
      label: 'Asignación de cartones',
      value: 'asignación de cartones',
      desc: <CardAssigment />,
    },
  ];

  return (
    <div className="my-5 flex flex-col justify-center items-center">
      <Typography variant="h3" color="blue-gray" className=" text-center">
        Personaliza tu sala de juego
      </Typography>
      {/* Info admin */}
      <Card className=" w-full shadow-none">
        <CardBody className="flex flex-col justify-between items-center sm:flex-row gap-8">
          <div className="flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-10 h-10"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Administrador Juego
            </Typography>
          </div>
          {/* Buttons with icon */}
          <div className="flex items-center gap-5">
            <Button
              className="flex items-center gap-3"
              onClick={(e) => handleOnClickSendBingoCreated(e)}
            >
              Guardar
            </Button>
            <Button className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
              Eliminar
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs value="html" className="w-full ">
        <TabsHeader
          className="bg-gray-200 flex justify-center items-center"
          indicatorProps={{
            className: 'bg-gray-900/10 shadow-none !text-gray-900',
          }}
        >
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {desc}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default BingoConfig;
