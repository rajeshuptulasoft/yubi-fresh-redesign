import { useState } from "react";
import { Plus } from "lucide-react";
import { orders, deliveryPartners, products as seedProducts } from "../../data";
import { productsAPI } from "../../lib/api";
import ProductItemForm from "../../components/admin/ProductItemForm";
import { title, StatusBadge } from "./AdminDashboard";
import { AdminModal } from "./AdminProducts";

export default function AdminOrderDetailsFood() {
  return <Details type="food" />;
}

export function Details({ type }) {
  const [open, setOpen] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const rows = orders.filter((order) => order.orderType === type);

  const saveProduct = async (payload) => {
    const nextItem = { ...payload, id: `${payload.category.toUpperCase()}-${Date.now()}`, rating: 4.6, reviews: 0 };
    try {
      await productsAPI.createProduct(nextItem);
    } catch (error) {
      console.warn("Product API unavailable, saved locally:", error);
    }
    const current = JSON.parse(localStorage.getItem("yubiAdminProducts") || "null") || seedProducts;
    localStorage.setItem("yubiAdminProducts", JSON.stringify([nextItem, ...current]));
    setShowCreate(false);
  };

  return (
    <div>
      <div className="admin-page-head">
        <h1 style={{ ...title, fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}>Order Details - {type}</h1>
        {type === "food" && (
          <button className="admin-add-btn admin-add-btn--icon" onClick={() => setShowCreate(true)} aria-label="Create food item">
            <Plus size={20} />
          </button>
        )}
      </div>
      {rows.map((order) => (
        <div key={order.id} style={{ background: "#fff", border: "1px solid #D6E8D6", borderRadius: 8, marginBottom: 10, color: "#1A1A1A" }}>
          <div onClick={() => setOpen(open === order.id ? null : order.id)} style={{ padding: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 12 }}>
            <strong>{order.id} - {order.customerName}</strong>
            <StatusBadge status={order.orderStatus} />
          </div>
          {open === order.id && (
            <div style={{ padding: 14, borderTop: "1px solid #D6E8D6" }}>
              <p><strong>Address:</strong> {order.customerAddress}</p>
              <p><strong>Payment:</strong> {order.paymentMethod} ({order.paymentStatus})</p>
              <p><strong>Delivery Partner:</strong> {(deliveryPartners.find((partner) => partner.id === order.deliveryPartnerId) || {}).name || "Not assigned"}</p>
              <p><strong>Timeline:</strong> Pending &gt; Preparing &gt; Out for Delivery &gt; Delivered</p>
              {order.items.map((item) => <div key={item.productId}>{item.name} x {item.quantity} - Rs {item.price}</div>)}
            </div>
          )}
        </div>
      ))}
      {showCreate && (
        <AdminModal title="Create Food Item" onClose={() => setShowCreate(false)}>
          <ProductItemForm type="food" onSubmit={saveProduct} onCancel={() => setShowCreate(false)} />
        </AdminModal>
      )}
    </div>
  );
}
