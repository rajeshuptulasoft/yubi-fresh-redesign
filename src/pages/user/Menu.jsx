import { useMemo, useState } from "react";
import { theme, fmtPrice } from "@/utils/theme";
import { FOODS, FOOD_CATEGORIES } from "@/utils/catalog";
import { Card, Button, Input, Badge } from "@/components/UI";
import { useCart } from "@/context/CartContext";
import { Search, Star, Plus, Minus } from "lucide-react";

export default function Menu() {
  const { addItem, items, updateQty } = useCart();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("popular");
  const [vegOnly, setVegOnly] = useState(false);

  const products = useMemo(() => {
    let r = FOODS.filter((p) => (cat === "All" || p.category === cat) && (!vegOnly || p.veg) && p.name.toLowerCase().includes(q.toLowerCase()));
    if (sort === "price") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [cat, q, sort, vegOnly]);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "30px 24px 60px" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(32px,5vw,48px)", margin: 0 }}>Our Menu</h1>
        <p style={{ color: theme.colors.textDim, marginTop: 6 }}>Chef-crafted, ready in 30 minutes</p>
      </div>

      {/* Search & Sort */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, marginBottom: 20, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textDim }} />
          <Input placeholder="Search dishes..." value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} style={selectStyle}>
          <option value="popular">Popular</option>
          <option value="price">Price ↑</option>
          <option value="rating">Rating ↓</option>
        </select>
        <button onClick={() => setVegOnly(!vegOnly)} style={{
          padding: "12px 16px", borderRadius: 12, cursor: "pointer",
          background: vegOnly ? "rgba(34,197,94,0.15)" : theme.colors.surface,
          border: `1px solid ${vegOnly ? theme.colors.success : theme.colors.border}`,
          color: vegOnly ? theme.colors.success : "#fff", fontWeight: 600, fontSize: 13, fontFamily: theme.fonts.body,
        }}>🟢 Veg only</button>
      </div>

      {/* Category tabs */}
      <div className="ss-noscrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
        {FOOD_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: "10px 18px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
            background: cat === c ? theme.gradient : theme.colors.surface,
            color: cat === c ? "#0D0D0D" : "#fff", fontWeight: 600,
            border: cat === c ? "none" : `1px solid ${theme.colors.border}`,
            fontSize: 14, fontFamily: theme.fonts.body,
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 18 }}>
        {products.map((p) => {
          const inCart = items.find((i) => i.key === `${p.id}-default`);
          return (
            <Card key={p.id} className="ss-hover-scale ss-fade-up" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: theme.gradientSoft, fontSize: 80, position: "relative" }}>
                {p.emoji}
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <Badge color={p.veg ? theme.colors.success : theme.colors.error}>{p.veg ? "VEG" : "NON-VEG"}</Badge>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, fontSize: 17 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, color: theme.colors.accent, fontSize: 13, whiteSpace: "nowrap" }}>
                    <Star size={12} fill="currentColor" /> {p.rating}
                  </div>
                </div>
                <div style={{ color: theme.colors.textDim, fontSize: 13, marginTop: 6, lineHeight: 1.5, minHeight: 40 }}>{p.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, color: theme.colors.accent, fontSize: 17 }}>{fmtPrice(p.price)}</span>
                  {inCart ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.gradient, borderRadius: 12, padding: 4 }}>
                      <button onClick={() => updateQty(inCart.key, inCart.qty - 1)} style={qtyBtn}><Minus size={14} /></button>
                      <span style={{ minWidth: 20, textAlign: "center", color: "#0D0D0D", fontWeight: 800 }}>{inCart.qty}</span>
                      <button onClick={() => updateQty(inCart.key, inCart.qty + 1)} style={qtyBtn}><Plus size={14} /></button>
                    </div>
                  ) : (
                    <Button size="sm" onClick={() => addItem({ key: `${p.id}-default`, productId: p.id, name: p.name, price: p.price, emoji: p.emoji })}>
                      <Plus size={14} /> Add
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {products.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: theme.colors.textDim }}>No dishes match your filters</div>
        )}
      </div>
    </div>
  );
}

const selectStyle = {
  padding: "12px 16px", borderRadius: 12, background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`, color: "#fff", fontFamily: theme.fonts.body, cursor: "pointer", fontSize: 14,
};
const qtyBtn = {
  width: 26, height: 26, borderRadius: 8, background: "rgba(0,0,0,0.15)", border: "none", color: "#0D0D0D", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
};
