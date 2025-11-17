import { createPaymentIntentService } from "../services/stripe.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export async function createPaymentIntent(req, res) {
  try {
    const { amount, name, email, address } = req.body;

    if (!amount || !name || !email || !address) {
      return ApiResponse.error(res, "Missing required fields: amount, name, email, address", 400);
    }

    const result = await createPaymentIntentService({
      amount,
      name,
      email,
      address,
    });

    ApiResponse.ok(res, result, "PaymentIntent created successfully");
  } catch (error) {
    console.error("Error creating PaymentIntent:", error.message);
    ApiResponse.error(res, error.message, 500);
  }
}
