import { apiBingoCardboard } from "./index";

const bingoCardboardService = {
  // Crear un nuevo cartón
  createCardboard: async (cardBoardData, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingoCardboard.post("/", cardBoardData);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading()
    }
  },

  // Obtener los detalles de un cartón por su ID
  getCardboardById: async (id, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingoCardboard.get(`/${id}`);
      return response.data.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading()
    }
  },

  // Buscar un cartón por un campo específico
  findCardboardsByFields: async (params, showLoading, hideLoading) => {
    showLoading();
    try {
      // Construir la cadena de consulta a partir de los parámetros
      const queryString = Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&");

      const response = await apiBingoCardboard.get(`/search?${queryString}`);
      return response.data;
    } catch (error) {
      return error;
    } finally {
      hideLoading()
    }
  },

  // Obtener todas los cartones de bingo
  getAllCardboards: async (showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingoCardboard.get("/");
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading()
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
  deleteCardboard: async (id, showLoading, hideLoading) => {
    showLoading();
    try {
      const response = await apiBingoCardboard.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    } finally {
      hideLoading()
    }
  },
};

export default bingoCardboardService;
