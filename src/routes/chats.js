const express = require("express");
const router = express.Router();
const { sendMessage, getMessages } = require("../controllers/chatController");

// Route to send a message
//router.post("/chats", sendMessage);

// Route to get all messages
//router.get("/chats", getMessages);

module.exports = router;
