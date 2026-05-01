import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { products, banners } from "../../data";
import { useCart } from "../../context/CartContext";
import { useWindowSize } from "../../hooks/useWindowSize";

export const colors = { green: "#4CAF50", dark: "#1A2E1A", text: "#1A1A1A", border: "#D6E8D6" };
export const heading = { color: colors.dark, fontSize: 34, margin: "0 0 22px", fontWeight: 800 };
export const greenButton = { background: "linear-gradient(135deg, #4CAF50, #388E3C)", color: "#FFFFFF", border: "none", borderRadius: 12, padding: "10px 18px", cursor: "pointer", fontWeight: 800, boxShadow: "0 4px 14px rgba(76,175,80,0.28)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 };

export function BannerSlider({ items = banners }) {
  const [active, setActive] = useState(0);
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  useEffect(() => {
    const id = setInterval(() => setActive((value) => (value + 1) % items.length), 3500);
    return () => clearInterval(id);
  }, [items.length]);
  const banner = items[active];
  return <section style={{ position: "relative", height: isMobile ? 260 : 430, overflow: "hidden", background: "#101810", display: "flex", alignItems: "center", padding: isMobile ? "24px 16px" : "80px 40px" }}>
    <img src={banner.image} alt={banner.headline} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
    <div style={{
      position: "absolute",
      inset: 0,
      background: isMobile
        ? "linear-gradient(90deg, rgba(7, 10, 7, 0.82) 0%, rgba(7, 10, 7, 0.58) 62%, rgba(7, 10, 7, 0.22) 100%)"
        : "linear-gradient(90deg, rgba(7, 10, 7, 0.78) 0%, rgba(7, 10, 7, 0.56) 42%, rgba(7, 10, 7, 0.22) 72%, rgba(7, 10, 7, 0.06) 100%)",
    }} />
    <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
      <h1 style={{ color: "#ffffff", fontSize: isMobile ? 32 : 60, margin: 0, fontWeight: 900, maxWidth: 720 }}>{banner.headline}</h1>
      <p style={{ color: "#ffffff", fontSize: isMobile ? 15 : 21, margin: "12px 0 24px", maxWidth: 560, fontWeight: 700 }}>{banner.subheadline}</p>
      <Link to={banner.route} style={{ background: colors.green, color: "#FFFFFF", padding: "12px 22px", borderRadius: 8, textDecoration: "none", fontWeight: 800 }}>{banner.cta}</Link>
    </div>
  </section>;
}

export function CategoryImageSection({ title = "Categories", items, titleInCard = false }) {
  const { width } = useWindowSize();
  const columns = width <= 768 ? "repeat(2, minmax(0, 1fr))" : width <= 1024 ? "repeat(3, minmax(0, 1fr))" : "repeat(5, minmax(0, 1fr))";
  return <section style={{ padding: width <= 768 ? "28px 16px" : "60px 40px", maxWidth: 1280, margin: "0 auto" }}>
    {titleInCard ? <div className="category-section-title-card"><h2 style={{ ...heading, margin: 0 }}>{title}</h2></div> : <h2 style={heading}>{title}</h2>}
    <div style={{ display: "grid", gridTemplateColumns: columns, gap: 16 }}>
      {items.map((item) => <Link key={item.name} to={item.route || "#"} className="category-image-card">
        <div className="category-image-card__media"><img src={item.image} alt={item.name} /></div>
        <div className="category-image-card__label" style={{ fontSize: width <= 768 ? 14 : 15 }}>{item.name}</div>
      </Link>)}
    </div>
  </section>;
}

export function ProductCard({ product, compact = false }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const isSpice = product.category === "spices";
  return <div onClick={() => navigate(`/product/${product.id}`)} className={compact ? "product-card product-card--compact" : "product-card"} style={{ minWidth: compact ? 200 : 0, flexShrink: 0 }}>
    <div className="product-card__media">
      <img src={product.image} alt={product.name} />
    </div>
    <div className="product-card__body">
      <div style={{ display: "flex", gap: 4, alignItems: "center", color: "#FF6F00", fontSize: 12 }}><Star size={12} fill="currentColor" /> {product.rating || 4.7}</div>
      <h3 style={{ color: colors.text, fontSize: compact ? 14 : 16, margin: "8px 0 10px", minHeight: 38 }}>{product.name}</h3>
      <p className="product-description" style={{ color: "#6B7280", fontSize: 13, lineHeight: 1.4, margin: "0 0 10px" }}>{product.description || "Premium quality product"}</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: "auto" }}>
        <strong style={{ color: colors.dark }}>₹{product.price}</strong>
        {isSpice ? null : <button className="standard-add-btn" onClick={(event) => { event.stopPropagation(); addItem({ key: product.id, productId: product.id, name: product.name, price: product.price, image: product.image }); }} style={greenButton}><ShoppingCart size={15} /> Add</button>}
      </div>
      {isSpice && <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
        <button onClick={(event) => { event.stopPropagation(); setShowEnquiryModal(true); }} onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F8F1")} onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")} style={enquiryButtonStyle}>📩 Enquiry</button>
        <button className="standard-add-btn" onClick={(event) => { event.stopPropagation(); addItem({ key: product.id, productId: product.id, name: product.name, price: product.price, image: product.image }); }} style={{ ...greenButton, flex: 1, fontSize: "13px" }}><ShoppingCart size={15} /> Add to Cart</button>
      </div>}
    </div>
    {showEnquiryModal && <EnquiryModal product={product} onClose={() => setShowEnquiryModal(false)} />}
  </div>;
}

