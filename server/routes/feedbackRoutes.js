import express from "express";
import Feedback from "../models/Feedback.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { toUser, rating, comment } = req.body;
  const feedback = await Feedback.create({
    fromUser: req.user._id,
    toUser,
    rating,
    comment,
  });
  return res.status(201).json(feedback);
});

router.get("/received", authMiddleware, async (req, res) => {
  const feedback = await Feedback.find({ toUser: req.user._id })
    .populate("fromUser", "name role")
    .sort({ createdAt: -1 });
  return res.json(feedback);
});

export default router;
