// routes/users.js
import { Router } from "express";
const router = Router();
import {
	createUser,
	getUsers,
	verifyCredentials,
	getUserById,
} from "../controllers/usersController.js";
import { validateApiKey } from "../middlewares/apiKeyMiddleware.js";

// Ruta para crear un nuevo usuario
router.post("/users", createUser);

// Ruta para obtener la lista de usuarios
router.get("/users", getUsers);

// Ruta para verificar las credenciales de un usuario
router.post("/users/verify", validateApiKey, verifyCredentials);

// Ruta para obtener la informacion del usuario y ver su perfil
router.get("/users/:id", getUserById);

export default router;
