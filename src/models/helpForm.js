import { Schema, model } from "mongoose";

const helpFormSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        type: { type: String, required: true, enum: ["lost", "found"] },
        date: { type: Date, required: true },
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            city: { type: String, required: true },
        },
        description: { type: String, required: true, maxlength: 500 },
        image: { type: String },
        status: {
            type: String,
            enum: ["pending", "in progress", "resolved"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const HelpForm = model("HelpForm", helpFormSchema);

export default HelpForm;