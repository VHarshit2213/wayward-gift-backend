import mongoose from "mongoose";

const userWishlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});

const UserWishlist = mongoose.model("UserWishlist", userWishlistSchema);

export default UserWishlist;
