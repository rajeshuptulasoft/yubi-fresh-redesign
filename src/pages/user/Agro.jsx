import { useState } from "react";
import { BannerSlider, colors } from "./HomeSections";

const agroBanners = [
  { id: 1, headline: "Organic Farming Solutions", subheadline: "Seeds, tools, and fertilizers for sustainable agriculture", cta: "Explore Now", route: "/agro", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1600&auto=format&fit=crop" },
  { id: 2, headline: "Premium Farm Equipment", subheadline: "Everything farmers need for better harvest", cta: "Shop Tools", route: "/agro", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1600&auto=format&fit=crop" },
];

// 100+ Agro Products with Unsplash images
const allAgroProducts = [
  // POPULAR PRODUCTS (25 items)
  { type: "Popular Products", category: "Seeds", title: "Organic Brown Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop", desc: "Farm-direct organic brown rice" },
  { type: "Popular Products", category: "Seeds", title: "Premium Wheat Seeds", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "High-yield certified wheat seeds" },
  { type: "Popular Products", category: "Fertilizers", title: "Vermicompost Organic", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Worm castings for soil enrichment" },
  { type: "Popular Products", category: "Fertilizers", title: "NPK Fertilizer 10-10-10", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Balanced nutrient fertilizer for all crops" },
  { type: "Popular Products", category: "Tools", title: "Multi-Purpose Farm Spade", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Heavy-duty steel spade for all soil types" },
  { type: "Popular Products", category: "Tools", title: "Hand Hoe Cultivator", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Lightweight weeding and cultivation tool" },
  { type: "Popular Products", category: "Grains", title: "Organic Basmati Rice", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop", desc: "Premium long-grain organic basmati" },
  { type: "Popular Products", category: "Seeds", title: "Corn Seeds Hybrid", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "High-yield hybrid corn varieties" },
  { type: "Popular Products", category: "Pesticides", title: "Neem Oil Pesticide", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Natural organic neem-based pesticide" },
  { type: "Popular Products", category: "Pesticides", title: "Bio-Pesticide Spray", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Organic biological pest control" },
  { type: "Popular Products", category: "Equipment", title: "Drip Irrigation System", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Complete micro-irrigation setup" },
  { type: "Popular Products", category: "Equipment", title: "Soil Testing Kit", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Comprehensive soil analysis kit" },
  { type: "Popular Products", category: "Organic", title: "Cow Dung Compost", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Natural cow manure compost" },
  { type: "Popular Products", category: "Organic", title: "Seaweed Extract", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Liquid seaweed fertilizer concentrate" },
  { type: "Popular Products", category: "Tools", title: "Garden Gloves Heavy Duty", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Durable work gloves for farming" },
  { type: "Popular Products", category: "Tools", title: "Pruning Shears Stainless", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Professional pruning scissors" },
  { type: "Popular Products", category: "Seeds", title: "Barley Seeds Premium", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop", desc: "High-quality barley for malting" },
  { type: "Popular Products", category: "Grains", title: "Millet Grains Organic", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Ancient grain millet varieties" },
  { type: "Popular Products", category: "Seeds", title: "Pulses Mix Pack", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Mixed lentils and pulses collection" },
  { type: "Popular Products", category: "Fertilizers", title: "DAP Fertilizer 18-46-0", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Phosphorus and nitrogen blend" },
  { type: "Popular Products", category: "Equipment", title: "Compost Bin Large", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Large composting container system" },
  { type: "Popular Products", category: "Equipment", title: "Bamboo Support Stakes", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Natural bamboo plant supports" },
  { type: "Popular Products", category: "Organic", title: "Sulfur Powder 99%", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Pure sulfur soil amendment" },
  { type: "Popular Products", category: "Pesticides", title: "Organic Fungicide Sulfur", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Natural fungal disease control" },
  { type: "Popular Products", category: "Tools", title: "Long Handle Fork", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Steel long-handle garden fork" },

  // BEST SELLING PRODUCTS (25 items)
  { type: "Best Selling Products", category: "Seeds", title: "Hybrid Tomato Seeds", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop", desc: "Disease-resistant hybrid tomato seeds" },
  { type: "Best Selling Products", category: "Seeds", title: "Okra Seeds Premium", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "High-yield okra seed varieties" },
  { type: "Best Selling Products", category: "Grains", title: "Quinoa Seeds Super", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop", desc: "Premium super grain quinoa" },
  { type: "Best Selling Products", category: "Grains", title: "Oats Organic", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Certified organic rolled oats" },
  { type: "Best Selling Products", category: "Fertilizers", title: "Potash Fertilizer 0-0-50", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Pure potassium fertilizer" },
  { type: "Best Selling Products", category: "Fertilizers", title: "Urea Fertilizer 46% N", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "High nitrogen urea fertilizer" },
  { type: "Best Selling Products", category: "Equipment", title: "Drip Hose Micro", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Micro drip irrigation hose 50m" },
  { type: "Best Selling Products", category: "Equipment", title: "Sprayer 15L Pump", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Manual 15-liter knapsack sprayer" },
  { type: "Best Selling Products", category: "Tools", title: "Mattock Pick Axe", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Heavy-duty mattock for hard ground" },
  { type: "Best Selling Products", category: "Tools", title: "Wheelbarrow 60L", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Large capacity wheelbarrow" },
  { type: "Best Selling Products", category: "Pesticides", title: "Copper Fungicide 50%", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Copper-based fungicide powder" },
  { type: "Best Selling Products", category: "Pesticides", title: "Trichoderma Bio-Agent", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Biological soil microorganism" },
  { type: "Best Selling Products", category: "Organic", title: "Azospirillum Biofertilizer", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Nitrogen-fixing bacteria culture" },
  { type: "Best Selling Products", category: "Organic", title: "Phosphobacteria Culture", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Phosphorus solubilizing bacteria" },
  { type: "Best Selling Products", category: "Seeds", title: "Chilli Seeds Hybrid", image: "https://images.unsplash.com/photo-1596040901950-35dd537410d0?w=500&auto=format&fit=crop", desc: "High-yield hybrid chilli seeds" },
  { type: "Best Selling Products", category: "Seeds", title: "Cucumber Seeds", image: "https://images.unsplash.com/photo-1599599810694-c6d2b0b07348?w=500&auto=format&fit=crop", desc: "Disease-resistant cucumber varieties" },
  { type: "Best Selling Products", category: "Grains", title: "Ragi Flour Nutrition", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Finger millet flour milled" },
  { type: "Best Selling Products", category: "Equipment", title: "Garden Hose 50m", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Heavy-duty garden hose kit" },
  { type: "Best Selling Products", category: "Equipment", title: "Hand Sprayer 1L", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Compact hand spray bottle" },
  { type: "Best Selling Products", category: "Tools", title: "Shovel Pointed", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Steel pointed shovel digging" },
  { type: "Best Selling Products", category: "Fertilizers", title: "Calcium Nitrate Fertilizer", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Calcium and nitrogen blend" },
  { type: "Best Selling Products", category: "Tools", title: "Leather Gloves Work", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Premium leather work gloves" },
  { type: "Best Selling Products", category: "Organic", title: "Neem Cake Compost", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Neem seed cake fertilizer" },
  { type: "Best Selling Products", category: "Equipment", title: "Soil Moisture Meter", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Digital soil moisture sensor" },

  // ADDITIONAL PRODUCTS (50+ items - more categories)
  // GRAINS (20+ items)
  { type: "Grains", category: "Grains", title: "Jowar Sorghum", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop", desc: "Drought-resistant sorghum grains" },
  { type: "Grains", category: "Grains", title: "Maize Corn Grains", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Yellow maize for feed" },
  { type: "Grains", category: "Grains", title: "Bajra Pearl Millet", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Pearl millet grains" },
  { type: "Grains", category: "Grains", title: "Wheat Whole Grain", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Whole wheat grains" },
  { type: "Grains", category: "Grains", title: "Rice Paddy", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Raw rice paddy" },
  { type: "Grains", category: "Grains", title: "Pulses Mix Pack", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Lentil mix pack" },
  { type: "Grains", category: "Grains", title: "Dal Lentils", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Yellow moong dal" },
  { type: "Grains", category: "Grains", title: "Chickpea White", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Dried white chickpeas" },
  { type: "Grains", category: "Grains", title: "Black Gram", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Black beans urad" },
  { type: "Grains", category: "Grains", title: "Green Gram", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Green moong whole" },
  { type: "Grains", category: "Grains", title: "Red Lentils", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Red masur dal split" },
  { type: "Grains", category: "Grains", title: "Arhar Dal", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Pigeon pea dal" },
  { type: "Grains", category: "Grains", title: "Kidney Beans", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Red kidney beans" },
  { type: "Grains", category: "Grains", title: "Black Chickpea", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Kala chana whole" },
  { type: "Grains", category: "Grains", title: "Horse Gram", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Brown horse gram" },
  { type: "Grains", category: "Grains", title: "Peas Dried", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Dried split peas" },
  { type: "Grains", category: "Grains", title: "Fenugreek Seeds", image: "https://images.unsplash.com/photo-1596040901950-35dd537410d0?w=500&auto=format&fit=crop", desc: "Methi seeds for planting" },
  { type: "Grains", category: "Grains", title: "Mustard Seeds", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Black mustard seeds" },
  { type: "Grains", category: "Grains", title: "Sesame Seeds", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "White sesame seeds" },
  { type: "Grains", category: "Grains", title: "Poppy Seeds", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "White poppy seeds khus" },

  // MORE SEEDS (10 items)
  { type: "Seeds", category: "Seeds", title: "Brinjal Seeds", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop", desc: "Hybrid brinjal eggplant seeds" },
  { type: "Seeds", category: "Seeds", title: "Carrot Seeds", image: "https://images.unsplash.com/photo-1599599810694-c6d2b0b07348?w=500&auto=format&fit=crop", desc: "High-yield carrot varieties" },
  { type: "Seeds", category: "Seeds", title: "Radish Seeds", image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop", desc: "Rapid-growing radish seeds" },
  { type: "Seeds", category: "Seeds", title: "Cabbage Seeds", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop", desc: "Green cabbage seed pack" },
  { type: "Seeds", category: "Seeds", title: "Cauliflower Seeds", image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop", desc: "Hybrid cauliflower seeds" },
  { type: "Seeds", category: "Seeds", title: "Spinach Seeds", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop", desc: "Leafy spinach seed pack" },
  { type: "Seeds", category: "Seeds", title: "Bitter Gourd Seeds", image: "https://images.unsplash.com/photo-1599599810694-c6d2b0b07348?w=500&auto=format&fit=crop", desc: "Medicinal bitter gourd seeds" },
  { type: "Seeds", category: "Seeds", title: "Pumpkin Seeds", image: "https://images.unsplash.com/photo-1508747703725-719777637510?w=500&auto=format&fit=crop", desc: "Large pumpkin seed pack" },
  { type: "Seeds", category: "Seeds", title: "Watermelon Seeds", image: "https://images.unsplash.com/photo-1592635059360-6a3e08e6d7c3?w=500&auto=format&fit=crop", desc: "Seedless watermelon seeds" },
  { type: "Seeds", category: "Seeds", title: "Muskmelon Seeds", image: "https://images.unsplash.com/photo-1599599810694-c6d2b0b07348?w=500&auto=format&fit=crop", desc: "Sweet melon seeds" },

  // MORE EQUIPMENT (10 items)
  { type: "Equipment", category: "Equipment", title: "Pump Set 2 HP", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Electric pump set 2 horsepower" },
  { type: "Equipment", category: "Equipment", title: "Tiller Cultivator", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Small farm tiller machine" },
  { type: "Equipment", category: "Equipment", title: "Fog Sprayer", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Cold fog sprayer equipment" },
  { type: "Equipment", category: "Equipment", title: "Mulch Film Roll", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Black plastic mulch film" },
  { type: "Equipment", category: "Equipment", title: "Shade Net", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Green shade net fabric" },
  { type: "Equipment", category: "Equipment", title: "Poly Tunnels", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Greenhouse poly tunnels" },
  { type: "Equipment", category: "Equipment", title: "Vermi Bed Setup", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Complete vermicompost bed" },
  { type: "Equipment", category: "Equipment", title: "Raised Bed Kit", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&auto=format&fit=crop", desc: "Metal raised garden bed" },
  { type: "Equipment", category: "Equipment", title: "Netting Cage", image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop", desc: "Protective bird netting cage" },
  { type: "Equipment", category: "Equipment", title: "Pruning Saw", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop", desc: "Folding pruning saw blade" }
];

const ProductSection = ({ title, products }) => {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
        fontSize: 24,
        fontWeight: 700,
        margin: "0 0 24px 0",
        color: "#1A2E1A"
      }}>
        {title}
      </h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 16
      }}>
        {products.map((product, idx) => (
          <div
            key={idx}
            className="product-card"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              minHeight: 420,
              height: "100%",
              background: "white",
              border: "1px solid #d6e8d6",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(26, 46, 26, 0.08)",
              cursor: "pointer",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 18px 42px rgba(26, 46, 26, 0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(26, 46, 26, 0.08)";
            }}
          >
            <div
              style={{
                flexShrink: 0,
                height: 220,
                background: "#f7faf7",
                borderBottom: "1px solid #d6e8d6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 14,
                overflow: "hidden"
              }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "center"
                }}
              />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16 }}>
              <div
                style={{
                  display: "inline-block",
                  background: "#E8F5E9",
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  color: "#4CAF50",
                  fontWeight: 700,
                  marginBottom: 8,
                  fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
                  width: "fit-content"
                }}
              >
                {product.category}
              </div>
              <h3
                style={{
                  fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1A2E1A",
                  margin: "8px 0 8px 0",
                  minHeight: 36
                }}
              >
                {product.title}
              </h3>
              <p
                style={{
                  color: "#5C7A5C",
                  fontSize: 12,
                  margin: 0,
                  lineHeight: 1.4,
                  fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
                  flex: 1
                }}
              >
                {product.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default function Agro() {
  return (
    <main style={{ background: "#FFFFFF", color: colors.text }}>
      <BannerSlider items={agroBanners} />

      {/* TITLE */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
          fontSize: 42,
          fontWeight: 700,
          margin: "0 0 10px 0",
          color: "#1A2E1A"
        }}>
          Agro Products
        </h1>
        <p style={{
          fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif",
          fontSize: 16,
          color: "#5C7A5C",
          margin: 0
        }}>
          Premium farming solutions and equipment for modern agriculture
        </p>
      </section>

      {/* PRODUCTS SECTIONS */}
      <section style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px 60px" }}>
        <ProductSection
          title="Popular Products"
          products={allAgroProducts.filter(p => p.type === "Popular Products")}
        />

        <ProductSection
          title="Best Selling Products"
          products={allAgroProducts.filter(p => p.type === "Best Selling Products")}
        />

        <ProductSection
          title="Grains Collection"
          products={allAgroProducts.filter(p => p.type === "Grains")}
        />

        <ProductSection
          title="Seeds Varieties"
          products={allAgroProducts.filter(p => p.type === "Seeds")}
        />

        <ProductSection
          title="Farm Equipment"
          products={allAgroProducts.filter(p => p.type === "Equipment")}
        />
      </section>
    </main>
  );
}
