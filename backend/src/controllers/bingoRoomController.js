import BingoRoomServices from "../services/bingoRoom.service";
import sendResponse from "../utils/sendResponse";

class BingoRoomController {
  // POST /rooms - Crear una nueva sala
  async createRoom(req, res) {
    try {
      const room = await BingoRoomServices.createRoom(req.body);
      sendResponse(res, 201, room, "Room created successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /rooms/:id - Obtener una sala por ID
  async getRoomById(req, res) {
    try {
      const room = await BingoRoomServices.getRoomById(req.params.id);
      if (!room) {
        return sendResponse(res, 404, null, "Room not found");
      }
      sendResponse(res, 200, room, "Room retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /rooms/:id/ballots - Añadir balota al historial
  async addBallotToHistory(req, res) {
    try {
      const room = await BingoRoomServices.addBallotToHistory(
        req.params.id,
        req.body.ballot
      );
      sendResponse(res, 200, room, "Ballot added to room history successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // POST /rooms/:id/end - Marcar el fin del juego
  async markGameEnd(req, res) {
    try {
      const room = await BingoRoomServices.markGameEnd(
        req.params.id,
        req.body.winners
      );
      sendResponse(res, 200, room, "Game ended successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /rooms/:id/capacity - Actualizar la capacidad de la sala
  async updateRoomCapacity(req, res) {
    try {
      const room = await BingoRoomServices.updateRoomCapacity(
        req.params.id,
        req.body.capacity
      );
      sendResponse(res, 200, room, "Room capacity updated successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // GET /rooms - Listar todas las salas
  async getAllRooms(req, res) {
    try {
      const rooms = await BingoRoomServices.getAllBingos();
      sendResponse(res, 200, rooms, "Rooms retrieved successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // PUT /rooms/:id - Actualizar una sala
  async updateRoom(req, res) {
    try {
      const room = await BingoRoomServices.updateRoom(req.params.id, req.body);
      sendResponse(res, 200, room, "Room updated successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }

  // DELETE /rooms/:id - Eliminar una sala
  async deleteRoom(req, res) {
    try {
      const result = await BingoRoomServices.deleteRoom(req.params.id);
      sendResponse(res, 200, result, "Room deleted successfully");
    } catch (error) {
      sendResponse(res, 500, null, error.message);
    }
  }
}

export default new BingoRoomController();
