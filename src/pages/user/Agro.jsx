import { useState, useMemo } from "react";
import { theme, fmtPrice } from "@/utils/theme";
import BackButton from "@/components/BackButton";
import { useCart } from "@/context/CartContext";
import { Search, Heart, Leaf, ShoppingBag, Zap, Filter, X } from "lucide-react";
import { toast } from "sonner";

const CATS = ["All", "Grains", "Pulses", "Seeds", "Fertilizers", "Tools", "Organic"];

const PRODUCTS = [
  { id: "agro-1", name: "Organic Brown Rice", category: "Grains", price: 180, bulkPrice: 150, weight: "5 kg", stock: true, organic: true, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop", desc: "Stone-aged organic brown rice, hand-picked from Karnataka farms." },
  { id: "agro-2", name: "Toor Dal (Split Pigeon Pea)", category: "Pulses", price: 220, bulkPrice: 195, weight: "2 kg", stock: true, organic: true, image: "https://images.unsplash.com/photo-1604908554027-39b32d6b0b62?w=600&auto=format&fit=crop", desc: "Premium-grade toor dal, polished naturally without chemicals." },
  { id: "agro-3", name: "Sunflower Seeds", category: "Seeds", price: 320, weight: "1 kg", stock: true, image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=600&auto=format&fit=crop", desc: "Roasted edible sunflower seeds — perfect for snacks and salads." },
  { id: "agro-4", name: "Vermicompost Fertilizer", category: "Fertilizers", price: 450, weight: "10 kg", stock: true, organic: true, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop", desc: "100% organic vermicompost, rich in micro-nutrients." },
  { id: "agro-5", name: "Stainless Steel Hand Trowel", category: "Tools", price: 280, weight: "1 pc", stock: true, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop", desc: "Durable hand trowel for kitchen gardens and small farms." },
  { id: "agro-6", name: "Organic Quinoa", category: "Grains", price: 540, bulkPrice: 480, weight: "1 kg", stock: false, organic: true, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop", desc: "High-protein white quinoa, naturally cultivated." },
  { id: "agro-7", name: "Mustard Seeds", category: "Seeds", price: 140, weight: "500 g", stock: true, image: "https://images.unsplash.com/photo-1599909533730-e8da99d6d8a4?w=600&auto=format&fit=crop", desc: "Aromatic black mustard seeds — essential for tempering." },
  { id: "agro-8", name: "Chickpeas (Kabuli)", category: "Pulses", price: 160, bulkPrice: 140, weight: "2 kg", stock: true, organic: true, image: "https://images.unsplash.com/photo-1604908554027-39b32d6b0b62?w=600&auto=format&fit=crop", desc: "Plump white chickpeas, slow-dried for premium texture." },
  { id: "agro-9", name: "Neem-Based Bio Pesticide", category: "Fertilizers", price: 380, weight: "1 L", stock: true, organic: true, image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop", desc: "Natural neem extract — protects crops, safe for pollinators." },
];

export default function Agro() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState(600);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState({});
  const [wish, setWish] = useState({});
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    let arr = PRODUCTS.filter((p) =>
      (cat === "All" || p.category === cat) &&
      p.price <= maxPrice &&
      (!inStockOnly || p.stock) &&
      (!search.trim() || p.name.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === "low") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "high") arr = [...arr].sort((a, b) => b.price - a.price);
    if (sort === "newest") arr = [...arr].reverse();
    return arr;
  }, [cat, search, maxPrice, inStockOnly, sort]);

  const add = (p) => {
    addItem({ id: p.id, name: p.name, price: p.price, image: p.image, qty: qty[p.id] || 1, kind: "agro" });
    toast.success(`${p.name} added to cart`);
  };
  const buyNow = (p) => { add(p); window.location.href = "/checkout"; };

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{
        position: "relative", padding: "60px 24px 80px",
        background: `linear-gradient(135deg, rgba(26,46,26,0.7), rgba(56,142,60,0.7)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop) center/cover`,
        color: "#fff",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <BackButton />
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(40px,6vw,72px)", margin: "20px 0 8px", color: "#fff" }}>YUBI Agro Products</h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.85)", maxWidth: 600 }}>Direct from the farm, pure and organic.</p>
          <div style={{ marginTop: 24, maxWidth: 560, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 16, top: 14, color: theme.colors.textDim }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search agro products..."
              style={{ width: "100%", padding: "13px 16px 13px 44px", borderRadius: 14, border: "none", outline: "none", fontSize: 15, background: "rgba(255,255,255,0.95)", color: theme.colors.text }} />
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "40px 24px 80px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 28 }} className="agro-layout">
        {/* Sidebar */}
        <aside className="agro-sidebar" style={{
          alignSelf: "start", position: "sticky", top: 90,
          background: theme.colors.surface, borderRadius: 20, padding: 22,
          border: `1px solid ${theme.colors.border}`,
        }}>
          <FilterBody {...{ cat, setCat, maxPrice, setMaxPrice, inStockOnly, setInStockOnly, sort, setSort }} />
        </aside>

        <div>
          <button onClick={() => setDrawerOpen(true)} style={{
            display: "none", padding: "10px 16px", borderRadius: 12, background: theme.gradient, color: "#fff",
            border: "none", cursor: "pointer", marginBottom: 16, alignItems: "center", gap: 8,
          }} className="agro-mobile-filter">
            <Filter size={16} /> Filters
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 22 }}>
            {filtered.map((p) => (
              <div key={p.id} className="ss-hover-lift" style={{
                background: "#fff", borderRadius: 20, overflow: "hidden",
                borderLeft: `4px solid ${theme.colors.primary}`,
                border: `1px solid ${theme.colors.border}`, borderLeftWidth: 4,
                boxShadow: "0 4px 18px rgba(76,175,80,0.08)", display: "flex", flexDirection: "column",
              }}>
                <div onClick={() => setSelected(p)} style={{ position: "relative", height: 200, overflow: "hidden", background: theme.colors.surfaceAlt, cursor: "pointer" }}>
                  <img src={p.image} alt={p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} />
                  {p.organic && (
                    <span style={{
                      position: "absolute", top: 12, left: 12, background: theme.gradient,
                      color: "#fff", padding: "6px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                      display: "inline-flex", alignItems: "center", gap: 4, fontFamily: theme.fonts.mono,
                    }}><Leaf size={11} /> ORGANIC</span>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); setWish((w) => ({ ...w, [p.id]: !w[p.id] })); }}
                    style={{ position: "absolute", top: 12, right: 12, width: 36, height: 36, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", color: wish[p.id] ? theme.colors.error : theme.colors.textDim, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.10)" }}>
                    <Heart size={16} fill={wish[p.id] ? theme.colors.error : "transparent"} />
                  </button>
                </div>
                <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontFamily: theme.fonts.heading, fontSize: 20, color: theme.colors.text, margin: 0 }}>{p.name}</h3>
                  <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.textDim, marginTop: 2 }}>{p.weight}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                    <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 18, color: theme.colors.primaryDark }}>{fmtPrice(p.price)}</span>
                    {p.bulkPrice && <span style={{ fontFamily: theme.fonts.mono, fontSize: 12, color: theme.colors.textDim }}>bulk: {fmtPrice(p.bulkPrice)}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.stock ? theme.colors.success : theme.colors.error }} />
                    <span style={{ color: p.stock ? theme.colors.success : theme.colors.error, fontWeight: 600 }}>{p.stock ? "In Stock" : "Out of Stock"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                    <button onClick={() => setQty((q) => ({ ...q, [p.id]: Math.max(1, (q[p.id] || 1) - 1) }))} style={qtyBtn}>−</button>
                    <span style={{ minWidth: 24, textAlign: "center", fontFamily: theme.fonts.mono, fontWeight: 700 }}>{qty[p.id] || 1}</span>
                    <button onClick={() => setQty((q) => ({ ...q, [p.id]: (q[p.id] || 1) + 1 }))} style={qtyBtn}>+</button>
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button disabled={!p.stock} onClick={() => add(p)} style={{ ...primaryBtn, flex: 1, opacity: p.stock ? 1 : 0.5 }}>
                      <ShoppingBag size={14} /> Add
                    </button>
                    <button disabled={!p.stock} onClick={() => buyNow(p)} style={{ ...primaryBtn, flex: 1, background: theme.gradientAccent, opacity: p.stock ? 1 : 0.5 }}>
                      <Zap size={14} /> Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div style={{ padding: 60, textAlign: "center", color: theme.colors.textDim }}>No products match your filters.</div>}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(26,46,26,0.55)", zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} className="ss-slide-in-left" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 320, background: "#fff", padding: 24, overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontFamily: theme.fonts.heading, fontSize: 24, margin: 0, color: theme.colors.text }}>Filters</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X /></button>
            </div>
            <FilterBody {...{ cat, setCat, maxPrice, setMaxPrice, inStockOnly, setInStockOnly, sort, setSort }} />
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(26,46,26,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={(e) => e.stopPropagation()} className="ss-fade-up" style={{ background: "#fff", borderRadius: 20, padding: 24, maxWidth: 720, width: "100%", maxHeight: "90vh", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
              <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 32, color: theme.colors.text, margin: 0 }}>{selected.name}</h2>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.colors.textDim }}><X /></button>
            </div>
            <img src={selected.image} alt={selected.name} style={{ width: "100%", height: 320, objectFit: "cover", borderRadius: 16 }} />
            <p style={{ marginTop: 16, color: theme.colors.text, lineHeight: 1.7 }}>{selected.desc}</p>
            <table style={{ width: "100%", marginTop: 18, borderCollapse: "collapse", fontSize: 14 }}>
              <tbody>
                {[["Category", selected.category], ["Net weight", selected.weight], ["Origin", "India"], ["Shelf life", "12 months"], ["Storage", "Cool, dry place"]].map(([k, v]) => (
                  <tr key={k} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                    <td style={{ padding: "10px 8px", fontFamily: theme.fonts.mono, color: theme.colors.textDim }}>{k}</td>
                    <td style={{ padding: "10px 8px", color: theme.colors.text, fontWeight: 600 }}>{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <button onClick={() => add(selected)} style={{ ...primaryBtn, flex: 1 }}><ShoppingBag size={16} /> Add to Cart — {fmtPrice(selected.price)}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 880px) {
          .agro-layout { grid-template-columns: 1fr !important; }
          .agro-sidebar { display: none !important; }
          .agro-mobile-filter { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}

function FilterBody({ cat, setCat, maxPrice, setMaxPrice, inStockOnly, setInStockOnly, sort, setSort }) {
  return (
    <>
      <SidebarBlock title="Category">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {CATS.map((c) => {
            const active = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
                background: active ? theme.gradient : "#fff",
                color: active ? "#fff" : theme.colors.text,
              }}>{c}</button>
            );
          })}
        </div>
      </SidebarBlock>
      <SidebarBlock title={`Max price: ₹${maxPrice}`}>
        <input type="range" min={100} max={1000} step={20} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: theme.colors.primary }} />
      </SidebarBlock>
      <SidebarBlock title="Availability">
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14 }}>
          <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} style={{ accentColor: theme.colors.primary }} /> In stock only
        </label>
      </SidebarBlock>
      <SidebarBlock title="Sort by">
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 10, border: `1px solid ${theme.colors.border}`, background: "#fff", color: theme.colors.text }}>
          <option value="popular">Popular</option>
          <option value="newest">Newest</option>
          <option value="low">Price: Low → High</option>
          <option value="high">Price: High → Low</option>
        </select>
      </SidebarBlock>
    </>
  );
}

function SidebarBlock({ title, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.primaryDark, letterSpacing: 1.5, marginBottom: 8, textTransform: "uppercase" }}>{title}</div>
      {children}
    </div>
  );
}

const qtyBtn = { width: 30, height: 30, borderRadius: 8, background: theme.colors.surfaceAlt, border: `1px solid ${theme.colors.border}`, cursor: "pointer", color: theme.colors.text, fontSize: 16, fontWeight: 700 };
const primaryBtn = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 14px", borderRadius: 12, background: theme.gradient, color: "#fff", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13 };
