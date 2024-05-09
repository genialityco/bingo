import { apiBingoFigures } from "./index";

const bingoFigureServices = {
  // Método para crear una nueva figura
  createFigure: async (data) => {
    try {
      const response = await apiBingoFigures.post("/", data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating figure:", error);
      throw error;
    }
  },

  // Método para obtener una figura por su ID
  getFigureById: async (id) => {
    try {
      const response = await apiBingoFigures.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error getting figure:", error);
      throw error;
    }
  },

  // Método para obtener todas las figuras
  getAllFigures: async () => {
    try {
      const response = await apiBingoFigures.get("/");
      return response.data.data;
    } catch (error) {
      console.error("Error getting all figures:", error);
      throw error;
    }
  },

  // Método para actualizar una figura
  updateFigure: async (id, updateData) => {
    try {
      const response = await apiBingoFigures.put(`/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      console.error("Error updating figure:", error);
      throw error;
    }
  },

  // Método para eliminar una figura
  deleteFigure: async (id) => {
    try {
      const response = await apiBingoFigures.delete(`/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error deleting figure:", error);
      throw error;
    }
  },
};

export default bingoFigureServices;
