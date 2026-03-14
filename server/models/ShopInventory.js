import mongoose from "mongoose";

const shopInventorySchema = new mongoose.Schema(
  {
    shopkeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

shopInventorySchema.index({ shopkeeperId: 1, productId: 1 }, { unique: true });

export default mongoose.model("ShopInventory", shopInventorySchema);
