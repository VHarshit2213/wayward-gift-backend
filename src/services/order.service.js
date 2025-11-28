import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import User from "../models/User.js";


  // Generate next order ID (WAYWARD001…)
  export async function generateOrderId() {
    const lastOrder = await Order.find({ order_id: { $regex: /^WAYWARD\d{3}$/ } })
      .sort({ order_id: -1 })
      .limit(1)
      .lean();

    let orderNumber = 1;
    if (lastOrder.length > 0) {
      const lastOrderNum = parseInt(lastOrder[0].order_id.replace("WAYWARD", ""), 10);
      if (!isNaN(lastOrderNum)) orderNumber = lastOrderNum + 1;
    }
    return `WAYWARD${String(orderNumber).padStart(3, "0")}`;
  }

  // Place Order
export async function placeOrder(userId, body) {
  const user = await User.findById(userId).lean();
  const cart_data = await Cart.findOne({ user_id: userId }).lean();

  if (!cart_data || cart_data.products.length === 0) {
    throw new Error("Cart is empty. Cannot place order.");
  }

  const orderId = await generateOrderId();

  // Fetch products and manage stock
  const enrichedProducts = await Promise.all(
    cart_data.products.map(async (item) => {
      const product = await Product.findById(item.product_id);

      if (!product) {
        throw new Error(`Product not found: ${item.product_id}`);
      }

      // Check stock
      if (product.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const price = Number(product.discount_price ?? product.price ?? 0);
      const quantity = Number(item.quantity ?? 0);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(`Invalid price for product: ${product.name || product._id}`);
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new Error(`Invalid quantity for product: ${product.name || product._id}`);
      }

      // Deduct stock
      product.stock_quantity -= quantity;
      await product.save();

      return {
        product_id: product._id,
        quantity,
        price,
      };
    })
  );

  const totalAmount = enrichedProducts.reduce(
    (sum, item) => sum + item.discount_price * item.quantity,
    0
  );

  if (!Number.isFinite(totalAmount)) {
    throw new Error("Calculated order total is invalid");
  }

  const newOrder = new Order({
    order_id: orderId,
    user_id: userId,
    cart_id: cart_data._id,
    products: enrichedProducts,
    total_amount: totalAmount,
    discount_amount: body.discount_amount || 0,
    shipping_address: body.shipping_address || [],
    contact_information: body.contact_information || [],
    payment_method: body.payment_method || "COD",
  });

  const savedOrder = await newOrder.save();

  // Clear the user's cart after successful order
  await Cart.findByIdAndDelete(cart_data._id);

  return savedOrder;
}

  // Get all orders with pagination
  export async function getAllOrders(page, limit, orderStatus,userId) {
    const filter = {};
    if (orderStatus) filter.order_status = orderStatus;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role !== "admin") {
        throw new Error("Only admin can access all orders");
    }
    if (page > 1) {
      const previousOrders = await Order.find(filter)
        .sort({ _id: -1 })
        .limit((page - 1) * limit);
      const lastOrder = previousOrders[previousOrders.length - 1];
      if (lastOrder) {
        filter._id = { $lt: lastOrder._id };
      }
    }

    const orders = await Order.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedProducts = await Promise.all(
          order.products.map(async (item) => {
            const itemData = { ...item };
            const product = await Product.findById(item.product_id).lean();
            return product
              ? { ...itemData, ...product }
              : itemData;
          })
        );
        return { ...order, Product: enrichedProducts };
      })
    );

    const totalOrders = await Order.countDocuments(orderStatus ? { order_status: orderStatus } : {});
    return {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalItems: totalOrders,
      data: enrichedOrders
    };
  }

  // Get single order
  export async function getOrderById(orderId) {
    const order = await Order.findById(orderId).lean();
    if (!order) throw new Error("Order not found");

    const enrichedProducts = await Promise.all(
      order.products.map(async (item) => {
        const itemData = { ...item };
        const product = await Product.findById(item.product_id).lean();
        return product ? { ...itemData, ...product } : itemData;
      })
    );
    return { ...order, Product: enrichedProducts };
  }

  // Update status
  export async function updateOrderStatus(orderId, status) {
    console.log("Updating order:", orderId, "to status:", status);
    return await Order.findOneAndUpdate(
      { order_id: orderId },
      { $set: { order_status: status } },
      { new: true }
    );
  }

  // User Orders
  export async function getUserOrders(userId, page, limit, orderStatus) {
    let query = { user_id: userId };
    if (orderStatus) query.order_status = orderStatus;

    if (page > 1) {
      const previousOrders = await Order.find(query)
        .sort({ _id: -1 })
        .limit((page - 1) * limit);
      const lastOrder = previousOrders[previousOrders.length - 1];
      if (lastOrder) query._id = { $lt: lastOrder._id };
    }

    const orders = await Order.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const enrichedProducts = await Promise.all(
          order.products.map(async (item) => {
            const itemData = { ...item };
            const product = await Product.findById(item.product_id).lean();
            return product ? { ...itemData, ...product } : itemData;
          })
        );
        return { ...order, Product: enrichedProducts };
      })
    );

    const totalOrders = await Order.countDocuments({ user_id: userId });
    return {
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      totalItems: totalOrders,
      data: enrichedOrders
    };
  }

  // Edit Order
  export async function editOrder(orderId, updateData) {
    return await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true
    });
  }

  // Delete Order
  export async function deleteOrder(orderId) {
    return await Order.findByIdAndDelete(orderId);
  }
