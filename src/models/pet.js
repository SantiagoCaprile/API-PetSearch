const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  species: {
    type: String,
    required: true,
    enum: ["dog", "cat", "other"],
  },
  breed: {
    type: String,
    required: true,
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
  photos: [String],
  status: {
    type: String,
    enum: ["available", "adopted", "inProgress"],
    default: "available",
  },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  characteristics: [
    {
      key: String,
      value: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
  ],
});

const Pet = mongoose.model("Pet", petSchema);

module.exports = Pet;
