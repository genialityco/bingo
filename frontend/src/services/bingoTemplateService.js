import { apiBingoTemplate } from "./index";

const bingoTemplateServices = {
  // Crear un nuevo juego de bingo
  createTemplate: async (bingoData) => {
    try {
      const response = await apiBingoTemplate.post("/", bingoData);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener los detalles de un juego de bingo por su ID
  getTemplateById: async (bingoId) => {
    try {
      const response = await apiBingoTemplate.get(`/${bingoId}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar un juego de bingo
  updateTemplate: async (bingoId, updateData) => {
    try {
      const response = await apiBingoTemplate.put(`/${bingoId}`, updateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar un juego de bingo
  deleteTemplate: async (bingoId) => {
    try {
      const response = await apiBingoTemplate.delete(`/${bingoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar todos los juegos de bingo
  listAllTemplates: async () => {
    try {
      const response = await apiBingoTemplate.get("/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bingoTemplateServices;
