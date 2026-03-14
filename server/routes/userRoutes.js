import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.json(users);
  }
);

router.get(
  "/admin/overview",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);
    return res.json({ users, products, orders });
  }
);

router.delete(
  "/admin/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(id);
    return res.json({ message: "User deleted" });
  }
);

router.get("/shops", authMiddleware, async (req, res) => {
  const shops = await User.find({ role: "shopkeeper" }).select("name phone address");
  res.json(shops);
});

router.get("/wholesalers", authMiddleware, async (req, res) => {
  const wholesalers = await User.find({ role: "wholesaler" }).select("name email phone address");
  res.json(wholesalers);
});

export default router;
