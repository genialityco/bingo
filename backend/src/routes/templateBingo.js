import express from "express";
import TemplatesBingoController from "../controllers/templatesBingoController";

const router = express.Router();

// Ruta para crear un nuevo template
router.post("/templates", TemplatesBingoController.createTemplate);

// Ruta para obtener un template específico por su ID
router.get("/templates/:id", TemplatesBingoController.getTemplate);

// Ruta para obtener todos los templates
router.get("/templates", TemplatesBingoController.getAllTemplates);

// Ruta para actualizar un template existente por su ID
router.put("/templates/:id", TemplatesBingoController.updateTemplate);

// Ruta para eliminar un template por su ID
router.delete("/templates/:id", TemplatesBingoController.deleteTemplate);

export default router;
