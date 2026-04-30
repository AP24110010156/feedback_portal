const mongoose = require("mongoose");

const AddItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Item description is required"],
    },
    price: {
      type: Number,
      required: [true, "Item price is required"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddItem", AddItemSchema);
