import { Router } from "express";
const router = Router();
import {
	createAdoptionForm,
	getAllAdoptionByUser,
	getAllAdoptionByRescuer,
	getAdoptionFormById,
	reviewAdoptionForm,
} from "../controllers/adoptionController.js";

// Ruta para crear un nuevo formulario de adopción
router.post("/adoption-forms", createAdoptionForm);

// Ruta para obtener la lista de formularios de adopción del usuario
router.get("/adoption-forms-user/:id", getAllAdoptionByUser);

// Ruta para obtener la lista de formularios de adopción del rescatista
router.get("/adoption-forms", getAllAdoptionByRescuer);

// Ruta para obtener un formulario de adopción por id
router.get("/adoption-forms/:id", getAdoptionFormById);

// Ruta para dar resultado a un formulario de adopción -> aprobar o rechazar
router.put("/adoption-forms/:id", reviewAdoptionForm);

export default router;