const mongoose = require("mongoose");

const rescuerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
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
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pets",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Rescuer = mongoose.model("Rescuer", rescuerSchema);

module.exports = Rescuer;
