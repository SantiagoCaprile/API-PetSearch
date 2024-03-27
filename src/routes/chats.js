import { Router } from "express";
const router = Router();
import { sendMessage, getMessages } from "../controllers/chatController.js";

// Route to send a message
//router.post("/chats", sendMessage);

// Route to get all messages
//router.get("/chats", getMessages);

export default router;
