const express = require("express");
const router = express.Router();
const breedController = require("../controllers/breedController");

// Ruta para crear una nueva especie con un arreglo de razas
router.post("/breeds", breedController.createSpecies);

// Ruta para agregar una nueva raza a una especie
router.post("/breeds/:species", breedController.addBreed);

// Ruta para obtener la lista de razas
router.get("/breeds/:species", breedController.getBreedsBySpecies);

module.exports = router;
