import { useState } from "react";
import { Link } from "react-router-dom";
import { theme } from "@/utils/theme";
import BackButton from "@/components/BackButton";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

const CATEGORIES = ["All", "Recipes", "Farming", "Spice Tips", "Company News"];

const BLOGS = [
  {
    id: "1", title: "5 Heirloom Spices That Define South Indian Cuisine",
    category: "Spice Tips", author: "Anika Rao", date: "2026-04-12", read: 6,
    excerpt: "From single-origin black pepper to hand-pounded Tellicherry blends, discover the spices that bring depth, warmth, and history to every dish.",
    cover: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=900&auto=format&fit=crop",
  },
  {
    id: "2", title: "Inside the YUBI Kitchen: A Day in the Life",
    category: "Company News", author: "Team YUBI", date: "2026-04-02", read: 4,
    excerpt: "Step behind the scenes of our boutique kitchen where every meal is slow-cooked, hand-plated, and packed with love.",
    cover: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&auto=format&fit=crop",
  },
  {
    id: "3", title: "Rainy-Day Khichdi with Roasted Cumin",
    category: "Recipes", author: "Chef Meera", date: "2026-03-28", read: 5,
    excerpt: "A 30-minute one-pot recipe that pairs YUBI cumin and turmeric with farm-fresh moong dal — comfort in a bowl.",
    cover: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=900&auto=format&fit=crop",
  },
  {
    id: "4", title: "Why Direct-Farm Sourcing Matters",
    category: "Farming", author: "Ravi Kumar", date: "2026-03-15", read: 7,
    excerpt: "We visited 12 partner farms across Karnataka and Kerala to understand what 'direct-farm' really means for quality and farmer income.",
    cover: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop",
  },
  {
    id: "5", title: "Storing Spices the Right Way",
    category: "Spice Tips", author: "Anika Rao", date: "2026-03-04", read: 3,
    excerpt: "Heat, light and air are the enemies of fresh spices. Here's how to keep your YUBI spices vibrant for months.",
    cover: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=900&auto=format&fit=crop",
  },
  {
    id: "6", title: "Bulk Orders for Weddings & Events",
    category: "Company News", author: "Team YUBI", date: "2026-02-22", read: 4,
    excerpt: "From spice gift hampers to chef-prepared catering — how YUBI is powering memorable celebrations across India.",
    cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&auto=format&fit=crop",
  },
];

export default function Blog() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? BLOGS : BLOGS.filter((b) => b.category === cat);

  return (
    <div style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <BackButton />
          <div>
            <div style={{ fontFamily: theme.fonts.mono, fontSize: 11, color: theme.colors.primary, letterSpacing: 2 }}>YUBI / BLOG</div>
            <h1 style={{ fontFamily: theme.fonts.heading, fontSize: "clamp(36px,5vw,56px)", color: theme.colors.text, margin: "4px 0 0" }}>YUBI Blog</h1>
          </div>
        </div>
        <p style={{ color: theme.colors.textDim, fontSize: 17, maxWidth: 640, marginBottom: 32 }}>
          Stories, tips & recipes from our farm — written by chefs, farmers, and the YUBI team.
        </p>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 36 }}>
          {CATEGORIES.map((c) => {
            const active = cat === c;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                padding: "10px 18px", borderRadius: 999, fontWeight: 600, fontSize: 14,
                border: `2px solid ${active ? theme.colors.primary : theme.colors.border}`,
                background: active ? theme.gradient : "#fff",
                color: active ? "#fff" : theme.colors.text,
                cursor: "pointer", transition: theme.transition,
                fontFamily: theme.fonts.body,
              }}>{c}</button>
            );
          })}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 28 }}>
          {filtered.map((b) => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog }) {
  return (
    <Link to={`/blog/${blog.id}`} className="ss-hover-lift" style={{
      display: "block", textDecoration: "none", color: "inherit",
      background: "#fff", borderRadius: 20, overflow: "hidden",
      border: `1px solid ${theme.colors.border}`,
      boxShadow: "0 4px 18px rgba(76,175,80,0.08)",
    }}>
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: theme.colors.surfaceAlt }}>
        <img src={blog.cover} alt={blog.title} loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          background: theme.gradient, color: "#fff", padding: "6px 12px",
          borderRadius: 999, fontSize: 11, fontWeight: 700, fontFamily: theme.fonts.mono,
          letterSpacing: 1, textTransform: "uppercase",
        }}>{blog.category}</span>
      </div>
      <div style={{ padding: 20 }}>
        <h3 style={{ fontFamily: theme.fonts.heading, fontSize: 22, fontWeight: 700, color: theme.colors.text, margin: 0, lineHeight: 1.25 }}>
          {blog.title}
        </h3>
        <div style={{ display: "flex", gap: 14, color: theme.colors.textDim, fontSize: 12, margin: "10px 0 12px", flexWrap: "wrap", fontFamily: theme.fonts.mono }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User size={12} /> {blog.author}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {new Date(blog.date).toLocaleDateString()}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {blog.read} min read</span>
        </div>
        <p style={{ color: theme.colors.textDim, fontSize: 14, lineHeight: 1.6, margin: "0 0 14px",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {blog.excerpt}
        </p>
        <div className="story-link" style={{ color: theme.colors.primaryDark, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 }}>
          Read More <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}

export { BLOGS };
