import express from "express";
import BingoCardoardController from "../controllers/bingoCardboardController.js";

const router = express.Router();

// Ruta para crear un nuevo cartón
router.post("/cardboard", BingoCardoardController.createCardboard);

// Ruta para obtener un cartón por cualquier campo
router.get("/cardboard/search", BingoCardoardController.findCardboardByField);

// Ruta para obtener un cartón específico por su ID
router.get("/cardboard/:id", BingoCardoardController.getCardboard);

// Ruta para obtener todos los cartones
router.get("/cardboard", BingoCardoardController.getAllCardboards);

// Ruta para actualizar un cartón existente por su ID
router.put("/cardboard/:id", BingoCardoardController.updateCardboard);

// Ruta para eliminar un cartón por su ID
router.delete("/cardboard/:id", BingoCardoardController.deleteCardboard);

export default router;
