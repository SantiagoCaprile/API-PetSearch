const express = require("express");
const router = express.Router();
const petController = require("../controllers/petController");

// Ruta para crear una nueva mascota
router.post("/pets", petController.createPet);

// Ruta para obtener la lista de mascotas
router.get("/pets", petController.getAllPets);

// Ruta para obtener todas las mascotas por especie
router.get("/pets/:species", petController.getPetsBySpecies);

// Ruta para obtener 10 mascotas aleatorias
router.get("/random-pets", petController.getRandomAnimals);

module.exports = router;
