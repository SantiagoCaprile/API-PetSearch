const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require("morgan");
const usersRouter = require("./routes/users");
const breedsRouter = require("./routes/breeds");
const petsRouter = require("./routes/pets");
const adoptionRouter = require("./routes/adoptionForms");
const rescuersRouter = require("./routes/rescuers");

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

// Middleware para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());

// Middleware para registrar las solicitudes que llegan al servidor
app.use(morgan("dev"));

// Rutas
app.use(usersRouter);
app.use(breedsRouter);
app.use(petsRouter);
app.use(adoptionRouter);
app.use(rescuersRouter);
