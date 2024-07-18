import { Schema, model } from "mongoose";

const tagSchema = new Schema(
    {
        name: {
            type: String,
            maxlength: 100,
        },
        specie: {
            type: String,
            enum: ["dog", "cat", "other"],
        },
        sex: {
            type: String,
            enum: ["male", "female"],
        },
        weight: {
            type: Number,
            min: 0,
        },
        breed: {
            type: String,
            default: "mixed",
        },
        birthDate: {
            type: Date,
            // date should be less than tomorrow
            max: Date.now() + 86400000,
        },
        description: {
            type: String,
            maxlength: 400,
        },
        image: {
            type: String,
        },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        location: { type: Schema.Types.ObjectId, ref: "Location" },
        address: {
            type: String,
            maxlength: 100,
        },
        sterilized: {
            type: Boolean,
            default: false,
        },
        // healthHistory: {
        //     type: [{
        //         vaccine: String,
        //         dateApplied: Date,
        //         nextApplication: Date,
        //     }]
        // }
    },
    {
        timestamps: true,
    }
);

export default model("Tag", tagSchema);