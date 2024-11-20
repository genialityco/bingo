import express from "express";
import BingoController from "../controllers/bingoController";


const router = express.Router();

// Ruta para crear una nueva sala de bingo
router.post("/bingos", BingoController.createBingo);

// Ruta para obtener una sala por cualquier campo
router.get("/bingos/search", BingoController.findBingoByField);

// Ruta para obtener una sala de bingo por su ID
router.get("/bingos/:id", BingoController.getBingoById);

// Ruta para añadir una balota al historial de una sala específica
router.put("/bingos/:id/ballots", BingoController.addBallotToHistory);

// Ruta para marcar el fin del juego en una sala específica
router.post("/bingos/:id/end", BingoController.markGameEnd);

// Ruta para actualizar la capacidad de una sala específica
router.put("/bingos/:id/capacity", BingoController.updateBingoCapacity);

router.post("/bingos/:id/addBingoValue", BingoController.addBingoValue);


// Ruta para obtener todas las salas de bingo
router.get("/bingos", BingoController.getAllBingos);

// Ruta para actualizar una sala específica
router.put("/bingos/:id", BingoController.updateBingo);

// Ruta para eliminar una sala específica
router.delete("/bingos/:id", BingoController.deleteBingo);

router.post("/bingos/sangBingo", BingoController.sangBingo);

export default router;
