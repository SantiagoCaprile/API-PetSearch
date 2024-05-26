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
		sex: {
			type: String,
			enum: ["male", "female"],
		},
		size: {
			type: String,
			enum: ["small", "medium", "large"],
		},
		breed: {
			type: String,
			default: "mixed",
		},
		birthDate: {
			type: Date,
			// date should be less than today, but allow todays date
			// max: Date.now(),
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
		rescuer: { type: Schema.Types.ObjectId, ref: "User" },
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

//age ranges can be "baby", "young", "adult", "senior"
//this will return a date range for the age range
//eg. "baby" will return a date range 2021-01-01 to 2021-12-31
petSchema.statics.ageRangeToDateRange = function (ageRange) {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth();
	const day = today.getDate();
	switch (ageRange) {
		case "baby":
			return {
				start: new Date(year - 1, month, day),
				end: new Date(year, month, day),
			};
		case "young":
			return {
				start: new Date(year - 3, month, day),
				end: new Date(year - 1, month, day),
			};
		case "adult":
			return {
				start: new Date(year - 10, month, day),
				end: new Date(year - 3, month, day),
			};
		case "senior":
			return {
				start: new Date(1900, 0, 1),
				end: new Date(year - 10, month, day),
			};
		default:
			return null;
	}
};
const Pet = model("Pet", petSchema);

export default Pet;

function arrayLimit(val) {
	return val.length <= 3;
}
