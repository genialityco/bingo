import { Typography, Alert } from "@material-tailwind/react";
import DimensionsBingoCard from "./components/DimensionsBingoCard/DimensionsBingoCard";
import AppearanceCard from "./components/AppearanceBingo/AppearanceCard";
import CardAssigment from "./components/CardAssigment/CardAssigment";

// Importaciones de servicios
import bingoServices from "../../services/bingoService";
import bingoTemplateServices from "../../services/bingoTemplateService";

// Contextos
import { NewBingoContext } from "./context/NewBingoContext";
import { useLoading } from "../../context/LoadingContext";

import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CustomBingoViewHeader } from "./components/CustomBingoViewHeader";
import { CustomBingoTabs } from "./components/CustomBingoTabs";
import {
  handleAppearanceImageUploads,
  handleBingoValuesImageUploads,
} from "../../utils/imageUploadHelpers";

const BingoConfig = () => {
  const { bingo, updateBingo } = useContext(NewBingoContext);
  const { showLoading, hideLoading } = useLoading();
  const [newBingoCreated, setNewBingoCreated] = useState(null);
  const [modifiedBingoTemplate, setModifiedBingoTemplate] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bingoId = searchParams.get("bingoId");
  const isTemplate = searchParams.get("isTemplate");

  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    color: "lightBlue",
    message: "",
  });

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

  const triggerAlert = (color, message) => {
    setAlertData({ color, message });
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
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

      if (isTemplate === "true") {
        response = await bingoTemplateServices.updateTemplate(
          modifiedBingoTemplate._id,
          modifiedBingoTemplate,
          showLoading,
          hideLoading
        );
      } else {
        response = await bingoServices.updateBingo(
          modifiedBingoTemplate._id,
          modifiedBingoTemplate,
          showLoading,
          hideLoading
        );
      }
      const { status, message } = response;
      if (status === "Success") {
        let color = "green";
        let message = "Actualizado correctamente";
        triggerAlert(color, message);
      }
    } catch (error) {
      console.log("Error en el envio de la configuración del bingo", error);
      let color = "red";
      let message =
        "Hubo un error al enviar la configuración del bingo. Por favor, intenta nuevamente.";
      triggerAlert(color, message);
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

  const deleteBingo = async () => {
    try {
      const { status } = await bingoServices.deleteBingo(bingoId);

      if (status === "Success") {
        let color = "red";
        let message = "Eliminado correctamente";
        triggerAlert(color, message);
        setTimeout(() => {
          navigate("/list-bingos");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTemplate = async () => {
    try {
      const { status } = await bingoTemplateServices.deleteTemplate(bingoId);

      if (status === "Success") {
        let color = "red";
        let message = "Eliminado correctamente";
        triggerAlert(color, message);
        setTimeout(() => {
          navigate("/list-bingos");
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Taps de los componentes que renderiza este componente BingoConfig
  const data = [
    {
      label: "Configurar Bingo",
      value: "configurar bingo",
      desc: <DimensionsBingoCard sendBingoCreated={sendBingoCreated} />,
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
      {showAlert && (
        <Alert
          color={alertData.color}
          onClose={() => setShowAlert(false)}
          className="fixed w-11/12 bottom-5 left-1/2 transform -translate-x-1/2 z-50 shadow"
        >
          {alertData.message}
        </Alert>
      )}
      <Typography variant="h3" color="blue-gray" className=" text-center">
        Personaliza tu bingo
      </Typography>

      {modifiedBingoTemplate && (
        <CustomBingoViewHeader
          handleSendUpdateTemplateBingo={handleSendUpdateTemplateBingo}
          isPublish={modifiedBingoTemplate.is_public}
          publishTemplate={publishTemplate}
          deleteBingo={deleteBingo}
          deleteTemplate={deleteTemplate}
          bingoId={bingoId}
          isTemplate={isTemplate}
        />
      )}
      <CustomBingoTabs data={data} />
    </div>
  );
};

export default BingoConfig;
