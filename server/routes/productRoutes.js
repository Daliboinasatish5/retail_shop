import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("wholesaler"),
  async (req, res) => {
    try {
      const { name, category, price, quantity, description } = req.body;
      const product = await Product.create({
        name,
        category,
        price,
        quantity,
        description,
        wholesalerId: req.user._id,
      });
      return res.status(201).json(product);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }
);

router.get("/", authMiddleware, async (req, res) => {
  const { category, wholesalerId } = req.query;
  const filters = {};
  if (category) filters.category = category;
  if (wholesalerId) filters.wholesalerId = wholesalerId;

  const products = await Product.find(filters)
    .populate("wholesalerId", "name phone")
    .sort({ createdAt: -1 });
  return res.json(products);
});

router.get("/my", authMiddleware, roleMiddleware("wholesaler"), async (req, res) => {
  const products = await Product.find({ wholesalerId: req.user._id }).sort({ createdAt: -1 });
  return res.json(products);
});

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("wholesaler"),
  async (req, res) => {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, wholesalerId: req.user._id },
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  }
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("wholesaler"),
  async (req, res) => {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      wholesalerId: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({ message: "Product deleted" });
  }
);

export default router;
