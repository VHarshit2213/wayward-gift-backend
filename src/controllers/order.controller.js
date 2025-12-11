import * as OrderService from "../services/order.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const placeOrder = async (req, res) => {
  try {
    const savedOrder = await OrderService.placeOrder(req.user._id, req.body);
    return ApiResponse.ok(res, "Order placed successfully", { localOrder: savedOrder });
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGE_LIMIT) || 20;
    const userId=req.user._id;
    const data = await OrderService.getAllOrders(page, limit, req.query.order_status,userId, req);
    return ApiResponse.ok(res, "Orders fetched successfully", data);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const data = await OrderService.getOrderById(req, req.params.orderId);
    return ApiResponse.ok(res, "Order fetched successfully", data);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (!req.body.order_status) return ApiResponse.error(res, "order_status is required");
    console.log("request body:", req.body);
    const updatedOrder = await OrderService.updateOrderStatus(req.body.id, req.body.order_status, req);
    if (!updatedOrder) return ApiResponse.error(res, "Order not found");

    return ApiResponse.ok(res, "Order status updated", updatedOrder);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(process.env.PAGE_LIMIT) || 20;
    const data = await OrderService.getUserOrders(req, req.user._id, page, limit, req.query.order_status);
    return ApiResponse.ok(res, "User orders fetched successfully", data);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return ApiResponse.error(res, error.message);
  }
};

export const editOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderService.editOrder(req.params.orderId, req.body);
    if (!updatedOrder) return ApiResponse.error(res, "Order not found");

    return ApiResponse.ok(res, "Order updated successfully", updatedOrder);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await OrderService.deleteOrder(req.params.orderId,req);
    if (!deletedOrder) return ApiResponse.error(res, "Order not found");

    return ApiResponse.ok(res, "Order deleted successfully");
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const data = await OrderService.getRecentOrders(req);
    return ApiResponse.ok(res, "Recent orders fetched successfully", data);
  } catch (error) {
    return ApiResponse.error(res, error.message);
  }
};
