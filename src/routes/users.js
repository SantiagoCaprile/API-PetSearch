// routes/users.js
import { Router } from "express";
const router = Router();
import {
	createUser,
	getUsers,
	verifyCredentials,
} from "../controllers/usersController.js";

// Ruta para crear un nuevo usuario
router.post("/users", createUser);

// Ruta para obtener la lista de usuarios
router.get("/users", getUsers);

// Ruta para verificar las credenciales de un usuario
router.post("/users/verify", verifyCredentials);

export default router;
