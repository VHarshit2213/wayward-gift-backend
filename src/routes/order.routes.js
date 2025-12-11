// routes/order.route.js
import express from "express";
import * as orderController from "../controllers/order.controller.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();
router.use(authenticate);

router.post("/place", orderController.placeOrder);

router.get("/", orderController.getAllOrders);

router.get("/my-orders", orderController.getUserOrders);

router.get("/recent", orderController.getRecentOrders);

router.get("/:orderId", orderController.getOrderById);

router.put("/status", orderController.updateOrderStatus);

router.put("/:orderId", orderController.editOrder);

router.delete("/:orderId", orderController.deleteOrder);



export default router;
