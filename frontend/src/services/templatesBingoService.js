import { apiBingoFigures } from "./index";

const templatesBingoService = {
  // Método para crear un nuevo template
  createTemplate: async (templateData) => {
    try {
      const response = await apiBingoFigures.post("/", templateData);
      return response.data;
    } catch (error) {
      // Manejo de error adecuado
      console.error("Error creating template:", error);
      throw error;
    }
  },

  // Método para obtener un template por su ID
  getTemplateById: async (id) => {
    try {
      const response = await apiBingoFigures.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error getting template:", error);
      throw error;
    }
  },

  // Método para obtener todos los templates
  getAllTemplates: async () => {
    try {
      const response = await apiBingoFigures.get("/");
      return response.data.data;
    } catch (error) {
      console.error("Error getting all templates:", error);
      throw error;
    }
  },

  // Método para actualizar un template
  updateTemplate: async (id, updateData) => {
    try {
      const response = await apiBingoFigures.put(`/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("Error updating template:", error);
      throw error;
    }
  },

  // Método para eliminar un template
  deleteTemplate: async (id) => {
    try {
      const response = await apiBingoFigures.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
  },
};

export default templatesBingoService;
