import { theme } from "@/utils/theme";
import { GradientText, Badge, Card } from "@/components/UI";
import { ChefHat, Leaf, Sparkles } from "lucide-react";

export default function Gallery() {
  const galleryImages = [
    {
      category: "Food",
      emoji: "🍛",
      title: "Chef-Crafted Meals",
      desc: "Authentic and fresh recipes prepared with care",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
    },
    {
      category: "Spices",
      emoji: "✨",
      title: "Premium Spices",
      desc: "Single-origin spices sourced from heritage farms",
      image: "https://images.unsplash.com/photo-1596040901950-35dd537410d0?w=500&auto=format&fit=crop",
    },
    {
      category: "Produce",
      emoji: "🥬",
      title: "Fresh Vegetables",
      desc: "Farm-fresh produce delivered daily",
      image: "https://images.unsplash.com/photo-1488459716781-6818a6aa9a5d?w=500&auto=format&fit=crop",
    },
    {
      category: "Food",
      emoji: "🍜",
      title: "Authentic Recipes",
      desc: "Traditional flavors with modern taste",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
    },
    {
      category: "Spices",
      emoji: "🌶️",
      title: "Aromatic Blends",
      desc: "Hand-ground spice mixes for perfect flavor",
      image: "https://images.unsplash.com/photo-1596040901950-35dd537410d0?w=500&auto=format&fit=crop",
    },
    {
      category: "Grocery",
      emoji: "🛒",
      title: "Daily Essentials",
      desc: "Everything you need for your kitchen",
      image: "https://images.unsplash.com/photo-1488459716781-6818a6aa9a5d?w=500&auto=format&fit=crop",
    },
  ];

  return (
    <main style={{ background: "#FFFFFF" }}>
      {/* HERO */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px 100px",
        background: `linear-gradient(180deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%), #FFFFFF`,
        minHeight: 500,
      }}>
        <div className="ss-fade-up" style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          textAlign: "center",
          paddingTop: 60,
        }}>
          <Badge color={theme.colors.accent} style={{ marginBottom: 20 }}>
            <Sparkles size={11} /> VISUAL JOURNEY
          </Badge>
          <h1 style={{
            fontFamily: theme.fonts.heading,
            fontSize: "clamp(40px, 7vw, 84px)",
            fontWeight: 800,
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: -1,
          }}>
            Discover Our <br />
            <GradientText>Food &amp; Spices</GradientText><br />
            Collection
          </h1>
          <p style={{
            fontSize: "clamp(15px, 1.4vw, 19px)",
            color: theme.colors.textDim,
            maxWidth: 620,
            margin: "24px auto 36px",
            lineHeight: 1.6,
          }}>
            Explore our carefully curated collection of premium foods and spices sourced from heritage farms.
          </p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{
            fontFamily: theme.fonts.heading,
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 700,
            margin: 0,
            marginBottom: 8,
          }}>
            Gallery
          </h2>
          <p style={{
            color: theme.colors.textDim,
            fontSize: 16,
            margin: "8px 0 0",
          }}>
            Visual showcase of our premium products
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}>
          {galleryImages.map((item, idx) => (
            <div
              key={idx}
              className="ss-hover-scale"
              style={{
                borderRadius: theme.radius.lg,
                overflow: "hidden",
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                boxShadow: "0 8px 24px rgba(76,175,80,0.08)",
                transition: theme.transition,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  height: 280,
                  background: `linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(56,142,60,0.05) 100%)`,
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ fontSize: 80 }}>{item.emoji}</div>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <div
                  style={{
                    display: "inline-block",
                    background: theme.colors.surfaceAlt,
                    padding: "4px 12px",
                    borderRadius: theme.radius.pill,
                    fontSize: 11,
                    color: theme.colors.primary,
                    fontWeight: 700,
                    marginBottom: 10,
                  }}
                >
                  {item.category}
                </div>
                <h3
                  style={{
                    fontFamily: theme.fonts.heading,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#1A2E1A",
                    margin: "10px 0 6px",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: theme.colors.textDim,
                    fontSize: 13,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "80px 24px",
        background: "#FFFFFF",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
        }}>
          {[
            { n: "500+", l: "Products" },
            { n: "10k+", l: "Happy Customers" },
            { n: "50+", l: "Suppliers" },
            { n: "24/7", l: "Fresh Delivery" },
          ].map((s) => (
            <div key={s.l} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: theme.fonts.mono,
                  fontSize: 42,
                  fontWeight: 900,
                  color: theme.colors.primary,
                  marginBottom: 8,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.body,
                  fontSize: 16,
                  color: theme.colors.textDim,
                  fontWeight: 600,
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
