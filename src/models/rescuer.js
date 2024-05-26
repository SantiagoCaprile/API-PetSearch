import { Schema, model } from "mongoose";

const rescuerSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		contactPhone: {
			type: String,
		},
		socialMediasLinks: {
			type: [String],
		},
		city: {
			type: String,
		},
		address: {
			type: String,
		},
		bio: {
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
