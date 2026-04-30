import { deliveryPartners } from "../../data";
import { title } from "./AdminDashboard";
import { Table } from "./AdminUsers";
export default function AdminPartners(){const saved=JSON.parse(localStorage.getItem("yubiDeliveryPartners")||"null")||deliveryPartners; return <div><h1 style={title}>Delivery Partners</h1><Table headers={["ID","Name","Phone","Status","Current Order","Deliveries","Rating","Earnings"]} rows={saved.map(p=>[p.id,p.name,p.phone,p.status,p.currentOrderId||"Free",p.totalDeliveries,p.rating,`₹${p.earnings}`])}/></div>}
