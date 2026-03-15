import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ShopkeeperActivityPage() {
  const {
    orders,
    notifications,
    confirmDelivery,
    deliveryLoading,
    deliveryMessage,
    updateCustomerOrderStatus,
    customerOrderLoading,
    customerOrderMessage,
    currentUserId,
  } = useOutletContext();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  const dailyTransactions = useMemo(
    () =>
      orders.filter(
        (order) =>
          String(order.sellerId?._id || order.sellerId) === String(currentUserId) &&
          order.createdAt?.slice(0, 10) === selectedDate
      ),
    [orders, currentUserId, selectedDate]
  );

  const dailySoldAmount = dailyTransactions
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const bulkRequests = orders.filter(
    (order) =>
      order.orderType === "customer_order" &&
      order.bulkRequest &&
      String(order.sellerId?._id || order.sellerId) === String(currentUserId)
  );

  return (
    <div className="sk-page space-y-4">
      <div className="sk-card">
        <div className="sk-card-head">Daily Transactions (Calendar)</div>
        <div className="sk-card-body">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="date"
            className="sk-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <p className="text-sm sk-text">
            Sold Amount on {selectedDate}: <span className="font-semibold">₹{dailySoldAmount}</span>
          </p>
        </div>

        <div className="mt-3 space-y-2">
          {dailyTransactions.length === 0 ? (
            <p className="text-sm sk-muted">No transactions on selected date.</p>
          ) : (
            dailyTransactions.map((transaction) => (
              <p key={transaction._id} className="text-sm sk-text border-b border-white/10 pb-1">
                {transaction.productId?.name} | Qty: {transaction.quantity} | ₹{transaction.totalPrice} | {transaction.status}
              </p>
            ))
          )}
        </div>
        </div>
      </div>

      <div className="sk-card">
        <div className="sk-card-head">Bulk Order Requests from Customers</div>
        <div className="sk-card-body">
        {customerOrderMessage && (
          <p className="sk-soft mb-2 text-sm sk-text">{customerOrderMessage}</p>
        )}

        <div className="space-y-2">
          {bulkRequests.length === 0 ? (
            <p className="text-sm sk-muted">No bulk requests.</p>
          ) : (
            bulkRequests.map((order) => (
              <div key={order._id} className="sk-row-card flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium sk-text">{order.productId?.name}</p>
                  <p className="text-sm sk-text">
                    Qty: {order.quantity} | ₹{order.totalPrice} | Status: {order.status}
                  </p>
                  <p className="text-xs sk-muted">Customer: {order.buyerId?.name}</p>
                  <p className="text-xs sk-muted">
                    Customer Location: {order.buyerLocation || order.buyerId?.address || "Not available"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="sk-btn-accept disabled:opacity-50"
                    disabled={
                      customerOrderLoading[order._id] ||
                      order.status === "accepted" ||
                      order.status === "delivered"
                    }
                    onClick={() => updateCustomerOrderStatus(order._id, "accepted")}
                  >
                    {customerOrderLoading[order._id] ? "Updating..." : "Accept"}
                  </button>
                  <button
                    className="sk-btn-deliver disabled:opacity-50"
                    disabled={customerOrderLoading[order._id] || order.status !== "accepted"}
                    onClick={() => updateCustomerOrderStatus(order._id, "delivered")}
                  >
                    {customerOrderLoading[order._id] ? "Updating..." : "Deliver"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>

      <div className="sk-card">
        <div className="sk-card-head">Orders and Notifications</div>
        <div className="sk-card-body">
        {deliveryMessage && (
          <p className="sk-soft mb-3 text-sm sk-text">{deliveryMessage}</p>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold sk-text">Orders</h4>
          {orders.map((o) => (
            <div key={o._id} className="border-b border-white/10 pb-2">
              <p className="text-sm sk-text">
                {o.productId?.name} | {o.quantity} | {o.status}
              </p>
              {o.orderType === "shopkeeper_order" && (
                <p className="text-xs sk-muted">
                  Supplier Location: {o.sellerLocation || o.sellerId?.address || "Not available"}
                </p>
              )}
              {o.orderType === "customer_order" && (
                <p className="text-xs sk-muted">
                  Customer Location: {o.buyerLocation || o.buyerId?.address || "Not available"}
                </p>
              )}

              {o.orderType === "shopkeeper_order" &&
                String(o.buyerId?._id || o.buyerId) === String(currentUserId) &&
                o.status === "accepted" && (
                  <button
                    className="sk-btn-deliver mt-2 text-sm disabled:opacity-50"
                    disabled={deliveryLoading[o._id]}
                    onClick={() => confirmDelivery(o._id)}
                  >
                    {deliveryLoading[o._id] ? "Updating..." : "Delivered"}
                  </button>
                )}
            </div>
          ))}
          <h4 className="font-semibold mt-2 sk-text">Notifications</h4>
          {notifications.map((n) => (
            <p key={n._id} className="text-sm sk-text border-b border-white/10 pb-1">
              {n.message}
            </p>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