export function ProductGridSection({ title = "Popular Products", items }) {
  const { width } = useWindowSize();
  const columns = width <= 768 ? "1fr" : width <= 1024 ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))";
  return <section style={{ padding: width <= 768 ? "28px 16px" : "60px 40px", maxWidth: 1280, margin: "0 auto" }}>
    <h2 style={heading}>{title}</h2>
    <div style={{ display: "grid", gridTemplateColumns: columns, gap: 18, alignItems: "stretch" }}>{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>
  </section>;
}

function EnquiryModal({ product, onClose }) {
  const [enquiryForm, setEnquiryForm] = useState({ name: "", email: "", phone: "", address: "", quantity: "", unit: "grams (g)", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const resetAndClose = () => {
    setEnquiryForm({ name: "", email: "", phone: "", address: "", quantity: "", unit: "grams (g)", message: "" });
    setErrors({});
    setSuccess(false);
    onClose();
  };

  const submit = () => {
    const nextErrors = {};
    ["name", "email", "phone", "address", "quantity"].forEach((field) => {
      if (!enquiryForm[field]) nextErrors[field] = "This field is required";
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setTimeout(() => {
      console.log("Enquiry submitted:", { spice: product.name, ...enquiryForm });
      setLoading(false);
      setSuccess(true);
      setTimeout(resetAndClose, 3000);
    }, 350);
  };

  return createPortal(<div onClick={(event) => { event.stopPropagation(); resetAndClose(); }} style={modalOverlayStyle}>
    <div style={modalCenterWrap}>
    <div onClick={(event) => event.stopPropagation()} style={{ ...modalCardStyle, maxWidth: "520px" }}>
      <div style={modalHeaderStyle}>
        <div><h2 style={modalTitleStyle}>Product Enquiry</h2><p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{product.name}</p></div>
        <button onClick={resetAndClose} style={modalCloseStyle}>×</button>
      </div>
      {success ? <div style={{ padding: "36px 28px", textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#4CAF50", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 900, margin: "0 auto 18px" }}>✓</div>
        <h3 style={{ color: "#1A2E1A", fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>Enquiry Submitted!</h3>
        <p style={{ color: "#1A1A1A", lineHeight: 1.5 }}>We'll contact you within 24 hours regarding your enquiry for {product.name}.</p>
        <button onClick={resetAndClose} style={{ ...outlineModalButton, marginTop: 20 }}>Close</button>
      </div> : <>
        <div style={{ padding: "28px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#F1F8F1", padding: "12px 16px", borderRadius: "12px", marginBottom: "24px" }}>
            <img src={product.image} alt={product.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
            <div><div style={{ fontWeight: 800, fontSize: 15, color: "#1A2E1A" }}>{product.name}</div><div style={{ color: "#4CAF50", fontSize: 14, fontWeight: 700 }}>₹{product.price}</div></div>
          </div>
          <ModalField label="Full Name *" error={errors.name}><input placeholder="Your full name" value={enquiryForm.name} onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })} style={modalInputStyle} onFocus={focusGreen} onBlur={blurGreen} /></ModalField>
          <ModalField label="Email Address *" error={errors.email}><input type="email" placeholder="your@email.com" value={enquiryForm.email} onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })} style={modalInputStyle} onFocus={focusGreen} onBlur={blurGreen} /></ModalField>
          <ModalField label="Phone Number *" error={errors.phone}><input type="tel" maxLength={13} placeholder="+91 XXXXX XXXXX" value={enquiryForm.phone} onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })} style={modalInputStyle} onFocus={focusGreen} onBlur={blurGreen} /></ModalField>
          <ModalField label="Delivery Address *" error={errors.address}><textarea placeholder="Full delivery address" value={enquiryForm.address} onChange={(e) => setEnquiryForm({ ...enquiryForm, address: e.target.value })} style={{ ...modalInputStyle, minHeight: 70, resize: "vertical" }} onFocus={focusGreen} onBlur={blurGreen} /></ModalField>
          <ModalField label="Quantity Required *" error={errors.quantity}><div style={{ display: "flex", gap: 12 }}><input type="number" placeholder="e.g. 5" value={enquiryForm.quantity} onChange={(e) => setEnquiryForm({ ...enquiryForm, quantity: e.target.value })} style={{ ...modalInputStyle, flex: 1 }} onFocus={focusGreen} onBlur={blurGreen} /><select value={enquiryForm.unit} onChange={(e) => setEnquiryForm({ ...enquiryForm, unit: e.target.value })} style={{ ...modalInputStyle, flex: 1 }} onFocus={focusGreen} onBlur={blurGreen}><option>grams (g)</option><option>Kilograms (kg)</option><option>Pieces</option><option>Packets</option></select></div></ModalField>
          <ModalField label="Additional Message"><textarea placeholder="Any special requirements, custom blend requests, packaging needs..." value={enquiryForm.message} onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })} style={{ ...modalInputStyle, minHeight: 80, resize: "vertical" }} onFocus={focusGreen} onBlur={blurGreen} /></ModalField>
        </div>
        <div style={{ padding: "16px 28px 24px", display: "flex", gap: 12, justifyContent: "flex-end" }}><button onClick={resetAndClose} style={outlineModalButton}>Cancel</button><button disabled={loading} onClick={submit} style={{ ...primaryModalButton, opacity: loading ? 0.7 : 1 }}>{loading ? "Submitting..." : "📩 Submit Enquiry"}</button></div>
      </>}
    </div>
    </div>
  </div>, document.body);
}

