import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ShopInventory from "../models/ShopInventory.js";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const router = express.Router();

router.post(
  "/shopkeeper",
  authMiddleware,
  roleMiddleware("shopkeeper"),
  async (req, res) => {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient wholesaler stock" });
    }

    const order = await Order.create({
      buyerId: req.user._id,
      sellerId: product.wholesalerId,
      productId,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      orderType: "shopkeeper_order",
    });

    const notification = await Notification.create({
      fromUser: req.user._id,
      toUser: product.wholesalerId,
      type: "new_order",
      message: `New order from ${req.user.name} for ${quantity} units`,
    });
    req.app.locals.io.to(String(product.wholesalerId)).emit("notification:new", notification);

    return res.status(201).json(order);
  }
);

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("wholesaler"),
  async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (String(order.sellerId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your order" });
    }

    order.status = status;
    await order.save();

    if (status === "delivered") {
      const product = await Product.findById(order.productId);
      if (product && product.quantity >= order.quantity) {
        product.quantity -= order.quantity;
        await product.save();
      }

      const inventory = await ShopInventory.findOne({
        shopkeeperId: order.buyerId,
        productId: order.productId,
      });

      if (!inventory) {
        await ShopInventory.create({
          shopkeeperId: order.buyerId,
          productId: order.productId,
          quantity: order.quantity,
          price: order.unitPrice,
        });
      } else {
        inventory.quantity += order.quantity;
        inventory.price = order.unitPrice;
        await inventory.save();
      }

      const notification = await Notification.create({
        fromUser: req.user._id,
        toUser: order.buyerId,
        type: "delivery",
        message: "Your order has been delivered",
      });
      req.app.locals.io.to(String(order.buyerId)).emit("notification:new", notification);
    }

    return res.json(order);
  }
);

router.patch(
  "/:id/confirm-delivery",
  authMiddleware,
  roleMiddleware("shopkeeper"),
  async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderType !== "shopkeeper_order") {
      return res.status(400).json({ message: "Invalid order type for this action" });
    }

    if (String(order.buyerId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your order" });
    }

    if (order.status === "delivered") {
      return res.status(400).json({ message: "Order already delivered" });
    }

    if (order.status !== "accepted") {
      return res.status(400).json({ message: "Order must be accepted first" });
    }

    const product = await Product.findById(order.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.quantity < order.quantity) {
      return res.status(400).json({ message: "Insufficient wholesaler stock" });
    }

    product.quantity -= order.quantity;
    await product.save();

    const inventory = await ShopInventory.findOne({
      shopkeeperId: order.buyerId,
      productId: order.productId,
    });

    if (!inventory) {
      await ShopInventory.create({
        shopkeeperId: order.buyerId,
        productId: order.productId,
        quantity: order.quantity,
        price: order.unitPrice,
      });
    } else {
      inventory.quantity += order.quantity;
      inventory.price = order.unitPrice;
      await inventory.save();
    }

    order.status = "delivered";
    await order.save();

    const notification = await Notification.create({
      fromUser: req.user._id,
      toUser: order.sellerId,
      type: "delivery",
      message: `Shopkeeper ${req.user.name} confirmed delivery`,
    });
    req.app.locals.io.to(String(order.sellerId)).emit("notification:new", notification);

    return res.json(order);
  }
);

router.patch(
  "/:id/customer-status",
  authMiddleware,
  roleMiddleware("shopkeeper"),
  async (req, res) => {
    const { status } = req.body;
    if (!["accepted", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderType !== "customer_order") {
      return res.status(400).json({ message: "Invalid order type" });
    }

    if (String(order.sellerId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not your order" });
    }

    if (order.status === "delivered") {
      return res.status(400).json({ message: "Order already delivered" });
    }

    if (status === "accepted") {
      order.status = "accepted";
      await order.save();
    }

    if (status === "delivered") {
      if (order.status !== "accepted") {
        return res.status(400).json({ message: "Order must be accepted first" });
      }

      const item = await ShopInventory.findOne({
        shopkeeperId: req.user._id,
        productId: order.productId,
      });

      if (!item || item.quantity < order.quantity) {
        return res.status(400).json({ message: "Insufficient stock" });
      }

      item.quantity -= order.quantity;
      await item.save();

      order.status = "delivered";
      await order.save();

      if (item.quantity < 5) {
        const product = await Product.findById(order.productId);
        if (product?.wholesalerId) {
          const lowStockNotification = await Notification.create({
            fromUser: req.user._id,
            toUser: product.wholesalerId,
            type: "low_stock",
            message: `${product.name} stock is low at shopkeeper ${req.user.name}`,
          });
          req.app.locals.io.to(String(product.wholesalerId)).emit("notification:new", lowStockNotification);
        }
      }
    }

    const notification = await Notification.create({
      fromUser: req.user._id,
      toUser: order.buyerId,
      type: "delivery",
      message: `Your order status updated to ${order.status}`,
    });
    req.app.locals.io.to(String(order.buyerId)).emit("notification:new", notification);

    return res.json(order);
  }
);

router.get("/mine", authMiddleware, async (req, res) => {
  const orders = await Order.find({
    $or: [{ buyerId: req.user._id }, { sellerId: req.user._id }],
  })
    .populate("productId", "name category")
    .populate("buyerId", "name phone")
    .populate("sellerId", "name phone")
    .sort({ createdAt: -1 });

  return res.json(orders);
});

router.get("/wholesaler/contacts", authMiddleware, roleMiddleware("wholesaler"), async (req, res) => {
  const orders = await Order.find({ sellerId: req.user._id, orderType: "shopkeeper_order" })
    .populate("buyerId", "name phone address")
    .sort({ createdAt: -1 });

  const uniqueContacts = [...new Map(orders.map((o) => [String(o.buyerId._id), o.buyerId])).values()];
  return res.json(uniqueContacts);
});

export default router;
