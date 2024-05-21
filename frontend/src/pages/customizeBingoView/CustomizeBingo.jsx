import { Typography } from "@material-tailwind/react";
import DimensionsBingoCard from "./components/DimensionsBingoCard/DimensionsBingoCard";
import AppearanceCard from "./components/AppearanceBingo/AppearanceCard";
import CardAssigment from "./components/CardAssigment/CardAssigment";

// Importaciones de servicios
import bingoServices from "../../services/bingoService";
import bingoTemplateServices from "../../services/bingoTemplateService";

import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NewBingoContext } from "./context/NewBingoContext";
import { CustomBingoViewHeader } from "./components/CustomBingoViewHeader";
import { CustomBingoTabs } from "./components/CustomBingoTabs";
import {
  isBase64Url,
  uploadBase64ImageToFirebase,
} from '../../utils/validationImageExternalUrl';
import { v4 } from 'uuid';

const BingoConfig = () => {
  const { bingo, updateBingo } = useContext(NewBingoContext);
  const [newBingoCreated, setNewBingoCreated] = useState(null);
  const [modifiedBingoTemplate, setModifiedBingoTemplate] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bingoId = searchParams.get("bingoId");
  const isTemplate = searchParams.get("isTemplate");

  const navigate = useNavigate();

  useEffect(() => {
    const getTemplateByIdToEdit = async () => {
      let response;
      if (isTemplate === "true") {
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

  //Envia los datos del objeto del carton bingo creado
  const handleOnClickSendBingoCreated = async (e) => {
    e.preventDefault();
    try {
     //copia del objeto bingo para realizar cambios sin mutarlo directamente
     let updatedBingo = { ...modifiedBingoTemplate };

     // Promesas para cargar imágenes de apariencia
     const appearancePromises = Object.entries(updatedBingo.bingo_appearance)
       .slice(1)
       .map(async ([clave, valor]) => {
         if (valor !== '') {
           const firebaseUrl = isBase64Url(valor);
           if (firebaseUrl) {
             try {
               const url = await uploadBase64ImageToFirebase(valor, v4());
               updatedBingo.bingo_appearance[clave] = url;
             } catch (error) {
               console.error(
                 'Error al cargar la imagen de la apariencia:',
                 error
               );
             }
           }
         }
       });

     // Promesas para cargar imágenes de cartón y balota
     const bingoPromises = updatedBingo.bingo_values.map(
       async (bingo, index) => {
         if (bingo.carton_type === 'image') {
           const firebaseUrl = isBase64Url(bingo.carton_value);
           if (firebaseUrl) {
             try {
               const url = await uploadBase64ImageToFirebase(
                 bingo.carton_value,
                 v4()
               );
               updatedBingo.bingo_values[index].carton_value = url;
             } catch (error) {
               console.error('Error al cargar la imagen del cartón:', error);
             }
           }
         }
         if (bingo.ballot_type === 'image') {
           const firebaseUrl = isBase64Url(bingo.ballot_value);
           if (firebaseUrl) {
             try {
               const url = await uploadBase64ImageToFirebase(
                 bingo.ballot_value,
                 v4()
               );
               updatedBingo.bingo_values[index].ballot_value = url;
             } catch (error) {
               console.error('Error al cargar la imagen de la balota:', error);
             }
           }
         }
       }
     );

     // Esperar a que se completen todas las promesas
     await Promise.all([...appearancePromises, ...bingoPromises]);

      const response = await bingoTemplateServices.createBingo(modifiedBingoTemplate);
      const { status, message } = response;

      if (status === "success") {
        alert(message);
      }
      navigate("/list-bingos");
    } catch (error) {
      console.log("Error en el envio de la configuración del bingo", error);
      alert(
        "Hubo un error al enviar la configuración del bingo. Por favor, intenta nuevamente."
      );
    }
  };

  //actualizar bingo
  const handleSendUpdateTemplateBingo = async (e) => {
    e.preventDefault();
    try {
       //copia del objeto bingo para realizar cambios sin mutarlo directamente
      let updatedBingo = { ...modifiedBingoTemplate};

      // Promesas para cargar imágenes de apariencia
      const appearancePromises = Object.entries(updatedBingo.bingo_appearance)
        .slice(1)
        .map(async ([clave, valor]) => {
          if (valor !== '') {
            const firebaseUrl = isBase64Url(valor);
            if (firebaseUrl) {
              try {
                const url = await uploadBase64ImageToFirebase(valor, v4());
                updatedBingo.bingo_appearance[clave] = url;
              } catch (error) {
                console.error(
                  'Error al cargar la imagen de la apariencia:',
                  error
                );
              }
            }
          }
        });

      // Promesas para cargar imágenes de cartón y balota
      const bingoPromises = updatedBingo.bingo_values.map(
        async (bingo, index) => {
          if (bingo.carton_type === 'image') {
            const firebaseUrl = isBase64Url(bingo.carton_value);
            if (firebaseUrl) {
              try {
                const url = await uploadBase64ImageToFirebase(
                  bingo.carton_value,
                  v4()
                );
                updatedBingo.bingo_values[index].carton_value = url;
              } catch (error) {
                console.error('Error al cargar la imagen del cartón:', error);
              }
            }
          }
          if (bingo.ballot_type === 'image') {
            const firebaseUrl = isBase64Url(bingo.ballot_value);
            if (firebaseUrl) {
              try {
                const url = await uploadBase64ImageToFirebase(
                  bingo.ballot_value,
                  v4()
                );
                updatedBingo.bingo_values[index].ballot_value = url;
              } catch (error) {
                console.error('Error al cargar la imagen de la balota:', error);
              }
            }
          }
        }
      );

      // Esperar a que se completen todas las promesas
      await Promise.all([...appearancePromises, ...bingoPromises]);

      

      let response;

      if (isTemplate === "true") {
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

      if (status === "Success") {
        alert(message);
      }
    } catch (error) {
      console.log("Error en el envio de la configuración del bingo", error);
      alert(
        "Hubo un error al enviar la configuración del bingo. Por favor, intenta nuevamente."
      );
    }
  };

  // Hacer una plantilla publica
  const publishTemplate = (status) => {
    const updateIsPublic = {
      ...modifiedBingoTemplate,
      is_public: status,
    }
    setModifiedBingoTemplate(updateIsPublic);
  };



  //Taps de los componentes que renderiza este componente BingoConfig
  const data = [
    {
      label: "Configurar Bingo",
      value: "configurar bingo",
      desc: (
        <DimensionsBingoCard
          sendBingoCreated={sendBingoCreated}
             
        />
      ),
    },
    {
      label: "Apariencia del cartón",
      value: "apariencia del cartón",
      desc: <AppearanceCard appearanceBingoCarton={appearanceBingoCarton} />,
    },
    {
      label: "Asignación de cartones",
      value: "asignación de cartones",
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
          handleOnClickSendBingoCreated={handleOnClickSendBingoCreated}
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
