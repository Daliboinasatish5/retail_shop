# Retail Supply Chain Platform (MERN)

Full-stack local retail management system with 4 roles:

- Admin
- Wholesaler
- Shopkeeper
- Customer

Project flow documentation:

- [PROJECT_FLOW.md](PROJECT_FLOW.md)

## Tech Stack

- Frontend: React + Vite + TailwindCSS + React Router + Chart.js
- Backend: Node.js + Express + JWT + Socket.io
- Database: MongoDB + Mongoose

## Folder Structure

```text
frontend/
  src/
    components/
    pages/
      AdminDashboard.jsx
      WholesalerDashboard.jsx
      ShopkeeperDashboard.jsx
      CustomerDashboard.jsx
    services/
    App.jsx
    main.jsx

server/
  config/
  middleware/
  models/
  routes/
  server.js
```

## Features Implemented

### Authentication & Access

- Signup/Login with JWT
- Role-based protected routes (admin, wholesaler, shopkeeper, customer)

### Admin Dashboard

- View all users
- Delete users
- Monitor total users/products/orders

### Wholesaler Dashboard

- Add/manage products by category
- View orders from shopkeepers
- Accept/deliver orders
- Shopkeeper contact list
- Sales summary and top shopkeepers
- Live notifications (Socket.io)

### Shopkeeper Dashboard

- View/filter wholesaler products
- Place orders to wholesalers
- Track inventory
- Low-stock alert (< 5)
- Daily sales analytics graph (Chart.js)
- View orders + notifications
- Send feedback

### Customer Dashboard

- View shops and select one
- Browse shop inventory
- Purchase products
- Bill generation
- Order history
- Profile display

### Notifications

- New order notification
- Delivery confirmation notification
- Low stock notification
- Realtime updates via Socket.io

## Database Models

- User
- Product
- ShopInventory
- Order
- Feedback
- Notification

## Setup Instructions

## 1) Backend Setup

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

### MongoDB Atlas Setup

1. Create a free cluster in MongoDB Atlas.
2. Create a database user (Database Access).
3. Add your IP in Network Access (for quick testing, `0.0.0.0/0` works but is less secure).
4. Copy your Atlas connection string from Connect → Drivers.
5. Update `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/retailshop?retryWrites=true&w=majority&appName=<app-name>
JWT_SECRET=change-this-secret
```

Notes:

- Replace `<username>`, `<password>`, `<cluster-url>`, and `<app-name>`.
- URL-encode special characters in password (example: `@` becomes `%40`).

Backend runs on:

`http://localhost:5000`

Seed command creates demo users, products, inventory, orders, feedback, and notifications.

Default seeded password for all demo users:

`123456`

Seeded users:

- admin@retailshop.com (admin)
- wholesaler1@retailshop.com (wholesaler)
- wholesaler2@retailshop.com (wholesaler)
- shopkeeper1@retailshop.com (shopkeeper)
- shopkeeper2@retailshop.com (shopkeeper)
- customer1@retailshop.com (customer)
- customer2@retailshop.com (customer)

## 2) Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

`http://localhost:5173`

## Example API Requests & Responses

### Signup

POST `/api/auth/signup`

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "password": "123456",
  "role": "shopkeeper",
  "phone": "9876543210",
  "address": "Main Street"
}
```

Response:

```json
{
  "token": "<jwt>",
  "user": {
    "id": "...",
    "name": "Rahul",
    "email": "rahul@example.com",
    "role": "shopkeeper",
    "phone": "9876543210",
    "address": "Main Street"
  }
}
```

### Wholesaler Add Product

POST `/api/products`

```json
{
  "name": "Tomato",
  "category": "vegetables",
  "price": 30,
  "quantity": 100,
  "description": "Fresh farm tomatoes"
}
```

### Shopkeeper Place Order

POST `/api/orders/shopkeeper`

```json
{
  "productId": "<productId>",
  "quantity": 10
}
```

### Customer Purchase

POST `/api/inventory/purchase`

```json
{
  "shopkeeperId": "<shopkeeperId>",
  "productId": "<productId>",
  "quantity": 2
}
```

Response includes bill:

```json
{
  "bill": {
    "lines": [
      {
        "productId": "...",
        "quantity": 2,
        "unitPrice": 40,
        "lineTotal": 80
      }
    ],
    "total": 80
  }
}
```

### Daily Sales Analytics

GET `/api/analytics/shopkeeper/daily-sales`

```json
[
  {
    "_id": "2026-03-10",
    "revenue": 1200,
    "orders": 6
  },
  {
    "_id": "2026-03-11",
    "revenue": 1800,
    "orders": 9
  }
]
```

## Hackathon Upgrade Ideas (Next)

- Geo-based nearby shop finder with Maps API
- Payment gateway integration for customer checkout
- Redis pub/sub for distributed notifications
- AI demand forecasting for smart reorder suggestions