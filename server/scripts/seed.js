import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import ShopInventory from "../models/ShopInventory.js";
import Order from "../models/Order.js";
import Feedback from "../models/Feedback.js";
import Notification from "../models/Notification.js";

dotenv.config();

const plainPassword = "123456";
const categories = ["fruits", "vegetables", "dairy", "groceries"];

const makeUser = async ({ name, email, role, phone, address }) => ({
  name,
  email,
  role,
  phone,
  address,
  password: await bcrypt.hash(plainPassword, 10),
});

const clearData = async () => {
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    ShopInventory.deleteMany({}),
    Order.deleteMany({}),
    Feedback.deleteMany({}),
    Notification.deleteMany({}),
  ]);
};

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI missing. Create server/.env from .env.example first.");
  }

  await connectDB();
  await clearData();

  const admin = await makeUser({
    name: "Admin One",
    email: "admin@retailshop.com",
    role: "admin",
    phone: "9000000001",
    address: "HQ Road",
  });

  const wholesalerUsers = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      makeUser({
        name: `Wholesaler ${i + 1}`,
        email: `wholesaler${i + 1}@retailshop.com`,
        role: "wholesaler",
        phone: `910000000${i + 1}`,
        address: `Wholesale Market ${String.fromCharCode(65 + i)}`,
      })
    )
  );

  const shopkeeperUsers = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      makeUser({
        name: `Shopkeeper ${i + 1}`,
        email: `shopkeeper${i + 1}@retailshop.com`,
        role: "shopkeeper",
        phone: `920000000${i + 1}`,
        address: `Shop Street ${i + 1}`,
      })
    )
  );

  const customerUsers = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      makeUser({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@retailshop.com`,
        role: "customer",
        phone: `930000000${i + 1}`,
        address: `Customer Block ${i + 1}`,
      })
    )
  );

  const users = await User.insertMany([admin, ...wholesalerUsers, ...shopkeeperUsers, ...customerUsers]);

  const wholesalers = users.filter((user) => user.role === "wholesaler");
  const shopkeepers = users.filter((user) => user.role === "shopkeeper");
  const customers = users.filter((user) => user.role === "customer");

  const productDocs = Array.from({ length: 50 }, (_, i) => {
    const wholesaler = wholesalers[i % wholesalers.length];
    const category = categories[i % categories.length];
    return {
      name: `${category.slice(0, 1).toUpperCase() + category.slice(1)} Product ${i + 1}`,
      category,
      price: randomBetween(20, 500),
      quantity: randomBetween(40, 300),
      description: `Quality ${category} product ${i + 1}`,
      wholesalerId: wholesaler._id,
    };
  });

  const products = await Product.insertMany(productDocs);

  const inventoryDocs = [];
  for (const shopkeeper of shopkeepers) {
    for (let index = 0; index < 8; index += 1) {
      const product = products[(shopkeepers.indexOf(shopkeeper) * 8 + index) % products.length];
      inventoryDocs.push({
        shopkeeperId: shopkeeper._id,
        productId: product._id,
        price: product.price + randomBetween(5, 30),
        quantity: randomBetween(10, 80),
      });
    }
  }

  await ShopInventory.insertMany(inventoryDocs);

  const orderDocs = [];
  for (let i = 0; i < 25; i += 1) {
    const product = products[i % products.length];
    const wholesaler = wholesalers.find((w) => String(w._id) === String(product.wholesalerId));
    const shopkeeper = shopkeepers[i % shopkeepers.length];
    const quantity = randomBetween(5, 25);
    const status = i % 3 === 0 ? "delivered" : i % 3 === 1 ? "accepted" : "pending";

    orderDocs.push({
      buyerId: shopkeeper._id,
      sellerId: wholesaler?._id,
      productId: product._id,
      quantity,
      unitPrice: product.price,
      totalPrice: product.price * quantity,
      orderType: "shopkeeper_order",
      status,
      createdAt: new Date(Date.now() - randomBetween(0, 6) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }

  for (let i = 0; i < 30; i += 1) {
    const shopkeeper = shopkeepers[i % shopkeepers.length];
    const customer = customers[i % customers.length];
    const inventoryItem = inventoryDocs[(i * 2) % inventoryDocs.length];
    const quantity = randomBetween(1, 6);
    const unitPrice = inventoryItem.price;

    orderDocs.push({
      buyerId: customer._id,
      sellerId: shopkeeper._id,
      productId: inventoryItem.productId,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
      orderType: "customer_order",
      bulkRequest: i % 5 === 0,
      status: i % 2 === 0 ? "delivered" : "accepted",
      createdAt: new Date(Date.now() - randomBetween(0, 6) * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    });
  }

  const orders = await Order.insertMany(orderDocs);

  const feedbackDocs = [];
  for (let i = 0; i < shopkeepers.length; i += 1) {
    feedbackDocs.push({
      fromUser: shopkeepers[i]._id,
      toUser: wholesalers[i % wholesalers.length]._id,
      rating: randomBetween(3, 5),
      comment: `Feedback from shopkeeper ${i + 1}`,
    });
  }

  for (let i = 0; i < customers.length; i += 1) {
    feedbackDocs.push({
      fromUser: customers[i]._id,
      toUser: shopkeepers[i % shopkeepers.length]._id,
      rating: randomBetween(3, 5),
      comment: `Feedback from customer ${i + 1}`,
    });
  }

  await Feedback.insertMany(feedbackDocs);

  const notifications = orders.slice(0, 15).map((order, idx) => ({
    fromUser: order.buyerId,
    toUser: order.sellerId,
    message: idx % 2 === 0 ? "New order received" : "Order status updated",
    type: idx % 3 === 0 ? "new_order" : idx % 3 === 1 ? "delivery" : "low_stock",
  }));

  await Notification.insertMany(notifications);

  console.log("Seed completed successfully.");
  console.log("Demo login password for all users:", plainPassword);
  console.log("Created users:", users.length);
  console.log("Created wholesalers:", wholesalers.length);
  console.log("Created shopkeepers:", shopkeepers.length);
  console.log("Created customers:", customers.length);
  console.log("Created products:", products.length);
  console.log("Created orders:", orderDocs.length);
  console.log("Sample logins:");
  console.log("- admin: admin@retailshop.com");
  console.log("- wholesaler: wholesaler1@retailshop.com");
  console.log("- shopkeeper: shopkeeper1@retailshop.com");
  console.log("- customer: customer1@retailshop.com");

  process.exit(0);
};

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
