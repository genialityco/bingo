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
    <div className="flex flex-col relative min-h-screen">
      {/* Header */}
      <header className="w-full">
        <img
          src="https://ik.imagekit.io/6cx9tc1kx/HEADER-NAVIDAD.png"
          alt="Header"
          className="w-full object-contain"
          style={{ aspectRatio: "1920 / 540" }}
        />
      </header>

      {showAlert && (
        <Alert
          className="fixed w-11/12 bottom-5 left-1/2 transform -translate-x-1/2 z-50"
          color="red"
          onClose={() => setShowAlert(false)}
        >
          Bingo no encontrado. Por favor, verifica el código.
        </Alert>
      )}

      {/* Main Section */}
      <section
        className="flex justify-center items-center flex-grow bg-gray-50 p-4"
      >
        <div
          className="w-full bg-black bg-opacity-75 p-5 rounded-lg shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
          align="center"
        >
          <Typography color="white" variant="h6" className="mb-5">
            ¡Bievenido jugador!
          </Typography>
          <Typography color="white" variant="small" className="mb-5">
            Ingresa el código para jugar
          </Typography>
          <form onSubmit={goToBingo} className="flex flex-col items-center max-w-sm">
            <Input
              name="bingoCode"
              type="text"
              color="white"
              label="Código"
              className="text-center"
              required
            />
            <button className="bg-blue-500 rounded-full text-white mt-3 py-2 px-4 hover:bg-blue-400 transition duration-300 ease-in-out shadow-lg hover:shadow-xl animate-pulse-infinite">
              Entrar al juego
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full">
        <img
          src="https://ik.imagekit.io/6cx9tc1kx/FOOTER-NAVIDAD.png"
          alt="Footer"
          className="w-full object-contain"
          style={{ aspectRatio: "1920 / 280" }}
        />
      </footer>
    </div>
  );
};
