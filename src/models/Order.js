// models/order.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true }, // custom order id (e.g., #1001)
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart", required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      coffee_bean_type: { type: String, enum: ['Arabica', 'Robusta', 'Liberica' ], required: false }
    }
  ],

  discount_amount: { type: Number, default: 0 },
  delivery_status: { type: String, default: "Pending" }, // Pending / Shipped / Delivered / Cancelled
  total_amount: { type: Number, required: true },
  payment_status: { type: String, default: "Pending" }, // Pending / Paid / Failed
  order_status: { type: String, default: "Pending" }, // Pending / Confirmed / Cancelled
  tax: { type: Number, default: 0 },
  payment_method: { type: String, enum: ["COD", "Card", "UPI", "Paypal"], default: "COD" },
  o_date: { type: Date, default: Date.now },
  contact_information: { type: Array },
  shipping_address: { type: Array },
  billing_address: { type: Array },
  payment: {
    provider: { type: String }, // e.g., "stripe"
    provider_payment_id: { type: String }, // PaymentIntent id
    status: { type: String }, // order payment status
    amount: { type: Number },
    currency: { type: String },
    method: { type: String }, // e.g., "card", "cod"
    card: {
      brand: { type: String },
      last4: { type: String }
    }
  },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
}, { versionKey: false });

const Order = mongoose.model("Order", OrderSchema);
export default Order;
