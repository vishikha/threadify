import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create order
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, paymentStatus, shippingAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "No items" });
    }

    const newOrder = new Order({
      userId: req.userId,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      shippingAddress,

      // ✅ tracking fields
      orderStatus: "Order Placed",
      statusHistory: [{ status: "Order Placed" }],
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order saved", order: savedOrder });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Get user's orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get single order (tracking)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Update order status (admin use)
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    order.orderStatus = status;
    order.statusHistory.push({ status });

    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;