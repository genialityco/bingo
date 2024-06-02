import { apiBingo } from "./index";

const bingoServices = {
  // Crear un nuevo bingo

  createBingo: async (data, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingo.post("/", data);
      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  },

  // Obtener los detalles de un bingo por su ID
  getBingoById: async (id, showLoading, hideLoading) => {
    if (showLoading) {
      showLoading();
    }
    try {
      const response = await apiBingo.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
      if (hideLoading) {
        hideLoading();
      }
    }
  },

  // Buscar un bingo por un campo específico
  findBingoByField: async (field, value, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingo.get(
        `/search?field=${encodeURIComponent(field)}&value=${encodeURIComponent(
          value
        )}`
      );

      return response.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
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
  markGameEnd: async (id, winners, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingo.post(`/${id}/end`, {
        winners,
      });
      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  },

  // Actualizar la capacidad de un bingo
  updateBingoCapacity: async (id, capacity, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingo.put(`/${id}/capacity`, {
        capacity,
      });
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  },

  // Obtener todas los bingo
  getAllBingos: async (showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingo.get("/");
      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  },

  // Actualizar los detalles de un bingo
  updateBingo: async (id, updateData, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingo.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
    }
  },

  // Eliminar un bingo
  deleteBingo: async (id, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingo.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading();
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
