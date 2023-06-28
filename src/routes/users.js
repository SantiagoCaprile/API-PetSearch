// routes/users.js
const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Ruta para crear un nuevo usuario
router.post("/users", usersController.createUser);

// Ruta para obtener la lista de usuarios
router.get("/users", usersController.getUsers);

// Ruta para verificar las credenciales de un usuario
router.post("/users/verify", usersController.verifyCredentials);

module.exports = router;
