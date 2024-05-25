import { Router } from "express";
const router = Router();
import {
	createPet,
	getAllPets,
	getRandomAnimals,
	getRescuerPets,
	getPetById,
} from "../controllers/petController.js";

// Ruta para crear una nueva mascota
router.post("/pets", createPet);

// Ruta para obtener la lista de mascotas
router.get("/pets", getAllPets);

// Ruta para obtener las mascotas de un rescatista
router.get("/pets/rescuer/:rescuerId", getRescuerPets);

// Ruta para obtener 10 mascotas aleatorias
router.get("/random-pets", getRandomAnimals);

// Ruta para obtener una mascota por id
router.get("/pets/:petId", getPetById);

export default router;
