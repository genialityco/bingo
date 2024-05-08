import { apiBingo } from "./index";

const bingoService = {
  // Crear un nuevo juego de bingo
  createBingo: async (bingoData) => {
    try {
      const response = await apiBingo.post("/", bingoData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener los detalles de un juego de bingo por su ID
  getBingoById: async (bingoId) => {
    try {
      const response = await apiBingo.get(`/${bingoId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un juego de bingo
  updateBingo: async (bingoId, updateData) => {
    try {
      const response = await apiBingo.put(`/${bingoId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un juego de bingo
  deleteBingo: async (bingoId) => {
    try {
      const response = await apiBingo.delete(`/${bingoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar todos los juegos de bingo
  listAllBingos: async () => {
    try {
      const response = await apiBingo.get("/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bingoService;
