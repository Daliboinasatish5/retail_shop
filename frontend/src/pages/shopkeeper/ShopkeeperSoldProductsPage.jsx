import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";

export default function ShopkeeperSoldProductsPage() {
  const { orders, currentUserId } = useOutletContext();

  const soldOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.orderType === "customer_order" &&
          order.status === "delivered" &&
          String(order.sellerId?._id || order.sellerId) === String(currentUserId)
      ),
    [orders, currentUserId]
  );

  const soldQuantity = soldOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);
  const soldAmount = soldOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const groupedByDate = soldOrders.reduce((accumulator, order) => {
    const dateKey = order.createdAt ? new Date(order.createdAt).toISOString().slice(0, 10) : "Unknown";
    if (!accumulator[dateKey]) {
      accumulator[dateKey] = [];
    }
    accumulator[dateKey].push(order);
    return accumulator;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="sk-page space-y-4">
      <div className="sk-stat-grid-2">
        <div className="sk-stat-card">
          <div className="sk-stat-label">Total Quantity Sold</div>
          <div className="sk-stat-num">{soldQuantity}</div>
        </div>
        <div className="sk-stat-card">
          <div className="sk-stat-label">Total Amount Sold</div>
          <div className="sk-stat-num">₹{soldAmount}</div>
        </div>
      </div>

      <div className="sk-card">
        <div className="sk-card-head">Sold Products</div>
        <div className="sk-card-body">
        {soldOrders.length === 0 ? (
          <p className="text-sm sk-muted">No sold products yet.</p>
        ) : (
          sortedDates.map((dateKey) => {
            const dateOrders = groupedByDate[dateKey];
            const dateTotal = dateOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

            return (
              <div key={dateKey} className="mb-3 sk-row-card">
                <p className="font-semibold sk-text">Date: {dateKey}</p>
                <p className="text-sm sk-muted mb-2">Sold Amount: ₹{dateTotal}</p>
                {dateOrders.map((order) => (
                  <p key={order._id} className="text-sm sk-text border-b border-white/10 py-1 last:border-b-0">
                    {order.productId?.name} | Qty: {order.quantity} | ₹{order.totalPrice} | {order.status}
                  </p>
                ))}
              </div>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}
