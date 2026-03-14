import express from "express";
import Notification from "../models/Notification.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.get("/mine", authMiddleware, async (req, res) => {
  const notifications = await Notification.find({ toUser: req.user._id }).sort({ createdAt: -1 });
  return res.json(notifications);
});

router.post("/", authMiddleware, async (req, res) => {
  const { toUser, message, type } = req.body;
  const notification = await Notification.create({
    fromUser: req.user._id,
    toUser,
    message,
    type: type || "general",
  });
  req.app.locals.io.to(String(toUser)).emit("notification:new", notification);
  return res.status(201).json(notification);
});

router.patch("/:id/read", authMiddleware, async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, toUser: req.user._id },
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    return res.status(404).json({ message: "Notification not found" });
  }
  return res.json(notification);
});

export default router;
