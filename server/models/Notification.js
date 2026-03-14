import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["new_order", "low_stock", "delivery", "general"],
      default: "general",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);