import { Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";

const userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin", "rescuer"],
		},
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	try {
		if (this.isModified("password")) {
			this.password = await hash(this.password, 10);
		}
		next();
	} catch (error) {
		next(error);
	}
});

userSchema.methods.comparePassword = async function (password) {
	try {
		if (!this.password) {
			return false;
		}
		return await compare(password, this.password);
	} catch (error) {
		throw new Error(error);
	}
};

export default model("User", userSchema);
