import { useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import bingoServices from "../services/bingoService";
import { useState, useEffect } from "react";

export const HomePage = () => {
  const navigate = useNavigate();
  // const [publicBingos, setPublicBingos] = useState([]);

  // useEffect(() => {
  //   getAllPublicBingos();
  // }, []);

  const getBingo = async (bingoCode) => {
    try {
      const response = await bingoServices.findBingoByField(
        "bingo_code",
        bingoCode
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // const getAllPublicBingos = async () => {
  //   try {
  //     const response = await bingoServices.getAllBingos();
  //     setPublicBingos(response);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const goToBingo = async (e) => {
    e.preventDefault();
    const bingoCode = e.target.elements.bingoCode.value;
    const bingoResponse = await getBingo(bingoCode);
    if (bingoResponse) {
      navigate(`/bingo-game/${bingoCode}/${bingoResponse.data._id}`);
    } else {
      alert("Bingo no encotrado. Por favor, verifica el código.");
    }
  };

  return (
    <div className="flex flex-col h-full">
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

      {/* Sección para mostrar bingos públicos */}
      {/* <section className="flex flex-col items-center mt-8">
        <h2 className="text-xl font-bold">Bingos públicos</h2>
        <ul className="mt-4 w-full max-w-lg space-y-4">
          {publicBingos.length === 0 ? (
            <li className="text-center text-gray-500">
              No hay bingos disponibles.
            </li>
          ) : (
            publicBingos.map((bingo) => (
              <li key={bingo._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{bingo.name}</span>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
                    // onClick={() =>
                    //   navigate(`/room-game/${bingo.roomCode}`, {
                    //     state: { roomId: bingo._id, bingoId: bingo.bingoId },
                    //   })
                    // }
                  >
                    Personalizar
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </section> */}
    </div>
  );
};
