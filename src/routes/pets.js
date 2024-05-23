import { Router } from "express";
const router = Router();
import {
	createPet,
	getAllPets,
	getPetsBySpecies,
	getRandomAnimals,
	getRescuerPets
} from "../controllers/petController.js";

// Ruta para crear una nueva mascota
router.post("/pets", createPet);

// Ruta para obtener la lista de mascotas
router.get("/pets", getAllPets);

// Ruta para obtener las mascotas de un rescatista
router.get("/pets/rescuer/:rescuerId", getRescuerPets);

// Ruta para obtener todas las mascotas por especie
router.get("/pets/:species", getPetsBySpecies);

// Ruta para obtener 10 mascotas aleatorias
router.get("/random-pets", getRandomAnimals);

export default router;
