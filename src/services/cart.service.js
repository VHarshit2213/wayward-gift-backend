// services/cart.service.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// ➤ Add to cart
export async function addToCart(userId, { product_id, quantity }) {
  if (!mongoose.Types.ObjectId.isValid(product_id))
    throw new Error("Invalid product id");

if (quantity <= 0) throw new Error("Quantity must be at least 1");

  const product = await Product.findById(product_id);
  if (!product) throw new Error("Product not found");

  if (product.stock_quantity < quantity) {
    throw new Error("Insufficient stock for the requested product");
  }
  let cart = await Cart.findOne({ user_id: userId });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user_id: userId,
      products: [{ product_id, quantity }],
    });
  } else {
    // Update existing cart
    const productIndex = cart.products.findIndex(p => p.product_id.toString() === product_id);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product_id, quantity });
    }
    cart.updated_at = new Date();
    await cart.save();
  }

  return cart;
}

// ➤ Get cart
export async function getCart(userId, req) {
  const cart = await Cart.findOne({ user_id: userId })
    .populate("products.product_id", "name price sku images category")
    .populate("products.product_id.category", "name");

  if (!cart) return { products: [] };

  // Add image URL for each product
  cart.products = cart.products.map((p) => {
    const prod = p.product_id.toObject();
    if (prod.images && prod.images.length > 0) {
      prod.images = prod.images.map(
        (img) => `${req.protocol}://${req.get("host")}/uploads/${img}`
      );
    }
    return {
      product: {
        _id: prod._id,
        name: prod.name,
        price: prod.price,
        sku: prod.sku,
        category: prod.category?.name,
        images: prod.images?.length > 0 ? [prod.images[0]] : [],
      },
      quantity: p.quantity,
      is_active: p.is_active,
      added_at: p.added_at,
    };
  });

  return cart;
}

// ➤ Update product quantity in cart
export async function updateCart(userId, { product_id, quantity }) {
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) throw new Error("Cart not found");

  const productIndex = cart.products.findIndex(p => p.product_id.toString() === product_id);
  if (productIndex === -1) throw new Error("Product not found in cart");

  cart.products[productIndex].quantity = quantity;
  cart.updated_at = new Date();
  await cart.save();

  return cart;
}

// ➤ Remove product from cart
export async function removeFromCart(userId, product_id) {
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) throw new Error("Cart not found");

  cart.products = cart.products.filter(p => p.product_id.toString() !== product_id);
  cart.updated_at = new Date();
  await cart.save();

  return cart;
}

// ➤ Clear cart
export async function clearCart(userId) {
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart) throw new Error("Cart not found");

  cart.products = [];
  cart.updated_at = new Date();
  await cart.save();

  return cart;
}
