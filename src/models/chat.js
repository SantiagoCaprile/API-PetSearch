const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  time: { type: Date, default: Date.now, required: true },
  body: { type: String, required: true },
  //user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  username: { type: String, required: true },
});

const chatSchema = new mongoose.Schema({
  adoptionForm: { type: mongoose.Schema.Types.ObjectId, ref: "AdoptionForm" },
  messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { Chat, Message };
