# Project Flow - Retail Supply Chain Platform

This document explains the end-to-end flow of the platform across all roles.

## 1) High-Level System Flow

1. User signs up or logs in.
2. Backend issues JWT and frontend stores auth state.
3. User is redirected to role dashboard:
   - Admin -> admin dashboard
   - Wholesaler -> wholesaler dashboard
   - Shopkeeper -> shopkeeper dashboard
   - Customer -> customer dashboard
4. Role-based APIs and protected routes enforce access.

## 2) Role-Wise Flow

### Admin Flow

1. Admin logs in.
2. Views all users grouped by role.
3. Monitors totals (users, products, orders).
4. Manages users and observes platform activity.

### Wholesaler Flow

1. Wholesaler adds and manages products.
2. Shopkeeper places order for wholesaler products.
3. Wholesaler sees incoming order requests.
4. Wholesaler accepts order.
5. Shopkeeper later marks delivery from activity page.
6. System sends notifications for order updates.

### Shopkeeper Flow

1. Shopkeeper opens overview and sees all wholesalers.
2. Clicking a wholesaler opens product page filtered to that wholesaler.
3. Shopkeeper selects quantity; total price updates automatically.
4. Shopkeeper places order to wholesaler.
5. In activity, accepted orders can be marked as delivered.
6. Delivered items appear in shopkeeper inventory.
7. Shopkeeper can manage customer orders and review date-wise sold products.

### Customer Flow

1. Customer selects a shop.
2. Customer browses available shop inventory.
3. Customer sets quantity and sees quantity-based price total.
4. Customer buys product (or pay and buy flow).
5. System creates bill with line totals and grand total.
6. Customer can track order status and payment status.

## 3) Core Order Lifecycle

### Shopkeeper -> Wholesaler Order

1. Created: `shopkeeper_order` (pending)
2. Wholesaler action: accept
3. Shopkeeper action: mark delivered
4. Inventory update: delivered quantity added to shopkeeper inventory

### Customer -> Shopkeeper Order

1. Created: `customer_order`
2. Shopkeeper updates status through activity workflow
3. Bill and payment status visible in customer dashboard

## 4) Notification Flow

1. Order and status events trigger notification creation.
2. Socket events deliver realtime updates to connected users.
3. Notification page/activity pages show latest updates.

## 5) Important Frontend Route Flow

- `/dashboard/admin` -> Admin management and summaries
- `/dashboard/wholesaler/*` -> products, orders, shopkeepers, analytics
- `/dashboard/shopkeeper/*` -> overview, products, activity, feedback, sold-products
- `/dashboard/customer/*` -> shops, products, orders, feedback

## 6) Important Backend API Flow

- Auth: `/api/auth/*`
- Users: `/api/users/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`
- Inventory and purchase: `/api/inventory/*`
- Feedback: `/api/feedback/*`
- Analytics: `/api/analytics/*`
- Notifications: `/api/notifications/*`

## 7) Seeded Demo Validation Flow

After running `npm run seed` (server):

1. Login with seeded role accounts.
2. Wholesaler should have products.
3. Shopkeeper should be able to order from wholesaler products.
4. Customer should be able to purchase from selected shop.
5. Analytics and notifications should show data.
