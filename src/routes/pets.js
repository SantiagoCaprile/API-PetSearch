import { Router } from "express";
const router = Router();
import {
	createPet,
	getAllPets,
	getRandomAnimals,
	getRescuerPets,
	getPetById,
} from "../controllers/petController.js";
import { authorizeRole } from "../middlewares/roleAuthMiddleware.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import { validateApiKey } from "../middlewares/apiKeyMiddleware.js";

// Ruta para crear una nueva mascota
router.post("/pets", authorizeRole("admin", "rescuer"), authenticateToken, createPet);

// Ruta para obtener la lista de mascotas
router.get("/pets", validateApiKey, getAllPets);

// Ruta para obtener las mascotas de un rescatista
router.get("/pets/rescuer/:rescuerId", validateApiKey, getRescuerPets);

// Ruta para obtener 4 mascotas aleatorias
router.get("/pets/random", validateApiKey, getRandomAnimals);

// Ruta para obtener una mascota por id
router.get("/pets/:petId", validateApiKey, getPetById);

export default router;
