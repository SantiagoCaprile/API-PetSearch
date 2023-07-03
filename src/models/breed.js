const mongoose = require("mongoose");

const breedSchema = new mongoose.Schema({
  species: {
    type: String,
    required: true,
    enum: ["dog", "cat", "other"],
  },
  breeds: [String],
});

const Breed = mongoose.model("Breed", breedSchema);

module.exports = Breed;
