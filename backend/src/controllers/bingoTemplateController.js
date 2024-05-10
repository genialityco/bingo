import BingoTemplateServices from '../services/bingoTemplate.service';
import sendResponse from '../utils/sendResponse';

class BingoController {
  // POST /bingos - Crear un nuevo juego de bingo
  async createBingo(req, res) {
    try {
      const bingo = await BingoTemplateServices.createBingo(req.body);
      sendResponse(res, 201, bingo, 'Template created successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /bingos/:id - Obtener un juego de bingo por ID
  async getBingoById(req, res) {
    try {
      const bingo = await BingoTemplateServices.getBingoById(req.params.id);
      if (!bingo) {
        return sendResponse(res, 404, null, 'Template not found');
      }
      sendResponse(res, 200, bingo, 'Template retrieved successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /bingos/:id - Actualizar un juego de bingo
  async updateBingo(req, res) {
    try {
      const bingo = await BingoTemplateServices.updateBingo(req.params.id, req.body);
      if (!bingo) {
        return sendResponse(res, 404, null, 'Template not found');
      }
      sendResponse(res, 200, bingo, 'Template updated successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // DELETE /bingos/:id - Eliminar un juego de bingo
  async deleteBingo(req, res) {
    try {
      const result = await BingoTemplateServices.deleteBingo(req.params.id);
      if (!result) {
        return sendResponse(res, 404, null, 'Template not found');
      }
      sendResponse(res, 200, result, 'Template deleted successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /bingos - Listar todos los juegos de bingo
  async listAllBingos(req, res) {
    try {
      const bingos = await BingoTemplateServices.listAllBingos();
      sendResponse(res, 200, bingos, 'All templates retrieved successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }
}

export default new BingoController();
