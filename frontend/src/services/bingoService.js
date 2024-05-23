import { apiBingo } from "./index";

const bingoServices = {
  // Crear un nuevo bingo
  createBingo: async (data) => {
    try {
      const response = await apiBingo.post("/", data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener los detalles de un bingo por su ID
  getBingoById: async (id) => {
    try {
      const response = await apiBingo.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar un bingo por un campo específico
  findBingoByField: async (field, value) => {
    try {
      const response = await apiBingo.get(
        `/search?field=${encodeURIComponent(field)}&value=${encodeURIComponent(
          value
        )}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Añadir una balota al historial de un bingo
  addBallotToHistory: async (id, ballot) => {
    try {
      const response = await apiBingo.put(`/${id}/ballots`, {
        ballot,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Marcar el fin del juego en un bingo
  markGameEnd: async (id, winners) => {
    try {
      const response = await apiBingo.post(`/${id}/end`, {
        winners,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar la capacidad de un bingo
  updateBingoCapacity: async (id, capacity) => {
    try {
      const response = await apiBingo.put(`/${id}/capacity`, {
        capacity,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener todas los bingo
  getAllBingos: async () => {
    try {
      const response = await apiBingo.get("/");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar los detalles de un bingo
  updateBingo: async (id, updateData) => {
    try {
      const response = await apiBingo.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un bingo
  deleteBingo: async (id) => {
    try {
      const response = await apiBingo.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sangBingo: async (markedSquares, id, userId, cardboardCode) => {
    try {
      const response = await apiBingo.post(`/sangBingo`, {
        markedSquares,
        id,
        userId,
        cardboardCode,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bingoServices;
