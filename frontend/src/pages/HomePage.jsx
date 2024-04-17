import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import bingoRoomService from "../services/bingoRoomService";

export const HomePage = () => {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const getBingoRoom = async () => {
    try {
      // Asumiendo que el campo por el cual quieres buscar es "code"
      const response = await bingoRoomService.findRoomByField(
        "roomCode",
        roomCode
      );
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const goToRoom = async (e) => {
    e.preventDefault();
    const bingoRoom = await getBingoRoom();
    if (bingoRoom && bingoRoom.data) {
      // Asumiendo que el objeto de respuesta tiene la propiedad data que contiene los detalles de la sala
      navigate(`/room-game`, {
        state: { roomId: bingoRoom.data._id, bingoId: bingoRoom.data.bingoId },
      });
    } else {
      alert("Sala no encontrada. Por favor, verifica el código.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Banner Section */}
      <section className="flex flex-col justify-end items-center min-h-[340px] bg-[url('https://i.ibb.co/3vMvMkM/DALL-E-2024-04-02-18-56-52-Create-an-engaging-background-image-suitable-for-a-bingo-banner-section-T.webp')] bg-no-repeat bg-cover p-8">
        <div className="w-72 bg-black p-5 rounded-lg shadow-2xl" align="center">
          <form onSubmit={goToRoom}>
            <Input
              type="text"
              color="white"
              label="Ingrese código de sala"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button className="bg-blue-500 rounded-full text-white mt-3 py-2 px-4 hover:bg-blue-400 transition duration-300 ease-in-out shadow-lg hover:shadow-xl animate-pulse-infinite">
              Entrar a la sala
            </button>
          </form>
        </div>
      </section>

      {/* Play and Try Section */}
      <section className="p-8">
        <h2 className="text-xl font-semibold mb-6 text-center">
          ¡Juega y prueba!
        </h2>
        <div className="flex justify-center space-x-4">
          <div className="bg-blue-200 p-6 rounded-md text-center flex-1">
            <p className="mb-4">Probar</p>
            <button className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-300 transition-colors">
              Probar
            </button>
          </div>
        </div>
      </section>

      {/* Footer Component */}
      {/* <Footer /> */}
    </div>
  );
};
