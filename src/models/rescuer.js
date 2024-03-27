import { Schema, model } from "mongoose";

const rescuerSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		contactEmail: {
			type: String,
			unique: true,
		},
		contactPhone: {
			type: String,
		},
		socialMediasLinks: {
			type: [String],
		},
		address: {
			type: String,
		},
		biography: {
			type: String,
		},
		pets: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: "Pets",
				},
			],
		},
	},
	{
		timestamps: true,
	}
);

const Rescuer = model("Rescuer", rescuerSchema);

export default Rescuer;
