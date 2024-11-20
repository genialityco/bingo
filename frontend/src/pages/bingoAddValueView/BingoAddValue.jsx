import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Typography,
  Button,
  ButtonGroup,
  CardFooter,
  Input,
  Textarea,
  Alert,
} from "@material-tailwind/react";
import bingoServices from "../../services/bingoService";
import { useLoading } from "../../context/LoadingContext";

export const BingoAddValue = () => {
  const { bingoId } = useParams();
  const { showLoading, hideLoading } = useLoading();
  const [infoEmpresa, setInfoEmpresa] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [resultado, setResultado] = useState(undefined);
  const [error, setError] = useState(undefined);

  const addBingoValue = async () => {
    if (!nombreEmpresa || !infoEmpresa) {
      alert(
        "Información incompleta, porfavor llevar nombre de empresa y datos de la empresa"
      );
    }
    try {
      var data = {
        ballot_type: "default",
        ballot_value: infoEmpresa,
        carton_type: "default",
        carton_value: nombreEmpresa,
      };

      const bingoResponse = await bingoServices.addBingoValue(
        bingoId,
        data,
        showLoading,
        hideLoading
      );
      console.log("bingoResponse", bingoResponse);
      setResultado(bingoResponse);
    } catch (error) {
      console.error("Error:", error);
      setError(error);
    }
  };

  // useEffect(() => {
  //   if (bingoId) {
  //     //fetchInitialData();
  //   }
  // }, [bingoId]);

  const backgroundStyle = {
    backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/images%2F4d2727bd-871a-4000-ab26-8b88eebb534e?alt=media&token=d436ab50-9b3a-4a03-8c9b-e5b0807ae293')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    minHeight: "100vh",
  };

  return (
    <div
      className="flex flex-col w-full bg-gray-300 p-2"
      style={backgroundStyle}
    >
      <div className="w-full">
        <Card className="w-full">
          <CardBody className="flex flex-wrap justify-center items-center gap-2">
            <Typography variant="h6" className="w-full text-center">
              Información de la empresa
            </Typography>
            <Typography variant="small">Toda la información proporcionada está protegida conforme a la Ley de Habeas Data.</Typography>

            <div className="w-full">
              <Input
                label="Empresa"
                value={nombreEmpresa}
                onChange={(e) => setNombreEmpresa(e.target.value)} 
              />
            </div>
            <div className="w-full">
              <Textarea
                label="Datos empresa"
                value={infoEmpresa}
                onChange={(e) => {
                  if (e.target.value.length <= 300) {
                    setInfoEmpresa(e.target.value); 
                  }
                }}
                resize={true} 
              />
              <p className="text-sm text-gray-600 mt-1">
                {infoEmpresa.length}/300 caracteres máximo
              </p>
            </div>
          </CardBody>
          <CardFooter>
            {!resultado && (
              <ButtonGroup className="flex justify-center">
                <Button className="normal-case" onClick={() => addBingoValue()}>
                  Enviar Información
                </Button>
                <Button className="normal-case"></Button>
              </ButtonGroup>
            )}
            {resultado && (
              <Alert color="green">
                Gracias, información Enviada correctamente; Por favor espere un
                momento a que inicie la actividad
              </Alert>
            )}
            {error && (
              <Alert color="red">
                Ha sudecido un error intente en un momento
              </Alert>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
