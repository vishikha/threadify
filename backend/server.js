// backend/server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import http from "http"; // Added for Socket.io
import { Server } from "socket.io"; // Added for Socket.io

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = "your_jwt_secret_key";

// --------------------
// MongoDB Connection
// --------------------
const mongoURL = "mongodb://127.0.0.1:27017/mystore";

try {
  await mongoose.connect(mongoURL);
  console.log("MongoDB connected successfully ✅");
} catch (err) {
  console.error("MongoDB connection error ❌", err);
}

// --------------------
// User Model
// --------------------
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", UserSchema);

// --------------------
// Product Model
// --------------------
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: String,
  description: String,
});
const Product = mongoose.model("Product", ProductSchema);

// --------------------
// Cart Model
// --------------------
const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      size: String,
    },
  ],
});
const Cart = mongoose.model("Cart", CartSchema);

// --------------------
// Order Model (with tracking)
// --------------------
const StatusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
});
const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String,
      },
    ],
    totalAmount: Number,
    paymentMethod: String,
    paymentStatus: String,
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },
    orderStatus: { type: String, default: "Order Placed" },
    statusHistory: { type: [StatusHistorySchema], default: [{ status: "Order Placed" }] },
    trackingNumber: { type: String, default: "" },
    carrier: { type: String, default: "" },
    estimatedDelivery: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", OrderSchema);

// --------------------
// Newsletter Model
// --------------------
const NewsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);
const Newsletter = mongoose.model("Newsletter", NewsletterSchema);

// --------------------
// Message Model (NEW for Chat)
// --------------------
const MessageSchema = new mongoose.Schema({
  userId: String,
  sender: String, // "user" or "admin"
  text: String,
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", MessageSchema);

// --------------------
// JWT Middleware
// --------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// --------------------
// HTTP Server & Socket.io
// --------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// --------------------
// Socket.io Logic
// --------------------
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user-specific room
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    const { userId, sender, text } = data;
    try {
      const newMessage = new Message({ userId, sender, text });
      await newMessage.save();
      io.to(userId).emit("receiveMessage", newMessage);
    } catch (err) {
      console.error("Chat error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// --------------------
// API: Get old messages
// --------------------
app.get("/api/messages/:userId", async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// --------------------
// User Routes
// --------------------
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered ✅", user: { id: newUser._id, name, email } });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { _id: user._id, name: user.name, email }, message: "Login ✅" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Products Routes
// --------------------
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find().limit(50);
    res.json(products);
  } catch (err) {
    console.error("Products fetch error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Product fetch error:", err);
    res.status(500).json({ message: "Invalid product ID" });
  }
});

// --------------------
// Cart Routes
// --------------------
app.get("/api/cart", authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId }).populate("items.productId");
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
      await cart.save();
    }
    res.json({ items: cart.items });
  } catch (err) {
    console.error("Cart fetch error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

app.post("/api/cart/add", authMiddleware, async (req, res) => {
  const { productId, size } = req.body;
  if (!productId) return res.status(400).json({ message: "Product ID required" });

  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) cart = new Cart({ userId: req.userId, items: [] });

    const index = cart.items.findIndex((item) => item.productId.toString() === productId && item.size === size);
    if (index > -1) cart.items[index].quantity += 1;
    else cart.items.push({ productId, quantity: 1, size });

    await cart.save();
    await cart.populate("items.productId");
    res.json({ items: cart.items });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// --------------------
// Orders Routes
// --------------------
app.post("/api/orders/create", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, paymentStatus, shippingAddress } = req.body;
    if (!items || !items.length) return res.status(400).json({ message: "No items in order" });

    const cleanedItems = items.map((item) => ({
      productId: mongoose.Types.ObjectId.isValid(item.productId) ? item.productId : null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
    }));

    const generateTrackingNumber = () => "TRK" + Date.now() + Math.floor(Math.random() * 1000);

    const newOrder = new Order({
      userId: req.userId,
      items: cleanedItems,
      totalAmount,
      paymentMethod,
      paymentStatus,
      shippingAddress,
      orderStatus: "Order Placed",
      statusHistory: [{ status: "Order Placed" }],
      trackingNumber: generateTrackingNumber(),
      carrier: "",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const savedOrder = await newOrder.save();
    await Cart.deleteOne({ userId: req.userId });

    res.status(201).json({ message: "Order placed successfully ✅", order: savedOrder });
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/orders/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/orders/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    res.json(order);
  } catch (err) {
    console.error("Fetch order error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    order.orderStatus = status;
    order.statusHistory.push({ status });
    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/orders/:id/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.userId) return res.status(403).json({ message: "Unauthorized" });
    if (order.orderStatus === "Delivered") return res.status(400).json({ message: "Cannot cancel delivered order" });
    if (order.orderStatus === "Cancelled") return res.status(400).json({ message: "Already cancelled" });

    order.orderStatus = "Cancelled";
    order.statusHistory.push({ status: "Cancelled" });
    await order.save();

    res.json({ message: "Order cancelled successfully ✅", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/track/:trackingNumber", async (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const order = await Order.findOne({ trackingNumber });
    if (!order) return res.status(404).json({ message: "Tracking number not found" });

    res.json({
      trackingNumber: order.trackingNumber,
      orderStatus: order.orderStatus,
      statusHistory: order.statusHistory,
      estimatedDelivery: order.estimatedDelivery,
      carrier: order.carrier,
    });
  } catch (err) {
    console.error("Track order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Newsletter Route
// --------------------
app.post("/api/newsletter", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(400).json({ message: "Already subscribed" });

    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscribed successfully ✅" });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------
// Start Server
// --------------------
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});