import homeBanner from "../assets/homebanner.jpg.jpeg";
import homeBanner2 from "../assets/homebanner2.jpg.jpeg";
import homeBanner3 from "../assets/homebanner3.jpg.jpeg";

export const banners = [
  {
    id: 1,
    headline: "Fresh Food Delivered Hot",
    subheadline: "Order from our kitchen, delivered in 30 minutes",
    cta: "Order Food Now",
    route: "/home/food",
    image: homeBanner,
  },
  {
    id: 2,
    headline: "Authentic Spices from the Farm",
    subheadline: "Pure, organic, straight from Kerala and Rajasthan farms",
    cta: "Shop Spices",
    route: "/home/spices",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    headline: "Order Food + Spices Together",
    subheadline: "Build a richer kitchen in one easy checkout",
    cta: "Explore Combo",
    route: "/home",
    image: homeBanner3,
  },
  {
    id: 4,
    headline: "Fresh Groceries at Your Door",
    subheadline: "Vegetables, fruits and dairy at your doorstep",
    cta: "Shop Grocery",
    route: "/grocery",
    image: homeBanner2,
  },
];
