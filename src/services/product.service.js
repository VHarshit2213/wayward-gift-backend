// services/product.service.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import mongoose from "mongoose";
import UserWishlist from "../models/UserWhishlish.js";
import { th } from "zod/locales";


export async function createProduct(
  { name, description, price, size, discount_price, includes, categoryId, sku, stock_quantity, status, weight, dimensions, color, material },
  files,
  req
) {
  const images = req.files?.["images"];
  const userId = req.user._id; // from JWT
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Only admin can create products");
  if (!name) throw new Error("Product name is required");
  if (!price) throw new Error("Product price is required");
  if (!categoryId) throw new Error("Category ID is required");
  if (!sku) throw new Error("SKU is required");
  if (!images || images.length === 0) throw new Error("At least one product image is required");

  if (!mongoose.Types.ObjectId.isValid(categoryId)) throw new Error("Invalid category ID");

  const category = await Category.findById(categoryId);
  if (!category) throw new Error("Category not found");

  const exists = await Product.findOne({ sku });
  if (exists) throw new Error("Product already exists with this SKU");

  const product = await Product.create({
    name,
    description,
    price,
    discount_price,
    category: categoryId,
    sku,
    includes: includes || [],
    size: size || [],
    stock_quantity: stock_quantity || 0,
    status: status || "active",
    weight,
    dimensions,
    color,
    material,
    images: images.map((img) => img.filename),
  });

  // Attach URLs
  product.images = product.images.map(
    (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
  );

  return product;
}
export async function getProducts(productId, req) {
  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(productId))
      throw new Error("Please provide valid product id");

    const product = await Product.findById(productId).populate("category").populate("customSelection.theme").populate("customSelection.size").populate("customSelection.coffee_roast").populate("customSelection.addons");
    if (!product) throw new Error("Product not found");

    product.images = product.images.map(
      (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
    );

    const reviews = await (await Review.find({ product_id: productId }).populate("user_id", "name profilePicture"));

    reviews.forEach((review) => {
      review.images = review.images.map(
        (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
      );
      review.user_id.profilePicture = review.user_id.profilePicture
        ? `${req.protocol}://${req.get("host")}/uploads/${review.user_id.profilePicture}`
        : null;
    });
    let avgStar = 0;
    if (reviews.length > 0) {
      avgStar = reviews.reduce((sum, r) => sum + Number(r.star), 0) / reviews.length;
    }

    return {
      ...product.toObject(),
      reviews,
      totalReviews: reviews.length,
      averageStar: avgStar.toFixed(1),
    };
  }
}


export async function updateProduct(productId, updates, files, req) {
  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new Error("Invalid product ID");
  const userId = req.user._id; // from JWT
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Only admin can update products");
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  // Handle category change
  if (updates.categoryId) {
    if (!mongoose.Types.ObjectId.isValid(updates.categoryId)) {
      throw new Error("Invalid category ID");
    }
    const category = await Category.findById(updates.categoryId);
    if (!category) throw new Error("Category not found");
    product.category = updates.categoryId;
  }

  // Update fields if provided
  const fields = [
    "name",
    "description",
    "price",
    "discount_price",
    "sku",
    "stock_quantity",
    "status",
    "weight",
    "dimensions",
    "color",
    "material",
    "includes",
    "size",
  ];
  fields.forEach((field) => {
    if (updates[field] !== undefined) product[field] = updates[field];
  });

  // Replace images if new ones uploaded
  const images = files?.["images"];
  if (images && images.length > 0) {
    product.images = images.map((img) => img.filename);
  }

  await product.save();

  product.images = product.images.map(
    (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
  );

  return product;
}



export async function deleteProduct(productId, userId) {
  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new Error("Invalid product ID");

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role !== "admin") throw new Error("Only admin can update products");
  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  await Product.findByIdAndDelete(productId);

  return { message: "Product deleted successfully" };
}


// services/product.service.js
export async function getAllProducts({ categoryId, search, page = 1, limit = 10, inStock, inWishlist  }, req) {
  const filter = {};
  filter.isCustom = { $ne: true };
  // FILTER BY MULTIPLE OR SINGLE CATEGORY
  if (categoryId) {
    const categories = Array.isArray(categoryId) ? categoryId : categoryId.split(",");
    filter.category = { $in: categories };
  }

  // SEARCH BY NAME
  if (search) filter.name = { $regex: search, $options: "i" };

  // 3-STATE IN STOCK FILTER
  if (inStock === "true") {
    filter.stock_quantity = { $gt: 0 };
  } else if (inStock === "false") {
    filter.stock_quantity = 0;
  }
  // If inStock is undefined → no filter applied

   let wishlistProductIds = [];
  if (inWishlist === "true" || inWishlist === "false") {
    try {
      const userId = req.user._id;

      const wishlist = await UserWishlist.findOne({ user_id: userId })
        .select("products")
        .lean();

      wishlistProductIds = wishlist?.products?.map(id => id.toString()) || [];

      // ⬇ Apply wishlist filter ONLY if frontend sends inWishlist filter
      if (inWishlist === "true") {
        filter._id = { $in: wishlistProductIds };
      } else if (inWishlist === "false") {
        filter._id = { $nin: wishlistProductIds };
      }

    } catch (err) {
      console.log("Error while fetching wishlist:", err.message);
      throw new Error("Error while fetching wishlist filter ");
    }
  }

  const skip = (page - 1) * limit;

  // Count total products
  const total = await Product.countDocuments(filter);

  // Fetch products
  const products = await Product.find(filter)
    .populate("category", "name")
    .skip(skip)
    .limit(Number(limit));

  const productIds = products.map((p) => p._id);

  // Aggregate reviews
  const reviewStats = await Review.aggregate([
    { $match: { product_id: { $in: productIds } } },
    {
      $group: {
        _id: "$product_id",
        totalReviews: { $sum: 1 },
        averageStar: { $avg: "$star" }
      }
    }
  ]);

  const statsMap = {};
  reviewStats.forEach((stat) => {
    statsMap[stat._id.toString()] = {
      totalReviews: stat.totalReviews,
      averageStar: stat.averageStar.toFixed(1),
    };
  });

  // Attach stats + image URLs
  const responseProducts = products.map((p) => {
    const prod = p.toObject();
    if (prod.images && prod.images.length > 0) {
      prod.images = prod.images.map(
        (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
      );
    }
    return {
      ...prod,
      totalReviews: statsMap[p._id.toString()]?.totalReviews || 0,
      averageStar: statsMap[p._id.toString()]?.averageStar || "0.0",
    };
  });

  return {
    products: responseProducts,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
}


export const createUserCustomProduct = async (data) => {
  console.log("Creating custom product with data:", data);
  return await Product.create({
    name: "Customized Basket",
    message: data.message || "",
    discount_price: data.finalPrice,
    sku: "CUST-" + Date.now(),
    stock_quantity: 1,
    isCustom: true,
    customSelection: data.selectedOptions
  });
};


export const addWishlist = async (userId, productId) => {
    let wishlist = await UserWishlist.findOne({ user_id: userId });

    if (!wishlist) {
      wishlist = await UserWishlist.create({
        user_id: userId,
        products: [productId]
      });
    } else {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
    }

    await wishlist.save();
    return wishlist;
}


export const removeWishlist = async (userId, productId) => {

   const wishlist = await UserWishlist.findOne({ user_id: userId });

    if (!wishlist) {
      return { message: "Product removed", inWishlist: false };
    }

    wishlist.products = wishlist.products.filter(
      p => p.toString() !== productId
    );

    await wishlist.save();
    return wishlist;
}