import express from "express";
import BingoRoomController from "../controllers/bingoRoomController";

const router = express.Router();

// Ruta para crear una nueva sala de bingo
router.post("/rooms", BingoRoomController.createRoom);

// Ruta para obtener una sala de bingo por su ID
router.get("/rooms/:id", BingoRoomController.getRoomById);

// Ruta para añadir una balota al historial de una sala específica
router.put("/rooms/:id/ballots", BingoRoomController.addBallotToHistory);

// Ruta para marcar el fin del juego en una sala específica
router.post("/rooms/:id/end", BingoRoomController.markGameEnd);

// Ruta para actualizar la capacidad de una sala específica
router.put("/rooms/:id/capacity", BingoRoomController.updateRoomCapacity);

// Ruta para obtener todas las salas de bingo
router.get("/rooms", BingoRoomController.getAllRooms);

// Ruta para actualizar una sala específica
router.put("/rooms/:id", BingoRoomController.updateRoom);

// Ruta para eliminar una sala específica
router.delete("/rooms/:id", BingoRoomController.deleteRoom);

router.post("/rooms/sangBingo", BingoRoomController.sangBingo);

export default router;
