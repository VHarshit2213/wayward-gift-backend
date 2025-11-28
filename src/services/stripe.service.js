import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createPaymentIntentService({ amount, name, email, address }) {
  const normalizedAmount = Number(amount);
  if (!Number.isFinite(normalizedAmount) || !Number.isInteger(normalizedAmount) || normalizedAmount <= 0) {
    throw new Error("Invalid amount supplied for PaymentIntent");
  }

  // Create customer
  const customer = await stripe.customers.create({
    name,
    email,
    address, // { line1, city, state, postal_code, country }
  });

  // Create PaymentIntent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: normalizedAmount, // smallest currency unit (e.g., 1000 = $10)
    currency: "usd",
    payment_method_types: ["card"],
    description: "Purchase from WAYWARD",
    customer: customer.id,
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}
