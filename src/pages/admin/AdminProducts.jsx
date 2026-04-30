import { products } from "../../data";
import { title } from "./AdminDashboard";
import { Table } from "./AdminUsers";
export default function AdminProducts(){return <div><h1 style={title}>Products</h1><Table headers={["ID","Name","Category","Price","Stock"]} rows={products.map(p=>[p.id,p.name,p.category,`₹${p.price}`,p.inStock?"In Stock":"Out"])} /></div>}
