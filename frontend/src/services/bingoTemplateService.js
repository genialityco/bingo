import { apiBingoTemplate } from "./index";

const bingoTemplateServices = {
  // Crear un nuevo juego de bingo
  createBingo: async (bingoData) => {
    try {
      const response = await apiBingoTemplate.post("/", bingoData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener los detalles de un juego de bingo por su ID
  getBingoById: async (bingoId) => {
    try {
      const response = await apiBingoTemplate.get(`/${bingoId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un juego de bingo
  updateBingo: async (bingoId, updateData) => {
    try {
      const response = await apiBingoTemplate.put(`/${bingoId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un juego de bingo
  deleteBingo: async (bingoId) => {
    try {
      const response = await apiBingoTemplate.delete(`/${bingoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar todos los juegos de bingo
  listAllBingos: async () => {
    try {
      const response = await apiBingoTemplate.get("/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bingoTemplateServices;
