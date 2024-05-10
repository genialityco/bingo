import express from "express";
import BingoFigureController from "../controllers/bingoFigureController";

const router = express.Router();

// Ruta para crear un nuevo template
router.post("/figure", BingoFigureController.createTemplate);

// Ruta para obtener un template específico por su ID
router.get("/figure/:id", BingoFigureController.getTemplate);

// Ruta para obtener todos los templates
router.get("/figure", BingoFigureController.getAllTemplates);

// Ruta para actualizar un template existente por su ID
router.put("/figure/:id", BingoFigureController.updateTemplate);

// Ruta para eliminar un template por su ID
router.delete("/figure/:id", BingoFigureController.deleteTemplate);

export default router;
