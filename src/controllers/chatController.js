// Import the necessary models
const { Chat, Message } = require("../models/chat");

// Function to send a new message
exports.sendMessage = async (req, res) => {
  try {
    // Get the chat ID, user ID, and message text from the request body
    const { text } = req.body;

    console.log(chat);
    const chat = await Chat.create({
      messages: [new Message({ body: text })],
    });

    // Send a success response
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    // Send an error response
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Function to get all messages of a chat
exports.getMessages = async (req, res) => {
  try {
    // Get the chat ID from the request parameters
    const { chatId } = req.params;

    // Find the chat and populate its messages array with the message documents
    const chat = await Chat.findById(chatId).populate("messages");

    // Send the chat's messages array as the response
    res.status(200).json({ messages: chat ? chat.messages : [] });
  } catch (error) {
    // Send an error response
    res.status(500).json({ error: "Failed to get messages" });
  }
};
