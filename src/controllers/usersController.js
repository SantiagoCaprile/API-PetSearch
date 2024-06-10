// controllers/usersController.js
import User from "../models/user.js";
import Rescuer from "../models/rescuer.js";
import { generateToken } from "../utils/auth.js";

// Controlador para crear un nuevo usuario
export async function createUser(req, res) {
	try {
		const { email, name, password, role } = req.body;

		// Verificar si el usuario ya existe en la base de datos
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "El usuario ya existe" });
		}

		const newUser = new User({
			email,
			name,
			password,
			role,
		});

		// Guardar el usuario en la base de datos
		const createdUser = await newUser.save()

		//Si es de tipo RESCUER se crea aparte en la base de datos para vincularlo a esta cuenta.
		if (createdUser.role === "rescuer") {
			await Rescuer.create({
				user: createdUser._id
			})
		}

		res.status(201).json({ message: "Usuario creado exitosamente" });
	} catch (error) {
		console.error("Error al crear el usuario", error);
		res.status(500).json({ message: "Error al crear el usuario" });
	}
}

// Controlador para obtener la lista de usuarios
export async function getUsers(req, res) {
	try {
		const users = await User.find({}, "-password");
		res.status(200).json(users);
	} catch (error) {
		console.error("Error al obtener los usuarios", error);
		res.status(500).json({ message: "Error al obtener los usuarios" });
	}
}

// Controlador para verificar las credenciales de un usuario
export async function verifyCredentials(req, res) {
	try {
		const { email, password } = req.body;

		// Verificar si el usuario existe en la base de datos
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(401).json({ message: "Usuario no existe" });
		}

		// Verificar si la contraseña es correcta
		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Credenciales inválidas" });
		}
		// Credenciales válidas

		// Generar un token de autenticación
		const token = generateToken(user);
		res.status(200).json({
			message: "Credenciales válidas",
			user: user.name,
			role: user.role,
			id: user._id,
			token,
		});
	} catch (error) {
		console.error("Error al verificar las credenciales", error);
		res.status(500).json({ message: "Error al verificar las credenciales" });
	}
}

// Controlador para obtener la informacion del usuario y ver su perfil
export async function getUserById(req, res) {
	const { id } = req.params;
	const user = await User.findById(id, "-password")
		.then((user) => {
			if (user) {
				res.status(200).json(user);
			}
		})
		.catch((error) => {
			//handle error when id is invalid or user does not exist
			if (error.name === "CastError") {
				return res.status(500).json({ message: "ID de usuario inválido" });
			}
			if (error.name === "DocumentNotFoundError") {
				return res.status(404).json({ message: "Usuario no encontrado" });
			}
			res.status(500).json({ message: "Error al obtener el usuario" });
		});
}