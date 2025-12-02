// services/review.service.js
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "../models/Order.js"; // adjust path/name if different

// Create Review
export async function createReview({ product_id, user_id, star, description,name }, req) {
  if ( !user_id || !star) {
    throw new Error("User and Star rating are required");
  }

   const images = req.files?.["images"] || [];

  // Check if user actually purchased the product — adapt 'items.product' and statuses to your Order schema
  const purchased = await Order.findOne({
    user_id: user_id,
    "items.product": product_id,
    status: { $in: ["Delivered", "Completed"] } // adjust statuses if needed
  }).lean();

  const isVerified = !!purchased;

  const review = await Review.create({
    product_id: product_id || null,
    user_id,
    name,
    star,
    images: images.map((img) => img.filename),
    description,
    isVerified
  });

  // Attach URLs
  review.images = review.images.map(
    (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
  );  

  return review;
}

// Get Review by ID
export async function getReview(reviewId, req) {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new Error("Invalid review ID");
  }
  const review = await Review.findById(reviewId).populate("product_id", "name");

  review.images = review.images.map(
    (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
  );

  if (!review) throw new Error("Review not found");
  return review;
}

// Update Review
export async function updateReview(reviewId, { star, description, name }, req) {
  if (!mongoose.Types.ObjectId.isValid(reviewId))
    throw new Error("Invalid review ID");

  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  if (star) review.star = star;
  if (description) review.description = description;
  if (name) review.name = name;

  const updatedReview = await review.save();
  updatedReview.images = updatedReview.images.map(
    (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
  );

  return updatedReview;
}

// Delete Review
export async function deleteReview(reviewId) {
  if (!mongoose.Types.ObjectId.isValid(reviewId))
    throw new Error("Invalid review ID");

  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Review not found");

  await Review.findByIdAndDelete(reviewId);
  return { message: "Review deleted successfully" };
}

// Get Reviews for a Product
export async function getProductReviews(productId,req) {
  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new Error("Invalid product ID");

  const reviews = await Review.find({ product_id: productId }).populate("user_id", "name email"); // adjust fields as per your User model

  reviews.forEach((review) => {
    review.images = review.images.map(
      (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
    );
  });

  return reviews;
}

// Get Reviews by a User (with limited product info)
export async function getUserReviews(userId, req) {
  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid user ID");

  const reviews = await Review.find({ user_id: userId }).populate({
    path: "product_id",
    select: "name sku images category",
    populate: { path: "category", select: "name" },
  });

  // Transform product info to only what you want
  const result = reviews.map((rev) => ({
    _id: rev._id,
    star: rev.star,
    description: rev.description,
    name: rev.name,
    date: rev.date,
    images: rev.images.map(
      (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
    ),
    product: rev.product_id
      ? {
          name: rev.product_id.name,
          sku: rev.product_id.sku,
          image: rev.product_id.images?.length ? rev.product_id.images[0] : null,
          categoryName: rev.product_id.category?.name || null,
        }
      : null,
  }));

  return result;
}

export async function getGlobalReviewSummary(req) {
  //  Total Reviews & Average Rating
  const totalReviews = await Review.countDocuments();
  const ratingAggregation = await Review.aggregate([
    { $group: { _id: null, avgRating: { $avg: "$star" } } }
  ]);

  const averageRating = ratingAggregation.length
    ? ratingAggregation[0].avgRating.toFixed(1)
    : "0.0";

  //  Latest 7–8 Reviews (with user & product info)
  const latestReviews = await Review.find({})
    .sort({ date: -1 })
    .limit(8)
    .populate({
      path: "user_id",
      select: "name"
    })
    .populate({
      path: "product_id",
      select: "name category",
      populate: {
        path: "category",
        select: "name"
      }
    })
    .lean();

  //  Format data
  const formattedReviews = latestReviews.map((r) => ({
    _id: r._id,
    star: r.star,
    description: r.description,
    images: r.images.map(
      (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
    ),
    name: r.name,
    date: r.date,
    user: { name: r.user_id?.name || "Unknown User" },
    product: {
      name: r.product_id?.name || "Unknown Product",
      category_name: r.product_id?.category?.name || "Uncategorized"
    }
  }));

  return {
    totalReviews,
    averageRating,
    latestReviews: formattedReviews
  };
}

// Get reviews with optional pagination/filtering (returns isVerified field)
export async function getReviews({ product_id, page = 1, limit = 10, sort = "-date" } = {}) {
  page = Math.max(parseInt(page, 10) || 1, 1);
  limit = Math.max(parseInt(limit, 10) || 10, 1);

  const filter = {};
  if (product_id && mongoose.Types.ObjectId.isValid(product_id)) filter.product_id = product_id;

  const total = await Review.countDocuments(filter);
  const totalPages = Math.max(Math.ceil(total / limit), 1);

  const reviews = await Review.find(filter)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean(); // isVerified will be present

  return { reviews, total, page, limit, totalPages };
}

// Get single review by id (returns isVerified)
export async function getReviewById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) throw Object.assign(new Error("Invalid id"), { status: 400 });
  const r = await Review.findById(id).lean();
  if (!r) throw Object.assign(new Error("Review not found"), { status: 404 });
  return r;
}
