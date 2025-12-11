import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, default: 1 },
      is_active: { type: Boolean, default: true },
      added_at: { type: Date, default: Date.now },
      coffee_bean_type: { type: String, enum: ['Arabica','Robusta','Liberica'], required: false } // <- per-item
    }
  ],
  updated_at: { type: Date, default: Date.now }
}, { versionKey: false });

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
