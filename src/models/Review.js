import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    star: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String },
    images: [{ type: String }],
    date: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: false } // <-- added
  },
  { versionKey: false }
);

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
