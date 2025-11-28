// models/product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, maxlength: 255 },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },
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
    images: [{ type: String, required: false }],

     // NEW FIELDS
    isCustom: { type: Boolean, default: false },
  
    // USER SELECTED CUSTOMIZATION OPTIONS
    customSelection: {
      theme: { type: mongoose.Schema.Types.ObjectId, ref: "CustomOption" },
      size: { type: mongoose.Schema.Types.ObjectId, ref: "CustomOption" },
      coffee_roast: { type: mongoose.Schema.Types.ObjectId, ref: "CustomOption" },
      addons: [{ type: mongoose.Schema.Types.ObjectId, ref: "CustomOption" }]
    },

    // FINAL PRICE AFTER ADDING CUSTOM COMPONENTS
    finalPrice: { type: Number, default: 0 },

    // USER MESSAGE FOR THE GIFT
    message: { type: String }
  },
  { timestamps: true, versionKey: false }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
