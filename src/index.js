import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import morgan from "morgan";
import breedsRouter from "../src/routes/breeds.js";
import usersRouter from "./routes/users.js";
import petsRouter from "./routes/pets.js";
import adoptionRouter from "./routes/adoptionForms.js";
import rescuersRouter from "./routes/rescuers.js";
import chatsRouter from "./routes/chats.js";
import helpRouter from "./routes/helpForm.js";
import { createServer } from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";

const app = express();
const port = 4000;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Conectar a la base de datos de MongoDB
connect(process.env.DB_CONNECTION_STRING, {
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
// app.listen(port, () => {
//   console.log(`Servidor iniciado en http://localhost:${port}`);
// });

// Middleware para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para analizar el cuerpo de las solicitudes
app.use(json());

// Middleware para registrar las solicitudes que llegan al servidor
app.use(morgan("dev"));

// Socket.io para chats en tiempo real. Se crea un websocket en el servidor
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
	pingTimeout: 60000,
});
import { Message, Chat } from "./models/chat.js";
io.on("connection", (socket) => {
	socket.on("join", async ({ chatId }) => {
		socket.join(chatId);
		// i should send all the messages in the chat

		await Chat.findById(chatId)
			.populate("messages")
			.then((chat) => {
				if (chat) socket.emit("allMessages", chat.messages);
			});
	});

	socket.on("message", async (data) => {
		// data = { chatId, body, time, user }
		// -> CAMBIAR CUANDO ENTREMOS A LA SOLICITUD, VAS A TENER QUE AGREGARLO A LA DATA QUE RESCATE EL chatId DEL FORMULARIO
		// -> falta agregar todo lo de los USERS CUANDO HAYA AUTH
		try {
			// Encuentra el chat o créalo si no existe aún
			let chat = await Chat.findById(data.chatId)

			if (!chat) {
				// Si no existe el chat, créalo
				// const newChat = new Chat({
				// 	messages: [],
				// });
				// chat = await newChat.save();
				throw new Error("Chat no encontrado");
			}

			// Crea un nuevo mensaje y guárdalo en el chat
			const newMessage = new Message({
				body: data.body,
				time: data.time,
				username: data.user ?? "Anónimo",
			});

			chat.messages.push(newMessage);
			await chat.save();

			// Emit the message to all sockets except the one that sent the message
			socket.broadcast.to(chat._id.toString()).emit("message", newMessage);
		} catch (error) {
			console.error("Error al guardar el mensaje:", error);
		}
	});

	socket.on("disconnect", () => {
		console.log("user disconnected");
		socket.leaveAll();
		console.log("user disconnected from all rooms");
	});
});

server.listen(port, () => {
	console.log("Socket.io server listening on:" + port);
});

// Rutas
app.use(usersRouter);
app.use(breedsRouter);
app.use(petsRouter);
app.use(adoptionRouter);
app.use(rescuersRouter);
app.use(chatsRouter);
app.use(helpRouter);
