// controllers/usersController.js
import User from "../models/user.js";

// Controlador para crear un nuevo usuario
export async function createUser(req, res) {
	try {
		const { email, name, password, role } = req.body;

		// Verificar si el usuario ya existe en la base de datos
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "El usuario ya existe" });
		}

		// Crear el nuevo usuario
		const newUser = new User({
			email,
			name,
			password,
			role,
		});

		// Guardar el usuario en la base de datos
		await newUser.save();

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
		console.log("user:", user);
		res.status(200).json({
			message: "Credenciales válidas",
			user: user.name,
			role: user.role,
			id: user._id,
		});
	} catch (error) {
		console.error("Error al verificar las credenciales", error);
		res.status(500).json({ message: "Error al verificar las credenciales" });
	}
}
