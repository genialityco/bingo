import { Typography } from '@material-tailwind/react';
import DimensionsBingoCard from './components/DimensionsBingoCard/DimensionsBingoCard';
import AppearanceCard from './components/AppearanceBingo/AppearanceCard';
import CardAssigment from './components/CardAssigment/CardAssigment';

// Importaciones de servicios
import bingoServices from '../../services/bingoService';
import bingoTemplateServices from '../../services/bingoTemplateService';

import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NewBingoContext } from './context/NewBingoContext';
import { CustomBingoViewHeader } from './components/CustomBingoViewHeader';
import { CustomBingoTabs } from './components/CustomBingoTabs';
import { handleAppearanceImageUploads, handleBingoValuesImageUploads } from '../../utils/imageUploadHelpers';

const BingoConfig = () => {
  const { bingo, updateBingo } = useContext(NewBingoContext);
  const [newBingoCreated, setNewBingoCreated] = useState(null);
  const [modifiedBingoTemplate, setModifiedBingoTemplate] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bingoId = searchParams.get('bingoId');
  const isTemplate = searchParams.get('isTemplate');

  const navigate = useNavigate();

  useEffect(() => {
    const getTemplateByIdToEdit = async () => {
      let response;
      if (isTemplate === 'true') {
        response = await bingoTemplateServices.getTemplateById(bingoId);
      } else {
        response = await bingoServices.getBingoById(bingoId);
      }
      updateBingo(response);
    };

    if (bingoId) {
      getTemplateByIdToEdit();
    } else {
      setNewBingoCreated({});
    }
  }, [bingoId]);

  const sendBingoCreated = (customBingo) => {
    setModifiedBingoTemplate(customBingo);
  };

  //envia la info de la apariencia del carton
  const appearanceBingoCarton = (appearance) => {
    const customAppearance = appearance;
    setModifiedBingoTemplate({
      ...modifiedBingoTemplate,
      bingo_appearance: customAppearance,
    });
  };

  //crea un template del bingo
  const handleOnClickSendBingoCreated = async (e) => {
    e.preventDefault();
    try {
      
      // copia del objeto bingo para realizar cambios sin mutarlo directamente
      let updatedBingo = { ...modifiedBingoTemplate };

      // Promesas para cargar imágenes de apariencia
      await handleAppearanceImageUploads(updatedBingo.bingo_appearance);

      // Promesas para cargar imágenes de cartón y balota
      await handleBingoValuesImageUploads(updatedBingo.bingo_values);
      

      const response = await bingoTemplateServices.createBingo(
        modifiedBingoTemplate
      );
      const { status, message } = response;

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

  //actualizar bingo
  const handleSendUpdateTemplateBingo = async (e) => {
    e.preventDefault();
    try {
         
      // copia del objeto bingo para realizar cambios sin mutarlo directamente
      let updatedBingo = { ...modifiedBingoTemplate };

      // Promesas para cargar imágenes de apariencia
      await handleAppearanceImageUploads(updatedBingo.bingo_appearance);

      // Promesas para cargar imágenes de cartón y balota
      await handleBingoValuesImageUploads(updatedBingo.bingo_values);

      let response;

      if (isTemplate === 'true') {
        response = await bingoTemplateServices.updateTemplate(
          modifiedBingoTemplate._id,
          modifiedBingoTemplate
        );
      } else {
        response = await bingoServices.updateBingo(
          modifiedBingoTemplate._id,
          modifiedBingoTemplate
        );
      }
      const { status, message } = response;

      if (status === 'Success') {
        alert(message);
      }
    } catch (error) {
      console.log('Error en el envio de la configuración del bingo', error);
      alert(
        'Hubo un error al enviar la configuración del bingo. Por favor, intenta nuevamente.'
      );
    }
  };

  // Hacer una plantilla publica
  const publishTemplate = (status) => {
    const updateIsPublic = {
      ...modifiedBingoTemplate,
      is_public: status,
    };
    setModifiedBingoTemplate(updateIsPublic);
  };

  //Taps de los componentes que renderiza este componente BingoConfig
  const data = [
    {
      label: 'Configurar Bingo',
      value: 'configurar bingo',
      desc: <DimensionsBingoCard sendBingoCreated={sendBingoCreated} />,
    },
    {
      label: 'Apariencia del cartón',
      value: 'apariencia del cartón',
      desc: <AppearanceCard appearanceBingoCarton={appearanceBingoCarton} />,
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
        Personaliza tu bingo
      </Typography>

      {modifiedBingoTemplate && (
        <CustomBingoViewHeader
          handleSendUpdateTemplateBingo={handleSendUpdateTemplateBingo}
          isPublish={modifiedBingoTemplate.is_public}
          publishTemplate={publishTemplate}
          bingoId={bingoId}
          isTemplate={isTemplate}
        />
      )}
      <CustomBingoTabs data={data} />
    </div>
  );
};

export default BingoConfig;
