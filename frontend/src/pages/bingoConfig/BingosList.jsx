import { Button, Card, CardBody, CardFooter } from "@material-tailwind/react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import bingoService from "../../services/bingoService";
import bingoRoomService from "../../services/bingoRoomService";

const BingosList = () => {
  const [bingos, setBingos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState([]);

  const fetchBingos = useCallback(async () => {
    try {
      const { data } = await bingoService.listAllBingos();
      setBingos(data);
    } catch (err) {
      setError("Error al obtener la lista de bingos");
    } finally {
      setLoading(false);
    }
    const handleDeleteBingo = async (bingoId) => {
      try {
        await bingoService.deleteBingo(bingoId);

        setBingos((prevBingos) =>
          prevBingos.filter((bingo) => bingo._id !== bingoId)
        );
      } catch (error) {
        console.error("Error al eliminar el bingo:", error);
      }
    };
  }, []);

  useEffect(() => {
    const getBingos = async () => {
      const response = await bingoService.listAllBingos();
      setBingos(response.data);
    };
    getBingos();
  }, []);

  useEffect(() => {
    fetchBingos();
  }, [fetchBingos]);

  const openModal = async (bingoId) => {
    try {
      const response = await bingoRoomService.findRoomByField(
        "bingoId",
        bingoId
      );

      let data = Array.isArray(response.data) ? response.data : [response.data];

      // Si no hay salas, crea una sala por defecto
      if (!data.length || !data[0]._id) {
        const newRoomData = {
          title: `Sala por defecto`,
          bingoId: bingoId,
          capacity: 100,
          roomCode: `ROOM${Math.random().toString(36).substring(2, 8)}`,
        };
        const newRoom = await bingoRoomService.createRoom(newRoomData);
        data = [newRoom.data];
      }

      setRooms(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin w-12 h-12 text-green-500"
          viewBox="0 0 64 64"
        >
          {/* Aquí puedes usar un ícono de cargando */}
        </svg>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center mt-8">{error}</div>;
  }

  return (
    <>
      <div className="w-11/12 m-auto my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bingos.length ? (
          bingos.map((bingo) => (
            <Card
              key={bingo._id}
              className="bg-blue-gray-100 flex flex-col justify-between h-full"
            >
              <CardBody className="flex-grow">
                <h3 className="text-xl font-bold">{bingo.title}</h3>
                <p>{bingo.dimensions}</p>
              </CardBody>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Link to={`/bingo-config?id=${bingo._id}`} className="w-1/2">
                    <Button className="w-full">Configurar Bingo</Button>
                  </Link>
                  <Button
                    className="w-1/2"
                    onClick={() => openModal(bingo._id)}
                  >
                    Jugar
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center text-lg text-gray-500">
            No se encontraron bingos.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Salas disponibles</h3>
            <ul>
              {rooms.length > 0 ? (
                rooms.map((room) => {
                  return (
                    <li
                      key={room._id}
                      className="flex justify-between items-center mb-4"
                    >
                      <span>{room.title || room.name}</span>
                      <Link to={`/play-bingo/${room._id}`}>
                        <Button>Ir a la sala</Button>
                      </Link>
                    </li>
                  );
                })
              ) : (
                <div>No hay salas disponibles.</div>
              )}
            </ul>

            <Button className="mt-4" onClick={closeModal}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BingosList;
