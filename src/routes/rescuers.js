import { Router } from "express";
const router = Router();
import {
	getRescuers,
	getRescuerById,
	updateRescuer,
} from "../controllers/rescuerController.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validateApiKey } from "../middlewares/apiKeyMiddleware.js";
import { getMetrics } from "../controllers/metricsController.js";

// Ruta para crear un nuevo rescatista
// router.post("/rescuers", validateApiKey, createRescuer);

// Ruta para obtener la lista de rescatistas
router.get("/rescuers", validateApiKey, getRescuers);

// Ruta para obtener un rescatista por id
router.get("/rescuers/:id", validateApiKey, getRescuerById);

// Ruta para actualizar un rescatista
router.put("/rescuers/:id", validateApiKey, authenticateToken, updateRescuer);

// Ruta para obtener las métricas
router.get("/rescuers-metrics", validateApiKey, getMetrics);

// Ruta para agregar una mascota a un rescatista
//router.post("/rescuers/:id/pets", validateApiKey, authenticateToken, addPetToRescuer);

// Ruta para eliminar una mascota de un rescatista
//router.delete("/rescuers/:id/pets", validateApiKey, authenticateToken, removePetFromRescuer);

export default router;
