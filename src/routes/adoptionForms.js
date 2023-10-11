const express = require("express");
const router = express.Router();
const adoptionFormController = require("../controllers/adoptionController");

// Ruta para crear un nuevo formulario de adopción
router.post("/adoption-forms", adoptionFormController.createAdoptionForm);

// Ruta para obtener la lista de formularios de adopción del usuario
router.get(
  "/adoption-forms-user/:id",
  adoptionFormController.getAllAdoptionByUser
);

// Ruta para obtener la lista de formularios de adopción del rescatista
router.get("/adoption-forms", adoptionFormController.getAllAdoptionByRescuer);

// Ruta para obtener un formulario de adopción por id
router.get("/adoption-forms/:id", adoptionFormController.getAdoptionFormById);

// Ruta para dar resultado a un formulario de adopción -> aprobar o rechazar
router.put("/adoption-forms/:id", adoptionFormController.reviewAdoptionForm);

module.exports = router;
