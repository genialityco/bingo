import { apiBingoRoom } from "./index";

const bingoRoomService = {
  // Crear una nueva sala de bingo
  createRoom: async (roomData) => {
    try {
      const response = await apiBingoRoom.post("/", roomData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener los detalles de una sala por su ID
  getRoomById: async (roomId) => {
    try {
      const response = await apiBingoRoom.get(`/${roomId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Añadir una balota al historial de una sala
  addBallotToHistory: async (roomId, ballot) => {
    try {
      const response = await apiBingoRoom.put(`/${roomId}/ballots`, {
        ballot,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Marcar el fin del juego en una sala
  markGameEnd: async (roomId, winners) => {
    try {
      const response = await apiBingoRoom.post(`/${roomId}/end`, {
        winners,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar la capacidad de una sala
  updateRoomCapacity: async (roomId, capacity) => {
    try {
      const response = await apiBingoRoom.put(`/${roomId}/capacity`, {
        capacity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las salas de bingo
  getAllRooms: async () => {
    try {
      const response = await apiBingoRoom.get("/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar los detalles de una sala
  updateRoom: async (roomId, updateData) => {
    try {
      const response = await apiBingoRoom.put(`/${roomId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una sala de bingo
  deleteRoom: async (roomId) => {
    try {
      const response = await apiBingoRoom.delete(`/${roomId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sangBingo: async (markedSquares, roomId) => {
    try {
      const response = await apiBingoRoom.post(`/sangBingo`, {
        markedSquares,
        roomId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bingoRoomService;
