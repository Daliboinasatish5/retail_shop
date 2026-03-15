import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ShopkeeperOrderPage() {
  const { products, wholesalers, createMultipleOrders } = useOutletContext();
  const [orderItems, setOrderItems] = useState([{ wholesalerId: "", productId: "", quantity: 1 }]);
  const [orderMessage, setOrderMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const productPriceMap = useMemo(
    () =>
      products.reduce((acc, product) => {
        acc[product._id] = Number(product.price || 0);
        return acc;
      }, {}),
    [products]
  );

  const grandTotal = useMemo(
    () =>
      orderItems.reduce((sum, item) => {
        const price = productPriceMap[item.productId] || 0;
        const qty = Math.max(1, Number(item.quantity) || 1);
        return sum + price * qty;
      }, 0),
    [orderItems, productPriceMap]
  );

  const updateItem = (index, field, value) => {
    setOrderItems((prev) =>
      prev.map((item, currentIndex) => {
        if (currentIndex !== index) return item;
        if (field === "wholesalerId") return { ...item, wholesalerId: value, productId: "" };
        if (field === "quantity") return { ...item, quantity: Math.max(1, Number(value) || 1) };
        return { ...item, [field]: value };
      })
    );
  };

  const addLine = () => {
    setOrderItems((prev) => [...prev, { wholesalerId: "", productId: "", quantity: 1 }]);
  };

  const removeLine = (index) => {
    setOrderItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, currentIndex) => currentIndex !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOrderMessage("");
      setIsSubmitting(true);

      const payload = orderItems
        .map((item) => ({
          productId: item.productId,
          quantity: Math.max(1, Number(item.quantity) || 1),
        }))
        .filter((item) => item.productId);

      const result = await createMultipleOrders(payload);

      if (result.failedCount === 0) {
        setOrderMessage(`All ${result.successCount} orders placed successfully`);
      } else {
        const firstError = result.failedMessages[0] || "Some orders failed";
        setOrderMessage(
          `Placed ${result.successCount} order(s), failed ${result.failedCount} order(s). ${firstError}`
        );
      }

      setOrderItems([{ wholesalerId: "", productId: "", quantity: 1 }]);
    } catch (error) {
      setOrderMessage(error.message || "Failed to place orders");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sk-page">
      <div className="sk-card">
        <div className="sk-card-head">Order from Wholesaler</div>
        <div className="sk-card-body">
      <form className="mx-auto w-full max-w-4xl space-y-3" onSubmit={handleSubmit}>
        {orderMessage && <p className="sk-soft text-sm sk-text">{orderMessage}</p>}

        {orderItems.map((item, index) => {
          const productsForLine = item.wholesalerId
            ? products.filter(
                (product) =>
                  String(product.wholesalerId?._id || product.wholesalerId) === String(item.wholesalerId)
              )
            : [];
          const unitPrice = productPriceMap[item.productId] || 0;
          const quantity = Math.max(1, Number(item.quantity) || 1);
          const lineTotal = unitPrice * quantity;

          return (
            <div key={index} className="sk-row-card space-y-2">
              <select
                className="sk-input sk-select"
                value={item.wholesalerId}
                onChange={(e) => updateItem(index, "wholesalerId", e.target.value)}
              >
                <option value="">Select wholesaler</option>
                {wholesalers.map((wholesaler) => (
                  <option key={wholesaler._id} value={wholesaler._id}>
                    {wholesaler.name}
                  </option>
                ))}
              </select>

              <select
                className="sk-input sk-select"
                value={item.productId}
                onChange={(e) => updateItem(index, "productId", e.target.value)}
                disabled={!item.wholesalerId}
              >
                <option value="">{item.wholesalerId ? "Select product" : "Select wholesaler first"}</option>
                {productsForLine.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} ({product.quantity})
                  </option>
                ))}
              </select>

              <input
                className="sk-input"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />

              <p className="text-xs sk-muted">Unit Price: ₹{unitPrice} | Line Total: ₹{lineTotal}</p>

              <button
                type="button"
                onClick={() => removeLine(index)}
                disabled={orderItems.length === 1}
                className="text-xs text-rose-400 disabled:opacity-40"
              >
                Remove line
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="sk-input"
          style={{ cursor: "pointer", textAlign: "center", color: "#34d399" }}
          onClick={addLine}
        >
          Add Another Product
        </button>

        <p className="text-sm font-semibold sk-text">Grand Total: ₹{grandTotal}</p>

        <button disabled={isSubmitting} className="sk-btn-primary w-full disabled:opacity-60">
          {isSubmitting ? "Placing Orders..." : "Place All Orders"}
        </button>
      </form>
        </div>
      </div>
    </div>
  );
}
