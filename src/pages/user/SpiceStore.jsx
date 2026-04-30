import { useMemo, useState } from "react";
import { theme, fmtPrice } from "@/utils/theme";
import { SPICES, SPICE_CATEGORIES } from "@/utils/catalog";
import { Card, Button, Input, Badge, Modal } from "@/components/UI";
import { useCart } from "@/context/CartContext";
import { Search, Star, Package } from "lucide-react";
import { toast } from "sonner";

export default function SpiceStore() {
  const { addItem } = useCart();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("single");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState({});

  const products = useMemo(
    () => SPICES.filter((p) => (cat === "All" || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase())),
    [cat, q]
  );

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "30px 24px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(32px,5vw,48px)", margin: 0 }}>Spice Store</h1>
          <p style={{ color: theme.colors.textDim, marginTop: 6 }}>Single-origin, freshly ground, world-class</p>
        </div>
        <div style={{ display: "flex", padding: 4, background: theme.colors.surface, borderRadius: 14, border: `1px solid ${theme.colors.border}` }}>
          {["single", "bulk"].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "10px 20px", borderRadius: 10, cursor: "pointer", border: "none",
              background: mode === m ? theme.gradient : "transparent",
              color: mode === m ? "#0D0D0D" : "#fff", fontWeight: 700, fontSize: 13, fontFamily: theme.fonts.body,
            }}>{m === "single" ? "Single Order" : "Bulk Order"}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: theme.colors.textDim }} />
          <Input placeholder="Search spices..." value={q} onChange={(e) => setQ(e.target.value)} style={{ paddingLeft: 42 }} />
        </div>
        {mode === "bulk" && (
          <Button variant="outline" onClick={() => setQuoteOpen(true)}><Package size={16} /> Custom Quote</Button>
        )}
      </div>

      <div className="ss-noscrollbar" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
        {SPICE_CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: "10px 18px", borderRadius: 999, cursor: "pointer", whiteSpace: "nowrap",
            background: cat === c ? theme.gradient : theme.colors.surface,
            color: cat === c ? "#0D0D0D" : "#fff", fontWeight: 600,
            border: cat === c ? "none" : `1px solid ${theme.colors.border}`, fontFamily: theme.fonts.body, fontSize: 14,
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 18 }}>
        {products.map((p) => {
          const tier = selectedTier[p.id] || p.tiers[mode === "bulk" ? Math.min(2, p.tiers.length - 1) : 0];
          return (
            <Card key={p.id} className="ss-hover-scale ss-fade-up" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ height: 160, display: "flex", alignItems: "center", justifyContent: "center", background: theme.gradientSoft, fontSize: 80, position: "relative" }}>
                {p.emoji}
                {tier.discount > 0 && <div style={{ position: "absolute", top: 12, right: 12 }}><Badge color={theme.colors.success}>{tier.discount}% OFF</Badge></div>}
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, fontSize: 17 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, color: theme.colors.accent, fontSize: 13 }}>
                    <Star size={12} fill="currentColor" /> {p.rating}
                  </div>
                </div>
                <div style={{ color: theme.colors.textDim, fontSize: 13, marginTop: 6, lineHeight: 1.5, minHeight: 40 }}>{p.desc}</div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {p.tiers.map((t) => (
                    <button key={t.weight} onClick={() => setSelectedTier({ ...selectedTier, [p.id]: t })}
                      style={{
                        padding: "6px 10px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontFamily: theme.fonts.mono, fontWeight: 700,
                        border: tier.weight === t.weight ? `1.5px solid ${theme.colors.accent}` : `1px solid ${theme.colors.border}`,
                        background: tier.weight === t.weight ? "rgba(244,166,35,0.1)" : theme.colors.surfaceAlt,
                        color: tier.weight === t.weight ? theme.colors.accent : "#fff",
                      }}>{t.weight}{t.discount > 0 && <span style={{ marginLeft: 4, color: theme.colors.success }}>-{t.discount}%</span>}</button>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                  <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, color: theme.colors.accent, fontSize: 17 }}>{fmtPrice(tier.price)}</span>
                  <Button size="sm" onClick={() => addItem({
                    key: `${p.id}-${tier.weight}`, productId: p.id, name: p.name, price: tier.price, emoji: p.emoji, variant: tier.weight,
                  })}>Add</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={quoteOpen} onClose={() => setQuoteOpen(false)}>
        <h2 style={{ fontFamily: theme.fonts.heading, fontSize: 24, marginTop: 0 }}>Request Custom Quote</h2>
        <p style={{ color: theme.colors.textDim, fontSize: 14 }}>For orders above 50kg, we'll get back to you within 24h with custom wholesale pricing.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <Input placeholder="Spice / blend name" />
          <Input placeholder="Quantity (kg)" type="number" />
          <Input placeholder="Your email" type="email" />
          <Input placeholder="Notes (optional)" />
          <Button size="lg" onClick={() => { toast.success("Quote request sent!"); setQuoteOpen(false); }}>Submit Request</Button>
        </div>
      </Modal>
    </div>
  );
}
