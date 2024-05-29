import { Schema, model } from "mongoose";

const adoptionSchema = new Schema(
	{
		pet: { type: Schema.Types.ObjectId, ref: "Pet" },
		user: { type: Schema.Types.ObjectId, ref: "User" },
		rescuer: { type: Schema.Types.ObjectId, ref: "Rescuer" },
		responsable: { type: Boolean, required: true },
		incomeMoney: { type: Boolean, required: true },
		homeType: { type: String, required: true },
		allowed: { type: Boolean, required: true },
		alergies: { type: Boolean, required: true },
		hadPets: { type: String, required: true },
		areSterilized: { type: Boolean },
		tellMoreAboutPets: { type: String, maxlength: 700 },
		inWorstCase: { type: String, required: true },
		whyAdopt: { type: String, required: true, maxlength: 700 },
		result: {
			type: String,
			enum: ["pending", "on review", "approved", "denied", "cancelled"],
			default: "pending",
		},
	},
	{
		timestamps: true,
	}
);

const Adoption = model("Adoption", adoptionSchema);

export default Adoption;
