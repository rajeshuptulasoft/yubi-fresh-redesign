import { BannerSlider, CategoryImageSection, ProductGridSection, colors } from "./HomeSections";
import { products, banners } from "../../data";

const homeCategories = [
  { name: "Food", route: "/home/food", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop" },
  { name: "Spices", route: "/home/spices", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop" },
  { name: "Grocery", route: "/grocery", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop" },
  { name: "Agro Products", route: "/agro", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop" },
  { name: "Bulk Orders", route: "/spices", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop" },
];

export default function HomeCombined() {
  const foods = products.filter((product) => product.category === "food");
  const spices = products.filter((product) => product.category === "spices");

  return <main style={{ background: "#FFFFFF", color: colors.text }}>
    <BannerSlider items={banners} />
    <CategoryImageSection title="Shop By Category" items={homeCategories} />
    <ProductGridSection title="Popular Products" items={products.slice(0, 8)} />
    <ProductGridSection title="Food Delivered by our YUBI Foods" items={foods.slice(0, 8)} />
    <ProductGridSection title="Spices Delivered by the YUBI Spices" items={spices.slice(0, 8)} />
    <ProductGridSection title="Inspiration for your first order" items={foods.slice(0, 6)} />
    <ProductGridSection title="Inspiration for your first order of Spices" items={spices.slice(0, 6)} />
  </main>;
}
