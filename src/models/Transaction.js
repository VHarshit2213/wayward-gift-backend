// ...existing code...
import mongoose from "mongoose";

const CardInfoSchema = new mongoose.Schema(
  {
    brand: { type: String },
    last4: { type: String },
    funding: { type: String } // e.g., "credit", "debit"
  },
  { _id: false }
);

const TransactionSchema = new mongoose.Schema(
  {
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    provider: { type: String }, // e.g., "stripe"
    provider_payment_id: { type: String }, // paymentIntent id / gateway id
    status: { type: String }, // e.g., "succeeded", "requires_action", "pending"
    amount: { type: Number },
    currency: { type: String },
    payment_method_type: { type: String }, // e.g., "card"
    card: { type: CardInfoSchema },
    token: { type: String }, // gateway token if used
    meta: { type: mongoose.Schema.Types.Mixed }, // any small non-sensitive metadata
    created_at: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction;
// ...existing code...