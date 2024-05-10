import express from "express";
import BingoTemplateController from "../controllers/bingoTemplateController.js";

const router = express.Router();

// Ruta para crear un nuevo bingo
router.post("/bingoTemplate", BingoTemplateController.createBingo);

// Ruta para obtener un bingo por Id
router.get("/bingoTemplate/:id", BingoTemplateController.getBingoById);

// Ruta para actualizar un bingo
router.put("/bingoTemplate/:id", BingoTemplateController.updateBingo);

// Ruta para eliminar un bingo
router.delete("/bingoTemplate/:id", BingoTemplateController.deleteBingo);

// Ruta para obtener todos los bingos
router.get("/bingoTemplate", BingoTemplateController.listAllBingos);

export default router;
