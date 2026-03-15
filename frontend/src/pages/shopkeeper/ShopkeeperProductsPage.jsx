import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function ShopkeeperProductsPage() {
  const {
    products,
    wholesalers,
    selectedCategory,
    setSelectedCategory,
    selectedWholesalerId,
    setSelectedWholesalerId,
    inventory,
    createOrderFromProduct,
  } = useOutletContext();
  const [orderQtyByProduct, setOrderQtyByProduct] = useState({});
  const [orderMessage, setOrderMessage] = useState("");

  const filteredInventory = useMemo(() => {
    if (!selectedCategory) return inventory;
    return inventory.filter((item) => item.productId?.category === selectedCategory);
  }, [inventory, selectedCategory]);

  const selectedWholesalerProducts = useMemo(() => {
    const byWholesaler = selectedWholesalerId
      ? products.filter((product) => String(product.wholesalerId?._id || product.wholesalerId) === String(selectedWholesalerId))
      : products;

    if (!selectedCategory) return byWholesaler;
    return byWholesaler.filter((product) => product.category === selectedCategory);
  }, [products, selectedWholesalerId, selectedCategory]);

  const placeOrder = async (productId) => {
    try {
      setOrderMessage("");
      const qty = Math.max(1, Number(orderQtyByProduct[productId] || 1));
      await createOrderFromProduct(productId, qty);
      setOrderMessage("Order placed successfully");
    } catch (error) {
      setOrderMessage(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="sk-page space-y-4">
      <div className="sk-card">
        <div className="sk-card-head">Filter Products by Category</div>
        <div className="sk-card-body">
          <div className="sk-row-card space-y-3">
            <div className="sk-field">
              <label className="sk-label">Wholesaler</label>
              <select
                className="sk-input sk-select"
                value={selectedWholesalerId}
                onChange={(e) => setSelectedWholesalerId(e.target.value)}
              >
                <option value="">All Wholesalers</option>
                {wholesalers.map((wholesaler) => (
                  <option key={wholesaler._id} value={wholesaler._id}>
                    {wholesaler.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sk-field">
              <label className="sk-label">Category</label>
              <select
                className="sk-input sk-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="groceries">Groceries</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="sk-card">
        <div className="sk-card-head">Wholesaler Product List (Order From Here)</div>
        <div className="sk-card-body">
        {orderMessage && <p className="mb-2 text-sm" style={{ color: "#34d399" }}>{orderMessage}</p>}
        <div className="sk-products-grid max-h-[24rem] overflow-auto pr-1">
          {selectedWholesalerProducts.length === 0 ? (
            <p className="text-sm sk-muted">No wholesaler products found for selected filters.</p>
          ) : (
            selectedWholesalerProducts.map((product) => (
              <div key={product._id} className="sk-product-card">
                {(() => {
                  const qty = Math.max(1, Number(orderQtyByProduct[product._id] || 1));
                  const total = qty * Number(product.price || 0);

                  return (
                    <>
                      <p className="font-medium sk-text">{product.name}</p>
                      <p className="text-sm sk-text">
                        {product.category} | Stock: {product.quantity} | Unit Price: ₹{product.price}
                      </p>
                      <p className="text-xs sk-muted">Wholesaler: {product.wholesalerId?.name}</p>
                      <p className="text-xs mt-1" style={{ color: "#34d399" }}>Selected Qty Total: ₹{total}</p>

                      <div className="sk-product-controls">
                        <input
                          type="number"
                          min="1"
                          className="sk-input sk-qty-input"
                          value={orderQtyByProduct[product._id] || 1}
                          onChange={(e) =>
                            setOrderQtyByProduct((prev) => ({
                              ...prev,
                              [product._id]: Math.max(1, Number(e.target.value || 1)),
                            }))
                          }
                        />
                        <button className="sk-btn-primary px-3 py-1" onClick={() => placeOrder(product._id)}>
                          Order
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            ))
          )}
        </div>
        </div>
      </div>

      <div className="sk-card">
        <div className="sk-card-head">My Products (Delivered Orders Only)</div>
        <div className="sk-card-body">
        <div className="space-y-2 max-h-[28rem] overflow-auto">
          {filteredInventory.length === 0 && (
            <p className="text-sm sk-muted">
              No products yet. Place an order, wait for wholesaler acceptance, then mark delivered in Activity.
            </p>
          )}

          {filteredInventory.map((item) => (
            <div key={item._id} className="sk-row-card">
              <p className="font-medium sk-text">{item.productId?.name}</p>
              <p className="text-sm sk-text">
                {item.productId?.category} | Qty: {item.quantity} | ₹{item.price}
              </p>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
