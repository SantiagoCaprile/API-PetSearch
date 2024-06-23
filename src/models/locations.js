import { Schema, model } from "mongoose";

const provinceSchema = new Schema({
    code: { type: Number, required: true },
    name: { type: String, required: true },
    active: { type: Boolean, required: true, default: false },
});

const locationsSchema = new Schema({
    admin: { type: String, required: true },
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    active: { type: Boolean, required: true, default: false },
});

export const Province = model("Province", provinceSchema);
export const Location = model("Location", locationsSchema);