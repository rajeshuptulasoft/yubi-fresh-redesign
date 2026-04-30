import { BannerSlider, CategoryImageSection, ProductCard, ProductGridSection, buildCategoryItems, colors, heading } from "./HomeSections";
import { products } from "../../data";
import { useWindowSize } from "../../hooks/useWindowSize";

const spiceBanners = [
  { id: 1, headline: "Authentic Spices from the Farm", subheadline: "Fresh, fragrant and carefully sourced", cta: "Shop Spices", route: "/spices", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop" },
  { id: 2, headline: "Bulk Spice Orders", subheadline: "Restaurant-ready quality and pricing", cta: "Bulk Order", route: "/spices", image: "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1600&auto=format&fit=crop" },
  { id: 3, headline: "Pure Organic Blends", subheadline: "No shortcuts, just real aroma", cta: "Explore", route: "/spices", image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1600&auto=format&fit=crop" }
];

export default function HomeSpices() {
  const { width } = useWindowSize();
  const spices = products.filter((p) => p.category === "spices");
  const spiceGroups = spices.map((product, index) => ({ ...product, categoryLabel: ["Powders", "Whole Spices", "Masalas", "Organic", "Bulk Packs"][index % 5] }));
  const groupedSpices = [
    { title: "Daily Use Spices", items: spices.slice(0, 4) },
    { title: "Premium Picks", items: spices.slice(1, 5) },
    { title: "Bulk Favorites", items: spices.slice(0, 3) }
  ];
  return <main style={{ background: "#FFFFFF", color: colors.text }}>
    <BannerSlider items={spiceBanners} />
    <CategoryImageSection title="Spice Categories" items={buildCategoryItems(spiceGroups, "/spices")} titleInCard />
    <ProductGridSection title="Popular Spices" items={spices} />
    <section style={{ padding: width <= 768 ? "28px 16px" : "28px 40px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: 22 }}>
        {groupedSpices.map((group) => <div key={group.title}>
          <h3 style={{ margin: "0 0 12px", color: "#1A2E1A" }}>{group.title}</h3>
          <div style={{ display: "grid", gridTemplateColumns: width <= 768 ? "1fr" : width <= 1024 ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 16, alignItems: "stretch" }}>
            {group.items.map((item) => <ProductCard key={`${group.title}-${item.id}`} product={item} />)}
          </div>
        </div>)}
      </div>
    </section>
  </main>;
}
