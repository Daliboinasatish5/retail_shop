import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const router = express.Router();

router.get(
  "/shopkeeper/daily-sales",
  authMiddleware,
  roleMiddleware("shopkeeper"),
  async (req, res) => {
    const result = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(req.user._id),
          orderType: "customer_order",
          status: "delivered",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json(result);
  }
);

router.get(
  "/wholesaler/summary",
  authMiddleware,
  roleMiddleware("wholesaler"),
  async (req, res) => {
    const [totalSold, topShopkeepers] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(req.user._id),
            orderType: "shopkeeper_order",
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            quantitySold: { $sum: "$quantity" },
            revenue: { $sum: "$totalPrice" },
          },
        },
      ]),
      Order.aggregate([
        {
          $match: {
            sellerId: new mongoose.Types.ObjectId(req.user._id),
            orderType: "shopkeeper_order",
          },
        },
        {
          $group: {
            _id: "$buyerId",
            orderCount: { $sum: 1 },
            amount: { $sum: "$totalPrice" },
          },
        },
        { $sort: { amount: -1 } },
        { $limit: 5 },
      ]),
    ]);

    return res.json({
      totalSold: totalSold[0] || { quantitySold: 0, revenue: 0 },
      topShopkeepers,
    });
  }
);

router.get(
  "/shopkeeper/reorder-suggestions",
  authMiddleware,
  roleMiddleware("shopkeeper"),
  async (req, res) => {
    const orders = await Order.find({
      sellerId: req.user._id,
      orderType: "customer_order",
      status: "delivered",
    })
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    const grouped = {};
    for (const order of orders) {
      const key = String(order.productId?._id || order.productId);
      if (!grouped[key]) {
        grouped[key] = { product: order.productId, sold: 0 };
      }
      grouped[key].sold += order.quantity;
    }

    const suggestions = Object.values(grouped)
      .map((item) => ({
        productName: item.product?.name || "Unknown",
        sold: item.sold,
        suggestedReorderQty: Math.ceil(item.sold * 0.5),
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    return res.json(suggestions);
  }
);

export default router;
