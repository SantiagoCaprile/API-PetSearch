import { Schema, model } from "mongoose";

const petSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 100,
		},
		specie: {
			type: String,
			required: true,
			enum: ["dog", "cat", "other"],
		},
		breed: {
			type: String,
			default: "mixed",
		},
		age: {
			number: Number,
			unit: {
				type: String,
				enum: ["days", "weeks", "months", "years"],
			},
		},
		description: {
			type: String,
			maxlength: 400,
		},
		images: {
			type: [String],
			validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
		},
		status: {
			type: String,
			enum: ["available", "adopted", "inProgress"],
			default: "available",
		},
		user: { type: Schema.Types.ObjectId, ref: "User" },
		characteristics: [
			{
				key: String,
				value: {
					type: Schema.Types.Mixed,
				},
			},
		],
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Pet = model("Pet", petSchema);

export default Pet;

function arrayLimit(val) {
	return val.length <= 3;
}
