import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

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
    <div className="space-y-4">
      <PageCard title="Daily Transactions (Calendar)">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <input
            type="date"
            className="border rounded p-2"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <p className="text-sm text-slate-700">
            Sold Amount on {selectedDate}: <span className="font-semibold">₹{dailySoldAmount}</span>
          </p>
        </div>

        <div className="mt-3 space-y-2">
          {dailyTransactions.length === 0 ? (
            <p className="text-sm text-slate-500">No transactions on selected date.</p>
          ) : (
            dailyTransactions.map((transaction) => (
              <p key={transaction._id} className="text-sm border-b pb-1">
                {transaction.productId?.name} | Qty: {transaction.quantity} | ₹{transaction.totalPrice} | {transaction.status}
              </p>
            ))
          )}
        </div>
      </PageCard>

      <PageCard title="Bulk Order Requests from Customers">
        {customerOrderMessage && (
          <p className="mb-2 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{customerOrderMessage}</p>
        )}

        <div className="space-y-2">
          {bulkRequests.length === 0 ? (
            <p className="text-sm text-slate-500">No bulk requests.</p>
          ) : (
            bulkRequests.map((order) => (
              <div key={order._id} className="border rounded p-2 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{order.productId?.name}</p>
                  <p className="text-sm">
                    Qty: {order.quantity} | ₹{order.totalPrice} | Status: {order.status}
                  </p>
                  <p className="text-xs text-slate-500">Customer: {order.buyerId?.name}</p>
                  <p className="text-xs text-slate-500">
                    Customer Location: {order.buyerLocation || order.buyerId?.address || "Not available"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-2 py-1 bg-amber-500 text-white rounded disabled:opacity-50"
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
                    className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50"
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
      </PageCard>

      <PageCard title="Orders and Notifications">
        {deliveryMessage && (
          <p className="mb-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{deliveryMessage}</p>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold">Orders</h4>
          {orders.map((o) => (
            <div key={o._id} className="border-b pb-2">
              <p className="text-sm">
                {o.productId?.name} | {o.quantity} | {o.status}
              </p>
              {o.orderType === "shopkeeper_order" && (
                <p className="text-xs text-slate-500">
                  Supplier Location: {o.sellerLocation || o.sellerId?.address || "Not available"}
                </p>
              )}
              {o.orderType === "customer_order" && (
                <p className="text-xs text-slate-500">
                  Customer Location: {o.buyerLocation || o.buyerId?.address || "Not available"}
                </p>
              )}

              {o.orderType === "shopkeeper_order" &&
                String(o.buyerId?._id || o.buyerId) === String(currentUserId) &&
                o.status === "accepted" && (
                  <button
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                    disabled={deliveryLoading[o._id]}
                    onClick={() => confirmDelivery(o._id)}
                  >
                    {deliveryLoading[o._id] ? "Updating..." : "Delivered"}
                  </button>
                )}
            </div>
          ))}
          <h4 className="font-semibold mt-2">Notifications</h4>
          {notifications.map((n) => (
            <p key={n._id} className="text-sm border-b pb-1">
              {n.message}
            </p>
          ))}
        </div>
      </PageCard>
    </div>
  );
}
