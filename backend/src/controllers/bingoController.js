import BingoServices from '../services/bingo.service';
import sendResponse from '../utils/sendResponse';

class BingoController {
  // POST /bingos - Crear un nuevo juego de bingo
  async createBingo(req, res) {
    try {
      const bingo = await BingoServices.createBingo(req.body);
      sendResponse(res, 201, bingo, 'Bingo created successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /bingos/:id - Obtener un juego de bingo por ID
  async getBingoById(req, res) {
    try {
      const bingo = await BingoServices.getBingoById(req.params.id);
      if (!bingo) {
        return sendResponse(res, 404, null, 'Bingo not found');
      }
      sendResponse(res, 200, bingo, 'Bingo retrieved successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /bingos/:id - Actualizar un juego de bingo
  async updateBingo(req, res) {
    try {
      const bingo = await BingoServices.updateBingo(req.params.id, req.body);
      if (!bingo) {
        return sendResponse(res, 404, null, 'Bingo not found');
      }
      sendResponse(res, 200, bingo, 'Bingo updated successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // DELETE /bingos/:id - Eliminar un juego de bingo
  async deleteBingo(req, res) {
    try {
      const result = await BingoServices.deleteBingo(req.params.id);
      if (!result) {
        return sendResponse(res, 404, null, 'Bingo not found');
      }
      sendResponse(res, 200, result, 'Bingo deleted successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /bingos - Listar todos los juegos de bingo
  async listAllBingos(req, res) {
    try {
      const bingos = await BingoServices.listAllBingos();
      sendResponse(res, 200, bingos, 'All bingos retrieved successfully');
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }
}

export default new BingoController();
