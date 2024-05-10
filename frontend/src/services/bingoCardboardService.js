import { apiBingoCardboard } from "./index";

const bingoCardboardService = {
  // Crear un nuevo cartón
  createCardboard: async (cardBoardData) => {
    try {
      const response = await apiBingoCardboard.post("/", cardBoardData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtener los detalles de un cartón por su ID
  getCardboardById: async (id) => {
    try {
      const response = await apiBingoCardboard.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar un cartón por un campo específico
  findCardboardByField: async (field, value) => {
    try {
      const response = await apiBingoCardboard.get(
        `/search?field=${encodeURIComponent(field)}&value=${encodeURIComponent(
          value
        )}`
      );

      return response.data;
    } catch (error) {
      return error;
    }
  },

  // Obtener todas los cartones de bingo
  getAllCardboards: async () => {
    try {
      const response = await apiBingoCardboard.get("/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar los detalles de un cartón
  updateCardboard: async (cardboardId, updateData) => {
    try {
      const response = await apiBingoCardboard.put(
        `/${cardboardId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una sala de bingo
  deleteCardboard: async (id) => {
    try {
      const response = await apiBingoCardboard.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default bingoCardboardService;
