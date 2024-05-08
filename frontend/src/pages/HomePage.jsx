import { useNavigate } from "react-router-dom";
import { Input } from "@material-tailwind/react";
import bingoRoomService from "../services/bingoRoomService";

export const HomePage = () => {
  const navigate = useNavigate();

  const getBingoRoom = async (roomCode) => {
    try {
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
    const roomCode = e.target.elements.roomCode.value;
    const bingoRoom = await getBingoRoom(roomCode);
    if (bingoRoom && bingoRoom.data) {
      // Pasando roomCode como parte de la URL y otros detalles a través de state
      navigate(`/room-game/${roomCode}`, {
        state: { roomId: bingoRoom.data._id, bingoId: bingoRoom.data.bingoId },
      });
    } else {
      alert("Sala no encontrada. Por favor, verifica el código.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <section className="flex flex-col justify-end items-center min-h-[340px] bg-[url('https://i.ibb.co/3vMvMkM/DALL-E-2024-04-02-18-56-52-Create-an-engaging-background-image-suitable-for-a-bingo-banner-section-T.webp')] bg-no-repeat bg-cover p-8">
        <div className="w-72 bg-black p-5 rounded-lg shadow-2xl" align="center">
          <form onSubmit={goToRoom}>
            <Input
              name="roomCode"
              type="text"
              color="white"
              label="Ingrese código de sala"
            />
            <button className="bg-blue-500 rounded-full text-white mt-3 py-2 px-4 hover:bg-blue-400 transition duration-300 ease-in-out shadow-lg hover:shadow-xl animate-pulse-infinite">
              Entrar a la sala
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
