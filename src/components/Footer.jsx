import { theme } from "@/utils/theme";
import { Sparkles, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${theme.colors.border}`, marginTop: 80, padding: "60px 24px 30px", background: "#0a0a0a" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.gradient, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={18} color="#0D0D0D" />
            </div>
            <div style={{ fontFamily: theme.fonts.heading, fontWeight: 800, fontSize: 18 }}>Saffron &amp; Sage</div>
          </div>
          <p style={{ color: theme.colors.textDim, fontSize: 14, lineHeight: 1.6 }}>
            Boutique spices and chef-crafted food, delivered with love from our kitchens to your door.
          </p>
        </div>
        {[
          { title: "Shop", links: ["Menu", "Spice Store", "Bulk Orders", "Gift Boxes"] },
          { title: "Company", links: ["About Us", "Sourcing", "Careers", "Press"] },
          { title: "Support", links: ["Help Center", "Track Order", "Returns", "Contact"] },
        ].map((c) => (
          <div key={c.title}>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.accent, letterSpacing: 2, marginBottom: 14 }}>{c.title.toUpperCase()}</div>
            {c.links.map((l) => <div key={l} style={{ color: theme.colors.textDim, fontSize: 14, padding: "6px 0", cursor: "pointer" }}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1400, margin: "40px auto 0", paddingTop: 30, borderTop: `1px solid ${theme.colors.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <div style={{ color: theme.colors.textDim, fontSize: 13, fontFamily: theme.fonts.mono }}>© 2026 SAFFRON & SAGE · CRAFTED IN INDIA</div>
        <div style={{ display: "flex", gap: 12 }}>
          {[Instagram, Twitter, Facebook].map((Icon, i) => (
            <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: theme.colors.surface, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.textDim, cursor: "pointer" }}>
              <Icon size={16} />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
