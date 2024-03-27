import { Router } from "express";
const router = Router();
import {
	createSpecies,
	addBreed,
	getBreedsBySpecies,
} from "../controllers/breedController.js";

// Ruta para crear una nueva especie con un arreglo de razas
router.post("/breeds", createSpecies);

// Ruta para agregar una nueva raza a una especie
router.post("/breeds/:species", addBreed);

// Ruta para obtener la lista de razas
router.get("/breeds/:species", getBreedsBySpecies);

export default router;
