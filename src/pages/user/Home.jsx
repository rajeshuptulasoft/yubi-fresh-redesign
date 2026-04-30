import { Link } from "react-router-dom";
import { theme } from "@/utils/theme";
import { GradientText, Button, Badge, Card } from "@/components/UI";
import { FOODS, SPICES } from "@/utils/catalog";
import { useCart } from "@/context/CartContext";
import { fmtPrice } from "@/utils/theme";
import heroImg from "@/assets/hero-spices.jpg";
import { Star, Truck, Award, Clock, ChefHat, ArrowRight, Flame } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { addItem } = useCart();
  const [cd, setCd] = useState({ h: 5, m: 32, s: 11 });

  useEffect(() => {
    const t = setInterval(() => {
      setCd((p) => {
        let s = p.s - 1, m = p.m, h = p.h;
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        if (h < 0) { h = 5; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="ss-grain" style={{
        position: "relative", overflow: "hidden", padding: "80px 24px 100px",
        background: `linear-gradient(180deg, rgba(13,13,13,0.4) 0%, rgba(13,13,13,0.85) 60%, #0D0D0D 100%), url(${heroImg}) center/cover`,
        minHeight: 640,
      }}>
        {/* floating spice particles */}
        {["🌶️","✨","🟡","🌸","🪵","⚫"].map((e, i) => (
          <div key={i} className="ss-float" style={{
            position: "absolute", fontSize: 32, opacity: 0.25,
            left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.8}s`, animationDuration: `${6 + i}s`,
          }}>{e}</div>
        ))}
        <div className="ss-fade-up" style={{ position: "relative", maxWidth: 1100, margin: "0 auto", textAlign: "center", paddingTop: 60 }}>
          <Badge color={theme.colors.accent} style={{ marginBottom: 20 }}>
            <Flame size={11} /> NEW SEASON · MONSOON SPECIALS
          </Badge>
          <h1 style={{
            fontFamily: theme.fonts.heading, fontSize: "clamp(40px, 7vw, 84px)",
            fontWeight: 800, lineHeight: 1.05, margin: 0, letterSpacing: -1,
          }}>
            Taste the Finest <br />
            <GradientText>Spices &amp; Food</GradientText>,<br />
            Delivered to Your Door
          </h1>
          <p style={{ fontSize: "clamp(15px, 1.4vw, 19px)", color: theme.colors.textDim, maxWidth: 620, margin: "24px auto 36px", lineHeight: 1.6 }}>
            Single-origin spices, slow-cooked meals, and bulk wholesale — sourced directly from heritage farms and crafted in our boutique kitchen.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/menu" style={{ textDecoration: "none" }}>
              <Button size="lg">Order Food Now <ArrowRight size={18} /></Button>
            </Link>
            <Link to="/spices" style={{ textDecoration: "none" }}>
              <Button size="lg" variant="glass">Shop Spices</Button>
            </Link>
          </div>

          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
            {[
              { icon: <Truck size={18} />, label: "Free delivery > ₹500" },
              { icon: <Award size={18} />, label: "100% Authentic" },
              { icon: <Clock size={18} />, label: "30-min delivery" },
            ].map((b) => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 8, color: theme.colors.textDim, fontSize: 14 }}>
                <span style={{ color: theme.colors.accent }}>{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 24px" }}>
        <SectionHeader eyebrow="EXPLORE" title="Featured Categories" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 20 }}>
          {[
            { title: "Chef-Crafted Food", desc: "30+ dishes, ready in 30 mins", emoji: "🍛", to: "/menu", grad: "linear-gradient(135deg, #E85D04, #F4A623)" },
            { title: "Premium Spice Blends", desc: "Single-origin, freshly ground", emoji: "✨", to: "/spices", grad: "linear-gradient(135deg, #F4A623, #FFB84D)" },
            { title: "Bulk & Wholesale", desc: "Up to 30% off on 5kg+", emoji: "📦", to: "/spices", grad: "linear-gradient(135deg, #8B4513, #E85D04)" },
          ].map((c) => (
            <Link key={c.title} to={c.to} style={{ textDecoration: "none" }}>
              <div className="ss-hover-scale" style={{
                position: "relative", overflow: "hidden", padding: 32, minHeight: 220,
                borderRadius: theme.radius.lg, background: c.grad, color: "#0D0D0D",
                display: "flex", flexDirection: "column", justifyContent: "space-between", cursor: "pointer",
              }}>
                <div style={{ fontSize: 64 }}>{c.emoji}</div>
                <div>
                  <div style={{ fontFamily: theme.fonts.heading, fontSize: 24, fontWeight: 700 }}>{c.title}</div>
                  <div style={{ marginTop: 6, opacity: 0.8, fontSize: 14 }}>{c.desc}</div>
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 14 }}>
                    Explore <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BESTSELLERS */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px 60px" }}>
        <SectionHeader eyebrow="LOVED BY ALL" title="Bestsellers" />
        <div className="ss-noscrollbar" style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 8 }}>
          {[...FOODS.slice(0, 4), ...SPICES.slice(0, 4)].map((p) => {
            const isFood = !p.tiers;
            const price = isFood ? p.price : p.tiers[0].price;
            return (
              <div key={p.id} className="ss-hover-scale" style={{
                minWidth: 240, flex: "0 0 240px", borderRadius: theme.radius.lg, overflow: "hidden",
                background: theme.colors.surface, border: `1px solid ${theme.colors.border}`,
              }}>
                <div style={{ height: 140, fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center", background: theme.gradientSoft }}>{p.emoji}</div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color: theme.colors.accent, fontSize: 12 }}>
                    <Star size={12} fill="currentColor" /> {p.rating}
                  </div>
                  <div style={{ fontFamily: theme.fonts.heading, fontWeight: 600, fontSize: 16, marginTop: 6 }}>{p.name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                    <span style={{ fontFamily: theme.fonts.mono, fontWeight: 700, color: theme.colors.accent }}>{fmtPrice(price)}</span>
                    <Button size="sm" onClick={() => addItem({
                      key: `${p.id}-${isFood ? "default" : p.tiers[0].weight}`,
                      productId: p.id, name: p.name, price, emoji: p.emoji,
                      variant: isFood ? null : p.tiers[0].weight,
                    })}>Add</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 24px" }}>
        <SectionHeader eyebrow="EFFORTLESS" title="How It Works" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
          {[
            { n: "01", t: "Browse & Choose", d: "Pick from food or spices, single or bulk", icon: <ChefHat /> },
            { n: "02", t: "Place Your Order", d: "Pay with card, UPI, or COD", icon: <Award /> },
            { n: "03", t: "Real-Time Tracking", d: "Watch your order from kitchen to door", icon: <Truck /> },
            { n: "04", t: "Enjoy", d: "Fresh, premium, delivered with care", icon: <Star /> },
          ].map((s, i) => (
            <Card key={s.n} className="ss-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div style={{ fontFamily: theme.fonts.mono, fontSize: 13, color: theme.colors.accent, marginBottom: 14 }}>{s.n}</div>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: theme.gradientSoft, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.accent, marginBottom: 16 }}>{s.icon}</div>
              <div style={{ fontFamily: theme.fonts.heading, fontSize: 18, fontWeight: 600 }}>{s.t}</div>
              <div style={{ color: theme.colors.textDim, fontSize: 14, marginTop: 6 }}>{s.d}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* PROMO COUNTDOWN */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "40px 24px" }}>
        <Card style={{
          padding: 40, textAlign: "center", background: theme.gradient, color: "#0D0D0D", border: "none",
          backgroundImage: theme.gradient,
        }} glass={false}>
          <Badge color="#0D0D0D" style={{ background: "rgba(0,0,0,0.15)", color: "#0D0D0D", border: "none" }}>FLASH DEAL</Badge>
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(28px, 4vw, 44px)", margin: "12px 0 8px", color: "#0D0D0D" }}>
            20% OFF on First Order
          </h2>
          <div style={{ marginBottom: 20 }}>Use code <strong>FIRST</strong> at checkout</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {[["HRS", cd.h], ["MIN", cd.m], ["SEC", cd.s]].map(([l, v]) => (
              <div key={l} style={{ background: "rgba(0,0,0,0.15)", padding: "12px 20px", borderRadius: 12, minWidth: 80 }}>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: 32, fontWeight: 800, color: "#0D0D0D" }}>{String(v).padStart(2, "0")}</div>
                <div style={{ fontFamily: theme.fonts.mono, fontSize: 10, letterSpacing: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 24px" }}>
        <SectionHeader eyebrow="REAL STORIES" title="From Our Customers" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: 20 }}>
          {[
            { name: "Priya M.", role: "Home Cook", text: "The Lakadong turmeric is a game-changer. You can taste the difference instantly.", emoji: "👩‍🍳" },
            { name: "Aarav K.", role: "Restaurant Owner", text: "Bulk pricing is fair, quality is consistent. Reliable partner for our kitchen.", emoji: "👨‍🍳" },
            { name: "Mira S.", role: "Food Blogger", text: "Their biryani arrived hot, fragrant, and packed beautifully. 10/10.", emoji: "📸" },
          ].map((t) => (
            <Card key={t.name}>
              <div style={{ display: "flex", gap: 4, color: theme.colors.accent }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <p style={{ marginTop: 14, color: theme.colors.text, lineHeight: 1.6, fontSize: 15 }}>"{t.text}"</p>
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: theme.gradientSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.emoji}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: theme.colors.textDim }}>{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 12, letterSpacing: 3, color: theme.colors.accent, marginBottom: 8 }}>{eyebrow}</div>
      <h2 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 700, margin: 0 }}>{title}</h2>
    </div>
  );
}
