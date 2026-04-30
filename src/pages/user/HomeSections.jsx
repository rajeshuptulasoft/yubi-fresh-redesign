import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { products, banners } from "../../data";
import { useCart } from "../../context/CartContext";
import { useWindowSize } from "../../hooks/useWindowSize";

export const colors = { green: "#4CAF50", dark: "#1A2E1A", text: "#1A1A1A", border: "#D6E8D6" };
export const heading = { color: colors.dark, fontSize: 34, margin: "0 0 22px", fontWeight: 800 };
export const greenButton = { background: colors.green, color: "#FFFFFF", border: "none", borderRadius: 8, padding: "8px 12px", cursor: "pointer", fontWeight: 700 };

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
    <img src={banner.image} alt={banner.headline} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.48 }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(12,31,13,0.88), rgba(12,31,13,0.48), rgba(12,31,13,0.20))" }} />
    <div style={{ position: "relative", maxWidth: 1180, margin: "0 auto", width: "100%" }}>
      <h1 style={{ color: "#FFFFFF", fontSize: isMobile ? 32 : 60, margin: 0, fontWeight: 900, maxWidth: 720 }}>{banner.headline}</h1>
      <p style={{ color: "#F1F8F1", fontSize: isMobile ? 15 : 21, margin: "12px 0 24px", maxWidth: 560 }}>{banner.subheadline}</p>
      <Link to={banner.route} style={{ background: colors.green, color: "#FFFFFF", padding: "12px 22px", borderRadius: 8, textDecoration: "none", fontWeight: 800 }}>{banner.cta}</Link>
    </div>
    <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
      {items.map((item, index) => <button key={item.id} onClick={() => setActive(index)} aria-label={`Go to banner ${index + 1}`} style={{ width: active === index ? 24 : 10, height: 10, borderRadius: 10, border: "none", background: active === index ? colors.green : "rgba(255,255,255,0.75)", cursor: "pointer" }} />)}
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
        <button onClick={(event) => { event.stopPropagation(); addItem({ key: product.id, productId: product.id, name: product.name, price: product.price, image: product.image }); }} style={greenButton}>Add</button>
      </div>
    </div>
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
