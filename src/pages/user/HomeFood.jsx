import { BannerSlider, CategoryImageSection, ProductCard, ProductGridSection, buildCategoryItems, colors, heading } from "./HomeSections";
import { products } from "../../data";
import { useWindowSize } from "../../hooks/useWindowSize";
import homeBanner from "../../assets/homebanner.jpg.jpeg";

const foodBanners = [
  { id: 1, headline: "Fresh Food Delivered Hot", subheadline: "Kitchen-fresh meals at your door", cta: "Order Food", route: "/menu", image: homeBanner },
  { id: 2, headline: "Chef Crafted Daily", subheadline: "Comfort dishes, snacks and sweets", cta: "See Menu", route: "/menu", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&auto=format&fit=crop" },
  { id: 3, headline: "Lunch Sorted Fast", subheadline: "Quick delivery for busy days", cta: "Order Now", route: "/menu", image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1600&auto=format&fit=crop" }
];

export default function HomeFood() {
  const { width } = useWindowSize();
  const food = products.filter((p) => p.category === "food");
  const foodWithGroups = food.map((product, index) => ({ ...product, categoryLabel: ["Curries", "Biryani", "Snacks", "South Indian", "Meals"][index % 5] }));
  const groupedFood = [
    { title: "Best Sellers", items: food.slice(0, 4) },
    { title: "Quick Meals", items: food.slice(1, 5) },
    { title: "Chef Specials", items: food.slice(0, 3) }
  ];
  return <main style={{ background: "#FFFFFF", color: colors.text }}>
    <BannerSlider items={foodBanners} />
    <CategoryImageSection title="Food Categories" items={buildCategoryItems(foodWithGroups, "/menu")} titleInCard />
    <ProductGridSection title="Popular Food" items={food} />
    <section style={{ padding: width <= 768 ? "28px 16px" : "28px 40px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 22 }}>
        {groupedFood.map((group) => <div key={group.title}>
          <h3 style={{ margin: "0 0 12px", color: "#1A2E1A" }}>{group.title}</h3>
          <div style={{ display: "grid", gridTemplateColumns: width <= 768 ? "1fr" : width <= 1024 ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16, alignItems: "stretch" }}>
            {group.items.map((item) => <ProductCard key={`${group.title}-${item.id}`} product={item} />)}
          </div>
        </div>)}
      </div>
    </section>
  </main>;
}
