// Convenience export of just the delivery partners (also live in users.js).
import { users } from "./users";

export const deliveryPartners = users
  .filter((u) => u.role === "delivery_partner")
  .map((u) => ({
    id: u.id,
    full_name: u.full_name,
    phone: u.phone,
    avatar: u.avatar,
    is_online: u.is_online,
    rating: 4.7 + Math.random() * 0.3,
    completed_deliveries: 200 + Math.floor(Math.random() * 1500),
  }));
