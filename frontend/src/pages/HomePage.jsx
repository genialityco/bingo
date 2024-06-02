import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Alert, Typography } from "@material-tailwind/react";
import bingoServices from "../services/bingoService";
import { useLoading } from "../context/LoadingContext";

export const HomePage = () => {
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const triggerAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const getBingo = async (bingoCode) => {
    try {
      const response = await bingoServices.findBingoByField(
        "bingo_code",
        bingoCode,
        showLoading,
        hideLoading
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const goToBingo = async (e) => {
    e.preventDefault();
    const bingoCode = e.target.elements.bingoCode.value.trim();
    if (!bingoCode) {
      triggerAlert();
      return;
    }
    const bingoResponse = await getBingo(bingoCode);
    if (bingoResponse) {
      navigate(`/bingo-game/${bingoCode}/${bingoResponse.data._id}`);
    } else {
      triggerAlert();
    }
  };

  return (
    <div className="flex flex-col relative" style={{height: '92vh'}}>
      {showAlert && (
        <Alert
          className="fixed w-11/12 bottom-5 left-1/2 transform -translate-x-1/2 z-50"
          color="red"
          onClose={() => setShowAlert(false)}
        >
          Bingo no encontrado. Por favor, verifica el código.
        </Alert>
      )}

      <section className="flex flex-col justify-center items-center h-full bg-[url('https://firebasestorage.googleapis.com/v0/b/magnetic-be10a.appspot.com/o/Bingo%2FSLIDER_01_B.ESPECIALES.png?alt=media&token=b9065304-95c3-4c25-940e-989b47f2c41d')] bg-no-repeat bg-cover p-8">
        <div
          className="w-80 bg-black bg-opacity-75 p-5 rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
          align="center"
        >
          <Typography color="white" variant="h6" className="mb-5">¡Bievenido jugador!</Typography>
          <Typography color="white" variant="small" className="mb-5">Ingresa el código del bingo para jugar</Typography>
          <form onSubmit={goToBingo} className="flex flex-col items-center">
            <Input
              name="bingoCode"
              type="text"
              color="white"
              label="Código"
              className="text-center"
              required
            />
            <button className="bg-blue-500 rounded-full text-white mt-3 py-2 px-4 hover:bg-blue-400 transition duration-300 ease-in-out shadow-lg hover:shadow-xl animate-pulse-infinite">
              Entrar al bingo
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
