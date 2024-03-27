import { Schema, model } from "mongoose";

const breedSchema = new Schema({
	species: {
		type: String,
		required: true,
		enum: ["dog", "cat", "other"],
	},
	breeds: [String],
});

const Breed = model("Breed", breedSchema);

export default Breed;
