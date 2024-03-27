import { Router } from "express";
const router = Router();
import {
	createRescuer,
	getRescuers,
	getRescuerById,
	updateRescuer,
	addPetToRescuer,
	removePetFromRescuer,
} from "../controllers/rescuerController.js";

// Ruta para crear un nuevo rescatista
router.post("/rescuers", createRescuer);

// Ruta para obtener la lista de rescatistas
router.get("/rescuers", getRescuers);

// Ruta para obtener un rescatista por id
router.get("/rescuers/:id", getRescuerById);

// Ruta para actualizar un rescatista
router.put("/rescuers/:id", updateRescuer);

// Ruta para agregar una mascota a un rescatista
router.post("/rescuers/:id/pets", addPetToRescuer);

// Ruta para eliminar una mascota de un rescatista
router.delete("/rescuers/:id/pets", removePetFromRescuer);

export default router;
