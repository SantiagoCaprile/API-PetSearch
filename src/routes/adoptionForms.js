import { Router } from "express";
const router = Router();
import {
	createAdoptionForm,
	getAllAdoptionByUser,
	getAllAdoptionByRescuer,
	getAdoptionFormById,
	reviewAdoptionForm,
	hasSentAdoptionForm
} from "../controllers/adoptionController.js";

// Ruta para crear un nuevo formulario de adopción
router.post("/adoption-forms", createAdoptionForm);

// Ruta para obtener la lista de formularios de adopción del usuario
router.get("/adoption-forms/user/:id", getAllAdoptionByUser);

// Ruta para obtener la lista de formularios de adopción del rescatista
router.get("/adoption-forms/rescuer/:id", getAllAdoptionByRescuer);

// Ruta para obtener un formulario de adopción por id
router.get("/adoption-forms/:id", getAdoptionFormById);

// Ruta para verificar si un usuario ya tiene un formulario de adopcion con esa mascota
router.get("/adoption-forms/:userId/:petId", hasSentAdoptionForm);

// Ruta para dar resultado a un formulario de adopción -> aprobar o rechazar
//tambien se va a usar en caso que el usuario quiera retirar su solicitud
router.put("/adoption-forms/:id", reviewAdoptionForm);

export default router;
