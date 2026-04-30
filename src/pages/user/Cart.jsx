import { useState } from "react";
import { Link } from "react-router-dom";
import { theme, fmtPrice } from "@/utils/theme";
import { useCart } from "@/context/CartContext";
import { Card, Button, Input, Badge } from "@/components/UI";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, discount, deliveryFee, tax, total, applyCoupon, coupon } = useCart();
  const [code, setCode] = useState("");
  const [orderType, setOrderType] = useState("delivery");

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ width: 90, height: 90, borderRadius: 24, background: theme.gradientSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <ShoppingBag size={40} color={theme.colors.accent} />
        </div>
        <h1 style={{ fontFamily: theme.fonts.heading, fontSize: 36 }}>Your cart is empty</h1>
        <p style={{ color: theme.colors.textDim, marginBottom: 28 }}>Discover dishes and spices, add to cart, and enjoy.</p>
        <Link to="/menu" style={{ textDecoration: "none" }}><Button size="lg">Browse Menu</Button></Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 24px 60px" }}>
      <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(32px,5vw,44px)", marginBottom: 24 }}>Your Cart</h1>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }} className="ss-cart-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((i) => (
            <Card key={i.key} className="ss-fade-up">
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: 14, background: theme.gradientSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0 }}>{i.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: theme.fonts.heading, fontSize: 17, fontWeight: 600 }}>{i.name}</div>
                  {i.variant && <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.accent, marginTop: 2 }}>{i.variant}</div>}
                  <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, color: theme.colors.accent, marginTop: 6 }}>{fmtPrice(i.price)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: theme.colors.surfaceAlt, padding: 4, borderRadius: 10, border: `1px solid ${theme.colors.border}` }}>
                  <button onClick={() => updateQty(i.key, i.qty - 1)} style={{ width: 28, height: 28, border: "none", background: "transparent", color: "#fff", cursor: "pointer" }}><Minus size={14} /></button>
                  <span style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>{i.qty}</span>
                  <button onClick={() => updateQty(i.key, i.qty + 1)} style={{ width: 28, height: 28, border: "none", background: "transparent", color: "#fff", cursor: "pointer" }}><Plus size={14} /></button>
                </div>
                <button onClick={() => removeItem(i.key)} style={{ width: 40, height: 40, borderRadius: 10, background: "transparent", border: `1px solid ${theme.colors.border}`, color: theme.colors.error, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div>
          <Card style={{ position: "sticky", top: 96 }}>
            <div style={{ display: "flex", padding: 4, background: theme.colors.surfaceAlt, borderRadius: 12, marginBottom: 18, border: `1px solid ${theme.colors.border}` }}>
              {["delivery", "pickup"].map((t) => (
                <button key={t} onClick={() => setOrderType(t)} style={{
                  flex: 1, padding: 10, borderRadius: 8, cursor: "pointer", border: "none",
                  background: orderType === t ? theme.gradient : "transparent",
                  color: orderType === t ? "#0D0D0D" : "#fff", fontWeight: 700, fontSize: 13, fontFamily: theme.fonts.body,
                }}>{t === "delivery" ? "🛵 Delivery" : "🥡 Pickup"}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
              <Input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} style={{ paddingLeft: 14 }} />
              <Button variant="outline" onClick={() => applyCoupon(code)}><Tag size={14} /></Button>
            </div>
            {coupon && <Badge color={theme.colors.success} style={{ marginBottom: 14 }}>{coupon.code} · {coupon.percent}% OFF</Badge>}

            <Row label="Subtotal" value={fmtPrice(subtotal)} />
            {discount > 0 && <Row label="Discount" value={`-${fmtPrice(discount)}`} color={theme.colors.success} />}
            <Row label="Delivery" value={deliveryFee === 0 ? "FREE" : fmtPrice(deliveryFee)} />
            <Row label="Tax (5%)" value={fmtPrice(tax)} />
            <div style={{ height: 1, background: theme.colors.border, margin: "14px 0" }} />
            <Row label="Total" value={fmtPrice(total)} big />
            <Link to="/checkout" style={{ textDecoration: "none", display: "block", marginTop: 18 }}>
              <Button size="lg" style={{ width: "100%" }}>Proceed to Checkout</Button>
            </Link>
          </Card>
        </div>
      </div>
      <style>{`@media(max-width:900px){.ss-cart-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
}

function Row({ label, value, color, big }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
      <span style={{ color: big ? "#fff" : theme.colors.textDim, fontSize: big ? 16 : 14, fontWeight: big ? 700 : 400 }}>{label}</span>
      <span style={{ color: color || (big ? theme.colors.accent : "#fff"), fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: big ? 22 : 14 }}>{value}</span>
    </div>
  );
}
