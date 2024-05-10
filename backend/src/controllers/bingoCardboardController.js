import BingoCardboardService from "../services/bingoCardboard.service";
import sendResponse from "../utils/sendResponse";

class BingoFigureController {
  async createCardboard(req, res) {
    try {
      const cardboard = await BingoCardboardService.createCardboard(req.body);
      sendResponse(res, 201, cardboard, "Cardboard created successfully");
    } catch (error) {
      sendResponse(res, 400, null, error.message);
    }
  }

  async getCardboard(req, res) {
    try {
      const cardboard = await BingoCardboardService.getCardboard(req.params.id);
      if (!cardboard) {
        return sendResponse(res, 404, null, "Cardboard not found");
      }
      sendResponse(res, 200, cardboard, "Cardboard retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /rooms/search - Buscar una sala por un campo específico
  async findCardboardByField(req, res) {
    try {
      const { field, value } = req.query;
      if (!field || !value) {
        return sendResponse(
          res,
          400,
          null,
          "Missing field or value in query parameters."
        );
      }
      const cardboard = await BingoCardboardService.findCardboardByField(field, value);
      if (!cardboard) {
        return sendResponse(
          res,
          404,
          null,
          `Cardboard not found with ${field}: ${value}`
        );
      }
      sendResponse(res, 200, cardboard, "Cardboard found successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async getAllCardboards(req, res) {
    try {
      const cardboards = await BingoCardboardService.getAllCardboards();
      sendResponse(res, 200, cardboards, "Cardboards retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async updateCardboard(req, res) {
    try {
      const updatedCardboard = await BingoCardboardService.updateCardboard(
        req.params.id,
        req.body
      );
      if (!updatedCardboard) {
        return sendResponse(res, 404, null, "Cardboard not found");
      }
      sendResponse(
        res,
        200,
        updatedCardboard,
        "Cardboard updated successfully"
      );
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  async deleteCardboard(req, res) {
    try {
      const result = await BingoCardboardService.deleteCardboard(req.params.id);
      if (!result) {
        return sendResponse(res, 404, null, "Cardboard not found");
      }
      sendResponse(res, 204, null, "Cardboard deleted successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }
}

export default new BingoFigureController();
