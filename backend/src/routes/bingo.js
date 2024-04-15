import express from "express";
import BingoController from "../controllers/bingoController.js";

const router = express.Router();

// Ruta para crear un nuevo bingo
router.post("/bingos", BingoController.createBingo);

// Ruta para obtener un bingo por Id
router.get("/bingos/:id", BingoController.getBingoById);

// Ruta para actualizar un bingo
router.put("/bingos/:id", BingoController.updateBingo);

// Ruta para eliminar un bingo
router.delete("/bingos/:id", BingoController.deleteBingo);

// Ruta para obtener todos los bingos
router.get("/bingos", BingoController.listAllBingos);

export default router;
