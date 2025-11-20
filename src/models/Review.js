
import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // assuming you have a User model
    name: { type: String },
    star: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String },
    images: [{ type: String }], // array of image filenames/URLs
    date: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
