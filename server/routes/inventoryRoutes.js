import express from "express";
import ShopInventory from "../models/ShopInventory.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const router = express.Router();

router.get("/shopkeeper", authMiddleware, roleMiddleware("shopkeeper"), async (req, res) => {
  const items = await ShopInventory.find({ shopkeeperId: req.user._id })
    .populate("productId", "name category wholesalerId")
    .sort({ createdAt: -1 });
  return res.json(items);
});

router.patch(
  "/shopkeeper/:id",
  authMiddleware,
  roleMiddleware("shopkeeper"),
  async (req, res) => {
    const item = await ShopInventory.findOneAndUpdate(
      { _id: req.params.id, shopkeeperId: req.user._id },
      req.body,
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    return res.json(item);
  }
);

router.post(
  "/sell",
  authMiddleware,
  roleMiddleware("shopkeeper"),
  async (req, res) => {
    const { customerId, productId, quantity } = req.body;
    const item = await ShopInventory.findOne({ shopkeeperId: req.user._id, productId });
    if (!item) {
      return res.status(404).json({ message: "Item not found in inventory" });
    }
    if (item.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    item.quantity -= quantity;
    await item.save();

    const order = await Order.create({
      buyerId: customerId,
      sellerId: req.user._id,
      productId,
      quantity,
      unitPrice: item.price,
      totalPrice: item.price * quantity,
      orderType: "customer_order",
      status: "delivered",
    });

    if (item.quantity < 5) {
      const product = await Product.findById(productId);
      if (product?.wholesalerId) {
        const notification = await Notification.create({
          fromUser: req.user._id,
          toUser: product.wholesalerId,
          type: "low_stock",
          message: `${product.name} stock is low at shopkeeper ${req.user.name}`,
        });
        req.app.locals.io.to(String(product.wholesalerId)).emit("notification:new", notification);
      }
    }

    return res.status(201).json({
      message: "Sale completed",
      order,
      remainingStock: item.quantity,
    });
  }
);

router.get(
  "/shop/:shopkeeperId",
  authMiddleware,
  roleMiddleware("customer"),
  async (req, res) => {
    const items = await ShopInventory.find({ shopkeeperId: req.params.shopkeeperId })
      .populate("productId", "name category")
      .sort({ createdAt: -1 });
    return res.json(items);
  }
);

router.post(
  "/purchase",
  authMiddleware,
  roleMiddleware("customer"),
  async (req, res) => {
    const { shopkeeperId, productId, quantity } = req.body;
    const item = await ShopInventory.findOne({ shopkeeperId, productId });
    if (!item) {
      return res.status(404).json({ message: "Product unavailable" });
    }
    if (item.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient shop stock" });
    }

    item.quantity -= quantity;
    await item.save();

    const order = await Order.create({
      buyerId: req.user._id,
      sellerId: shopkeeperId,
      productId,
      quantity,
      unitPrice: item.price,
      totalPrice: item.price * quantity,
      orderType: "customer_order",
      status: "delivered",
    });

    const product = await Product.findById(productId).select("wholesalerId");
    if (item.quantity < 5 && product?.wholesalerId) {
      const notification = await Notification.create({
        fromUser: shopkeeperId,
        toUser: product.wholesalerId,
        type: "low_stock",
        message: "Low stock alert from customer purchase flow",
      });
      req.app.locals.io.to(String(product.wholesalerId)).emit("notification:new", notification);
    }

    return res.status(201).json({
      bill: {
        lines: [
          {
            productId,
            quantity,
            unitPrice: item.price,
            lineTotal: item.price * quantity,
          },
        ],
        total: item.price * quantity,
      },
      order,
    });
  }
);

router.post(
  "/bulk-request",
  authMiddleware,
  roleMiddleware("customer"),
  async (req, res) => {
    const { shopkeeperId, productId, quantity } = req.body;

    const item = await ShopInventory.findOne({ shopkeeperId, productId });
    if (!item) {
      return res.status(404).json({ message: "Product unavailable" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity should be at least 1" });
    }

    const order = await Order.create({
      buyerId: req.user._id,
      sellerId: shopkeeperId,
      productId,
      quantity,
      unitPrice: item.price,
      totalPrice: item.price * quantity,
      orderType: "customer_order",
      bulkRequest: true,
      status: "pending",
    });

    const notification = await Notification.create({
      fromUser: req.user._id,
      toUser: shopkeeperId,
      type: "new_order",
      message: `New bulk order request for quantity ${quantity}`,
    });
    req.app.locals.io.to(String(shopkeeperId)).emit("notification:new", notification);

    return res.status(201).json({ message: "Bulk request placed", order });
  }
);

export default router;
