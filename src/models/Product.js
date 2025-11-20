// models/product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
   name: { type: String, required: true, maxlength: 255 },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    discount_price: { type: Number, default: 0 },
    sku: { type: String, unique: true, required: true },
    stock_quantity: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive", "out_of_stock"], default: "active" },
    weight: { type: Number }, // in kg (or grams, depending on your use case)
    dimensions: { type: String }, // e.g. "10x15 cm"
    color: { type: String },
    material: { type: String },
    size: { type: [String] },
    includes : { type: [String] },
    images: [{ type: String, required: true }],
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
