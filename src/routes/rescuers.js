const express = require("express");
const router = express.Router();
const rescuerController = require("../controllers/rescuerController");

// Ruta para crear un nuevo rescatista
router.post("/rescuers", rescuerController.createRescuer);

// Ruta para obtener la lista de rescatistas
router.get("/rescuers", rescuerController.getRescuers);

// Ruta para obtener un rescatista por id
router.get("/rescuers/:id", rescuerController.getRescuerById);

// Ruta para actualizar un rescatista
router.put("/rescuers/:id", rescuerController.updateRescuer);

// Ruta para agregar una mascota a un rescatista
router.post("/rescuers/:id/pets", rescuerController.addPetToRescuer);

// Ruta para eliminar una mascota de un rescatista
router.delete("/rescuers/:id/pets", rescuerController.removePetFromRescuer);

module.exports = router;
