import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Alert } from "@material-tailwind/react";
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
      console.error(error.response.data);
    }
  };

  const goToBingo = async (e) => {
    e.preventDefault();
    const bingoCode = e.target.elements.bingoCode.value;
    const bingoResponse = await getBingo(bingoCode);
    if (bingoResponse) {
      navigate(`/bingo-game/${bingoCode}/${bingoResponse.data._id}`);
    } else {
      triggerAlert();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {showAlert && (
        <Alert
          className="fixed w-11/12 bottom-5 left-1/2 transform -translate-x-1/2 z-50"
          color="red"
          onClose={() => setShowAlert(false)}
        >
          Bingo no encontrado. Por favor, verifica el código.
        </Alert>
      )}

      <section className="flex flex-col justify-end items-center min-h-[340px] bg-[url('https://i.ibb.co/3vMvMkM/DALL-E-2024-04-02-18-56-52-Create-an-engaging-background-image-suitable-for-a-bingo-banner-section-T.webp')] bg-no-repeat bg-cover p-8">
        <div className="w-72 bg-black p-5 rounded-lg shadow-2xl" align="center">
          <form onSubmit={goToBingo}>
            <Input
              name="bingoCode"
              type="text"
              color="white"
              label="Ingrese código del bingo"
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
