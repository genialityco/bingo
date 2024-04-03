import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const goToRoom = () => {
    navigate("/room-game");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Banner Section */}
      <section className="flex flex-col justify-end items-center min-h-[340px] bg-[url('https://i.ibb.co/3vMvMkM/DALL-E-2024-04-02-18-56-52-Create-an-engaging-background-image-suitable-for-a-bingo-banner-section-T.webp')] bg-no-repeat bg-cover p-8">
        <button
          className="bg-blue-500 rounded-full text-white py-3 px-6 hover:bg-blue-400 transition duration-300 ease-in-out shadow-lg hover:shadow-xl animate-pulse-infinite"
          onClick={goToRoom}
        >
          Entrar a la sala
        </button>
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
