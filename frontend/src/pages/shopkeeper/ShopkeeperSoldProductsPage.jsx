import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import PageCard from "../../components/PageCard";

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
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <PageCard title="Total Quantity Sold">{soldQuantity}</PageCard>
        <PageCard title="Total Amount Sold">₹{soldAmount}</PageCard>
      </div>

      <PageCard title="Sold Products">
        {soldOrders.length === 0 ? (
          <p className="text-sm text-slate-500">No sold products yet.</p>
        ) : (
          sortedDates.map((dateKey) => {
            const dateOrders = groupedByDate[dateKey];
            const dateTotal = dateOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

            return (
              <div key={dateKey} className="mb-3 rounded-lg border p-3">
                <p className="font-semibold text-slate-800">Date: {dateKey}</p>
                <p className="text-sm text-slate-600 mb-2">Sold Amount: ₹{dateTotal}</p>
                {dateOrders.map((order) => (
                  <p key={order._id} className="text-sm border-b py-1 last:border-b-0">
                    {order.productId?.name} | Qty: {order.quantity} | ₹{order.totalPrice} | {order.status}
                  </p>
                ))}
              </div>
            );
          })
        )}
      </PageCard>
    </div>
  );
}
