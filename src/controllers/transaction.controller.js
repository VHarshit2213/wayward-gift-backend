import Transaction from "../models/Transaction.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Admin: list transactions with pagination + filters (status, provider, userId, q)
export async function listTransactionsAdmin(req, res) {
  const user = req.user;
  if (!user || user.role !== "admin") return res.status(403).json({ error: "Only admin can access transactions" });

  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);

  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.provider) filter.provider = req.query.provider;
  if (req.query.userId) filter.user_id = req.query.userId;

  if (req.query.q) {
    const q = new RegExp(escapeRegExp(req.query.q.trim()), "i");
    filter.$or = [
      { provider_payment_id: q },
      { "card.last4": q },
      { "meta.note": q }
    ];
  }

  const total = await Transaction.countDocuments(filter);
  const transactions = await Transaction.find(filter)
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("user_id", "name email")
    .populate("order_id", "order_id total_amount")
    .lean();

  return res.json({
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    data: transactions
  });
}

// Admin: get single transaction by id (populated)
export async function getTransactionAdmin(req, res) {
  const user = req.user;
  if (!user || user.role !== "admin") return res.status(403).json({ error: "Only admin can access transactions" });

  const id = req.params.id;
  const tx = await Transaction.findById(id)
    .populate("user_id", "name email")
    .populate("order_id", "order_id total_amount")
    .lean();

  if (!tx) return res.status(404).json({ error: "Transaction not found" });
  return res.json(tx);
}

// User: list own transactions (paginated)
export async function listUserTransactions(req, res) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);

  const filter = { user_id: user._id };
  if (req.query.status) filter.status = req.query.status;

  const total = await Transaction.countDocuments(filter);
  const transactions = await Transaction.find(filter)
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("order_id", "order_id total_amount")
    .lean();

  return res.json({
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    data: transactions
  });
}

// User: get single transaction by id (only owner or admin)
export async function getTransactionById(req, res) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const id = req.params.id;
  const tx = await Transaction.findById(id).populate("order_id", "order_id total_amount").lean();
  if (!tx) return res.status(404).json({ error: "Transaction not found" });

  if (user.role !== "admin" && tx.user_id?.toString() !== user._id.toString()) {
    return res.status(403).json({ error: "Forbidden" });
  }
  return res.json(tx);
}