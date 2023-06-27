// controllers/usersController.js
const User = require("../models/user");

// Controlador para crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { email, nombre, password } = req.body;

    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear un nuevo usuario
    const newUser = new User({
      email,
      nombre,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear el usuario", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

// Controlador para obtener la lista de usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};
