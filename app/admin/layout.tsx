'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AdminLayout({
children,
}:{
children:React.ReactNode;
}){

const path = usePathname();
const router = useRouter();
const [allowed,setAllowed] = useState(false);

/* NAV STYLE */

const nav = (href:string)=>({
padding:"14px 18px",
borderRadius:"12px",
marginBottom:"12px",
display:"block",
fontWeight:"700",
textDecoration:"none",
background:
path === href
? "linear-gradient(135deg,#ff7a00,#ffb347)"
: "transparent",
color: path === href ? "#02120a" : "#9ca3af",
transition:"0.25s"
});

return(

<div style={{
display:"flex",
minHeight:"100vh",
background:"linear-gradient(180deg,#020617,#000)"
}}>

{/* SIDEBAR */}

<div style={{
width:"300px",
background: "#080808",
color:"black",
boxShadow:"20px 0 60px rgba(0,0,0,.8)",
padding:"30px",
borderRight:"1px solid rgba(255,255,255,.06)",
backdropFilter:"blur(20px)"
}}>

<h1 style={{
fontSize:"28px",
fontWeight:"900",
letterSpacing:"1px",
marginBottom:"40px",
color:"linear-gradient(90deg,#ff7a00,#ffb347)"
}}>
⚡ Boots Vault Admin
</h1>

<Link href="/admin" style={nav("/admin")}>
Dashboard
</Link>

<Link href="/admin/add-product" style={nav("/admin/add-product")}>
Add Product
</Link>

<Link href="/admin/orders" style={nav("/admin/orders")}>
Orders
</Link>

<Link href="/admin/products" style={nav("/admin/products")}>
Products
</Link>

<Link href="/admin/analytics" style={nav("/admin/analytics")}>
Analytics
</Link>

</div>

{/* MAIN */}

<div style={{
flex:1,
padding:"50px"
}}>
{children}
</div>

</div>
);
}
