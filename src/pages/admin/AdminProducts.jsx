import { useMemo, useState } from "react";
import { AlertTriangle, Eye, Pencil, Plus } from "lucide-react";
import { productsAPI } from "../../lib/api";
import { products as seedProducts } from "../../data";
import ProductItemForm from "../../components/admin/ProductItemForm";
import { title } from "./AdminDashboard";

const storageKey = "yubiAdminProducts";

function readStoredProducts() {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || "null") || seedProducts;
  } catch {
    return seedProducts;
  }
}

function normalizeProduct(product) {
  if (product.category !== "spices") return product;
  const variants = product.variants?.length
    ? product.variants
    : (product.sizes || [product.unit || "250g"]).map((weight, index) => ({ weight, stock: index === 0 ? 8 : 25 }));
  return { ...product, variants, sizes: variants.map((variant) => variant.weight) };
}

export default function AdminProducts() {
  const [tab, setTab] = useState("food");
  const [items, setItems] = useState(() => readStoredProducts().map(normalizeProduct));
  const [modal, setModal] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const filtered = useMemo(() => items.filter((product) => product.category === tab), [items, tab]);
  const persist = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem(storageKey, JSON.stringify(nextItems));
  };

  const saveItem = async (payload) => {
    const nextItem = normalizeProduct({
      ...payload,
      id: payload.id || `${payload.category.toUpperCase()}-${Date.now()}`,
      rating: payload.rating || 4.6,
      reviews: payload.reviews || 0,
    });

    try {
      if (payload.id) {
        await productsAPI.updateProduct(payload.id, nextItem);
      } else {
        await productsAPI.createProduct(nextItem);
      }
    } catch (error) {
      console.warn("Product API unavailable, saved locally:", error);
    }

    persist(items.some((item) => item.id === nextItem.id) ? items.map((item) => (item.id === nextItem.id ? nextItem : item)) : [nextItem, ...items]);
    setModal(null);
  };

  return (
    <div style={{ color: "#1A1A1A" }}>
      <div className="admin-page-head">
        <div>
          <h1 style={{ ...title, fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", marginBottom: 12 }}>Products</h1>
          <div className="admin-tabs">
            <button className={tab === "food" ? "active" : ""} onClick={() => setTab("food")}>Food</button>
            <button className={tab === "spices" ? "active" : ""} onClick={() => setTab("spices")}>Spices</button>
          </div>
        </div>
        <button className="admin-add-btn" onClick={() => setModal({ type: tab })}><Plus size={18} /> Create Item</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>{(tab === "food" ? ["Image", "Name", "Category", "Price", "Type", "Status", "Badge", "Actions"] : ["Image", "Name", "Category", "Variants", "Price", "Low Stock", "Status", "Actions"]).map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {filtered.map((product) => tab === "food" ? (
              <tr key={product.id}>
                <td data-label="Image"><Thumb product={product} /></td>
                <td data-label="Name">{product.name}</td>
                <td data-label="Category">{product.foodCategory || "All Food"}</td>
                <td data-label="Price">Rs {product.price}</td>
                <td data-label="Type">{product.isVeg === false ? "Non-Veg" : "Veg"}</td>
                <td data-label="Status"><Status inStock={product.inStock} /></td>
                <td data-label="Badge">{product.badge || "-"}</td>
                <td data-label="Actions"><Actions product={product} onView={setViewItem} onEdit={(item) => setModal({ type: "food", item })} /></td>
              </tr>
            ) : (
              <tr key={product.id}>
                <td data-label="Image"><Thumb product={product} /></td>
                <td data-label="Name">{product.name}</td>
                <td data-label="Category">{product.spiceCategory || "All Spices"}</td>
                <td data-label="Variants"><VariantPills variants={product.variants || []} /></td>
                <td data-label="Price">Rs {product.price}</td>
                <td data-label="Low Stock">{(product.variants || []).some((variant) => Number(variant.stock) < 10) ? <span className="stock-alert"><AlertTriangle size={13} /> Low</span> : "-"}</td>
                <td data-label="Status"><Status inStock={product.inStock} /></td>
                <td data-label="Actions"><Actions product={product} onView={setViewItem} onEdit={(item) => setModal({ type: "spices", item })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <AdminModal title={modal.item ? `Edit ${modal.type === "food" ? "Food" : "Spice"} Item` : `Create ${modal.type === "food" ? "Food" : "Spice"} Item`} onClose={() => setModal(null)}>
          <ProductItemForm type={modal.type} initialItem={modal.item} submitLabel={modal.item ? "Update Item" : "Save Item"} onSubmit={saveItem} onCancel={() => setModal(null)} />
        </AdminModal>
      )}

      {viewItem && (
        <AdminModal title="Product Details" onClose={() => setViewItem(null)} maxWidth={680}>
          <div className="admin-product-view">
            <img src={viewItem.image} alt={viewItem.name} />
            <div>
              <h2>{viewItem.name}</h2>
              <p>{viewItem.description}</p>
              <strong>Rs {viewItem.price}</strong>
              {viewItem.category === "spices" && <VariantPills variants={viewItem.variants || []} />}
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
}

export function AdminModal({ title, onClose, children, maxWidth = 620 }) {
  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal admin-modal--wide" style={{ maxWidth }} onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal__head"><h3 className="admin-modal__title">{title}</h3><button className="admin-modal__x" onClick={onClose}>x</button></div>
        <div className="admin-modal__body">{children}</div>
      </div>
    </div>
  );
}

function Thumb({ product }) {
  return <img src={product.image} alt={product.name} style={{ width: 52, height: 52, borderRadius: 10, objectFit: "cover", border: "2px solid #E8F5E9" }} />;
}

function Status({ inStock }) {
  return <span className={inStock ? "status-pill status-pill--ok" : "status-pill status-pill--danger"}>{inStock ? "In Stock" : "Out of Stock"}</span>;
}

function Actions({ product, onView, onEdit }) {
  return <div className="admin-row-actions"><button onClick={() => onView(product)} aria-label={`View ${product.name}`}><Eye size={16} /></button><button onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`}><Pencil size={16} /></button></div>;
}

function VariantPills({ variants }) {
  return <div className="variant-pills">{variants.map((variant) => <span className={Number(variant.stock) < 10 ? "variant-pill variant-pill--low" : "variant-pill"} key={variant.weight}>{variant.weight}: {variant.stock}</span>)}</div>;
}
