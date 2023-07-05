const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const usersRouter = require("./routes/users");
const breedsRouter = require("./routes/breeds");
const petsRouter = require("./routes/pets");

const app = express();
const port = 4000;

// Conectar a la base de datos de MongoDB
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos", error);
  });

// Configurar rutas
app.get("/", (req, res) => {
  res.send("PING!");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Rutas
app.use(usersRouter);
app.use(breedsRouter);
app.use(petsRouter);
