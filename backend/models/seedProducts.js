// backend/seedProducts.js

import mongoose from "mongoose";
import Product from "./models/Product.js";           // backend/models/Product.js
import menudata from "../src/data/menudata.js";      // frontend data folder

async function seedProducts() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mystore");
    console.log("MongoDB connected ✅");

    await Product.deleteMany({}); // clear old products

    for (const product of menudata) {
      await Product.create(product);
    }

    console.log("Products seeded ✅");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedProducts();