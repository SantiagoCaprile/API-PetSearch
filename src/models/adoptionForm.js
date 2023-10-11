const mongoose = require("mongoose");

const adoptionSchema = new mongoose.Schema(
  {
    pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rescuer: { type: mongoose.Schema.Types.ObjectId, ref: "Rescuer" },
    responsable: { type: Boolean, required: true },
    incomeMoney: { type: Boolean, required: true },
    homeType: { type: String, required: true },
    allowed: { type: Boolean, required: true },
    alergies: { type: Boolean, required: true },
    hadPets: { type: Boolean, required: true },
    areSterilized: { type: Boolean },
    tellMoreAboutPets: { type: String, maxlength: 700 },
    inWorstCase: { type: String, required: true },
    whyAdopt: { type: String, required: true, maxlength: 700 },
    result: {
      type: String,
      enum: ["pending", "on review", "approved", "denied"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Adoption = mongoose.model("Adoption", adoptionSchema);

module.exports = Adoption;
