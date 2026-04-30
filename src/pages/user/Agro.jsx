import { products } from "../../data";
import { BannerSlider, CategoryImageSection, ProductGridSection, buildCategoryItems, colors } from "./HomeSections";

const agroBanners = [
  { id: 1, headline: "Agro Products Direct from Farm", subheadline: "Quality grains, seeds, compost and farm tools", cta: "Explore Agro", route: "/agro", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop" },
  { id: 2, headline: "Organic Farm Essentials", subheadline: "Reliable supplies for growers and home gardens", cta: "Shop Now", route: "/agro", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&auto=format&fit=crop" },
];

export default function Agro() {
  const agro = products.filter((product) => product.category === "agro").map((product, index) => ({ ...product, categoryLabel: ["Grains", "Fertilizers", "Seeds", "Tools"][index % 4] }));
  return <main style={{ background: "#FFFFFF", color: colors.text }}>
    <BannerSlider items={agroBanners} />
    <CategoryImageSection title="Agro Categories" items={buildCategoryItems(agro, "/agro")} />
    <ProductGridSection title="Popular Agro Products" items={agro} />
    <ProductGridSection title="Agro Delivered by our YUBI Agro Foods" items={agro.slice(0, 8)} />
    <ProductGridSection title="Inspiration for your first order of Agro Products" items={agro.slice(0, 6)} />
  </main>;
}