function ModalField({ label, error, children }) {
  return <div style={{ marginBottom: 18 }}><label style={{ color: "#1A2E1A", fontSize: 14, fontWeight: 600, marginBottom: 6, display: "block" }}>{label}</label>{children}{error && <p style={{ color: "#EF4444", fontSize: 12, fontWeight: 700, margin: "6px 0 0" }}>{error}</p>}</div>;
}

const enquiryButtonStyle = { background: "#FFFFFF", color: "#4CAF50", border: "2px solid #4CAF50", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" };
const modalOverlayStyle = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", zIndex: 2147483647, padding: "16px", animation: "fadeIn 0.2s ease", overflowY: "auto" };
const modalCenterWrap = { minHeight: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" };
const modalCardStyle = { background: "#FFFFFF", borderRadius: "24px", width: "min(520px, calc(100vw - 32px))", maxHeight: "calc(100vh - 48px)", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", boxShadow: "0 24px 80px rgba(0,0,0,0.18)", animation: "slideUp 0.3s ease", position: "relative", zIndex: 1 };
const modalHeaderStyle = { background: "linear-gradient(135deg, #4CAF50, #388E3C)", padding: "22px 28px", borderRadius: "24px 24px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 1 };
const modalTitleStyle = { color: "#FFFFFF", fontSize: "20px", fontWeight: "700", fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 };
const modalCloseStyle = { background: "rgba(255,255,255,0.2)", border: "none", color: "#FFFFFF", width: "36px", height: "36px", borderRadius: "50%", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", lineHeight: 1 };
const modalInputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #E8F5E9", fontSize: "15px", color: "#1A1A1A", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#FFFFFF" };
const outlineModalButton = { background: "#FFFFFF", color: "#4CAF50", border: "2px solid #4CAF50", padding: "11px 28px", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer" };
const primaryModalButton = { background: "linear-gradient(135deg, #4CAF50, #388E3C)", color: "#FFFFFF", border: "none", padding: "13px 32px", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 16px rgba(76,175,80,0.35)" };
function focusGreen(event) { event.target.style.borderColor = "#4CAF50"; }
function blurGreen(event) { event.target.style.borderColor = "#E8F5E9"; }

export function AutoScrollProducts({ items }) {
  const { width } = useWindowSize();
  return <section style={{ padding: width <= 768 ? "28px 16px" : "60px 40px", maxWidth: 1280, margin: "0 auto" }}>
    <style>{`@keyframes scrollLeft{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.popular-marquee:hover .popular-track{animation-play-state:paused}`}</style>
    <h2 style={heading}>Popular Products</h2>
    <div className="popular-marquee" style={{ overflow: "hidden" }}><div className="popular-track" style={{ display: "flex", gap: 16, animation: "scrollLeft 20s linear infinite", width: "max-content" }}>{[...items, ...items].map((product, index) => <ProductCard key={`${product.id}-${index}`} product={product} compact={width <= 768} />)}</div></div>
  </section>;
}

export function GallerySection({ items = products.slice(0, 6) }) {
  const { width } = useWindowSize();
  return <section style={{ padding: width <= 768 ? "28px 16px" : "60px 40px", maxWidth: 1280, margin: "0 auto" }}><h2 style={heading}>Gallery</h2><div style={{ display: "grid", gridTemplateColumns: width <= 768 ? "repeat(2,1fr)" : "repeat(3,1fr)", gap: 12 }}>{items.slice(0, 6).map((product) => <img key={product.id} src={product.image} alt={product.name} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", borderRadius: 10 }} />)}</div></section>;
}

export function buildCategoryItems(list, route = "#") {
  const grouped = new Map();
  list.forEach((product) => {
    const label = product.subCategory || product.categoryLabel || product.category || "Products";
    if (!grouped.has(label)) grouped.set(label, { name: label[0].toUpperCase() + label.slice(1), image: product.image, route });
  });
  return [...grouped.values()];
}

export function RiderAnimation() { return <div style={{ width: 180, height: 80, overflow: "hidden", position: "relative" }}><style>{`@keyframes rideLeft{0%{transform:translateX(180px)}100%{transform:translateX(-180px)}}`}</style><div style={{ position: "absolute", bottom: 10, width: "100%", height: 2, background: "#333333" }} /><div style={{ position: "absolute", top: 24, animation: "rideLeft 3s linear infinite" }}><div style={{ position: "relative", width: 90, height: 42 }}><div style={{ position: "absolute", left: 18, top: 18, width: 54, height: 16, borderRadius: 12, background: colors.green }} /><div style={{ position: "absolute", left: 8, top: 30, width: 18, height: 18, borderRadius: "50%", background: "#333333" }} /><div style={{ position: "absolute", left: 62, top: 30, width: 18, height: 18, borderRadius: "50%", background: "#333333" }} /><div style={{ position: "absolute", left: 42, top: 0, width: 14, height: 26, borderRadius: 8, background: "#FF6F00" }} /><div style={{ position: "absolute", left: 44, top: -12, width: 16, height: 16, borderRadius: "50%", background: "#F4C7A1" }} /><div style={{ position: "absolute", left: 24, top: 4, width: 18, height: 22, borderRadius: 4, background: "#8B4513" }} /></div></div></div>; }
export function TruckAnimation() { return <div style={{ width: 220, height: 90, overflow: "hidden", position: "relative" }}><style>{`@keyframes truckMove{0%{transform:translateX(220px)}100%{transform:translateX(-220px)}}@keyframes smoke{0%{opacity:0;transform:scale(.6)}50%{opacity:.5}100%{opacity:0;transform:scale(1.3)}}`}</style><div style={{ position: "absolute", top: 24, animation: "truckMove 4s linear infinite" }}><div style={{ position: "relative", width: 130, height: 56 }}><div style={{ position: "absolute", left: 0, top: 18, width: 38, height: 28, background: "#388E3C", borderRadius: 4 }} /><div style={{ position: "absolute", left: 36, top: 8, width: 82, height: 38, background: colors.green, borderRadius: 4, color: "#FFFFFF", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>YUBI</div><div style={{ position: "absolute", left: 18, top: 44, width: 18, height: 18, borderRadius: "50%", background: "#222222" }} /><div style={{ position: "absolute", left: 88, top: 44, width: 18, height: 18, borderRadius: "50%", background: "#222222" }} /><div style={{ position: "absolute", left: -18, top: 12, width: 12, height: 12, borderRadius: "50%", background: "gray", animation: "smoke 1s infinite" }} /><div style={{ position: "absolute", left: -30, top: 5, width: 10, height: 10, borderRadius: "50%", background: "gray", animation: "smoke 1s .3s infinite" }} /></div></div></div>; }
