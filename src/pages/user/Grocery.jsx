import { useState } from "react";
import { products } from "../../data";
import { BannerSlider, CategoryImageSection, GallerySection, ProductGridSection, colors, buildCategoryItems } from "./HomeSections";
import { useWindowSize } from "../../hooks/useWindowSize";

const groceryBanners = [
  { id: 1, headline: "Fresh Groceries, Delivered Daily", subheadline: "Farm fresh vegetables, fruits, dairy and more", cta: "Shop Grocery", route: "/grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop" },
  { id: 2, headline: "Daily Essentials in One Place", subheadline: "Grains, oils, milk and fresh produce", cta: "Browse Items", route: "/grocery", image: "https://images.unsplash.com/photo-1543168256-418811576931?w=1600&auto=format&fit=crop" },
];
const categoryMap = { "Fresh Tomatoes": "Vegetables", "Green Spinach": "Vegetables", "Turmeric Root": "Vegetables", "Onions": "Vegetables", "Ginger": "Vegetables", "Garlic": "Vegetables", Mango: "Fruits", "Whole Milk": "Dairy", "Basmati Rice": "Grains & Pulses", "Wheat Flour": "Grains & Pulses", "Coconut Oil": "Beverages", "Mustard Oil": "Beverages" };

export default function Grocery() {
  const [q, setQ] = useState("");
  const { width } = useWindowSize();
  const grocery = products.filter((product) => product.category === "grocery").map((product) => ({ ...product, categoryLabel: categoryMap[product.name] || "Grocery" }));
  const rows = grocery.filter((product) => product.name.toLowerCase().includes(q.toLowerCase()));
  return <main style={{ background: "#FFFFFF", color: colors.text }}>
    <BannerSlider items={groceryBanners} />
    <section style={{ maxWidth: 900, margin: "0 auto", padding: width <= 768 ? "24px 16px 0" : "38px 40px 0" }}><input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search for groceries..." style={{ width: "100%", boxSizing: "border-box", padding: 14, border: "2px solid #4CAF50", borderRadius: 12, color: "#1A1A1A", background: "#FFFFFF" }} /></section>
    <CategoryImageSection title="Grocery Categories" items={buildCategoryItems(grocery, "/grocery")} />
    <ProductGridSection title="Popular Groceries" items={rows} />
    <GallerySection items={grocery} />
  </main>;
}
