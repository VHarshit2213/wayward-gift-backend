// models/customOption.js

import mongoose from "mongoose";

const CustomOptionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ["theme", "size", "coffee_roast", "addon"], 
    required: true 
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model("CustomOption", CustomOptionSchema);
