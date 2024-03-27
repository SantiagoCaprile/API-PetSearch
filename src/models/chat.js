import { Schema, model } from "mongoose";

const messageSchema = new Schema({
	time: { type: Date, default: Date.now, required: true },
	body: { type: String, required: true },
	//user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	username: { type: String, required: true },
});

const chatSchema = new Schema({
	adoptionForm: { type: Schema.Types.ObjectId, ref: "AdoptionForm" },
	messages: [messageSchema],
});

export const Chat = model("Chat", chatSchema);
export const Message = model("Message", messageSchema);
