import mongoose from "mongoose";

const statusHistorySchema = new mongoose.Schema({
  status: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const orderSchema = new mongoose.Schema(
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

    orderStatus: {
      type: String,
      default: "Order Placed",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    carrier: {
      type: String,
      default: "",
    },

    estimatedDelivery: Date,

    statusHistory: [statusHistorySchema],

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);