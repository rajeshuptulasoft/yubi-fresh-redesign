// Sample users — replaces auth.users + profiles tables.
// Demo logins (password is checked client-side only):
//   customer@yubi.com / password
//   admin@yubi.com / password
//   delivery@yubi.com / password

export const users = [
  {
    id: "u-customer-1",
    email: "customer@yubi.com",
    password: "password",
    full_name: "Aarav Mehta",
    phone: "+91 98765 11111",
    address: "12 Brigade Road, Bengaluru 560001",
    role: "customer",
    is_online: true,
    avatar: "https://i.pravatar.cc/200?img=12",
  },
  {
    id: "u-customer-2",
    email: "priya@yubi.com",
    password: "password",
    full_name: "Priya Iyer",
    phone: "+91 98765 22222",
    address: "45 MG Road, Pune 411001",
    role: "customer",
    is_online: false,
    avatar: "https://i.pravatar.cc/200?img=47",
  },
  {
    id: "u-admin-1",
    email: "admin@yubi.com",
    password: "password",
    full_name: "YUBI Admin",
    phone: "+91 98765 99999",
    address: "YUBI HQ, Green Valley, Bengaluru",
    role: "admin",
    is_online: true,
    avatar: "https://i.pravatar.cc/200?img=68",
  },
  {
    id: "u-delivery-1",
    email: "delivery@yubi.com",
    password: "password",
    full_name: "Ravi Kumar",
    phone: "+91 98765 33333",
    address: "HSR Layout, Bengaluru",
    role: "delivery_partner",
    is_online: true,
    avatar: "https://i.pravatar.cc/200?img=33",
  },
  {
    id: "u-delivery-2",
    email: "meera@yubi.com",
    password: "password",
    full_name: "Meera Shah",
    phone: "+91 98765 44444",
    address: "Indiranagar, Bengaluru",
    role: "delivery_partner",
    is_online: true,
    avatar: "https://i.pravatar.cc/200?img=45",
  },
  {
    id: "u-delivery-3",
    email: "arjun@yubi.com",
    password: "password",
    full_name: "Arjun Singh",
    phone: "+91 98765 55555",
    address: "Koramangala, Bengaluru",
    role: "delivery_partner",
    is_online: false,
    avatar: "https://i.pravatar.cc/200?img=15",
  },
];
