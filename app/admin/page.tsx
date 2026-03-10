'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs,addDoc } from "firebase/firestore";

export default function AdminDashboard(){

const [orders,setOrders] = useState(0);
const [revenue,setRevenue] = useState(0);
const [products,setProducts] = useState(0);

useEffect(() => {
  async function load() {
    try {
      const ordersSnap = await getDocs(collection(db, "orders"));
      const productsSnap = await getDocs(collection(db, "products"));

      let total = 0;
      ordersSnap.forEach((doc: any) => { total += doc.data().total || 0; });

      setOrders(ordersSnap.size);
      setRevenue(total);
      setProducts(productsSnap.size);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    }
  }
  load();
}, []);

const card = {
flex:1,
background:"var(--card)",
padding:"35px",
borderRadius:"18px",
border:"1px solid rgba(255,122,0,.15)",
boxShadow:"0 20px 60px rgba(0,0,0,.7)"
};

return(

<div>

<h1 style={{
fontSize:"42px",
fontWeight:"900",
marginBottom:"40px",
marginTop:"80px",
}}>
Admin Dashboard
</h1>

<div style={{
display:"flex",
gap:"25px"
}}>

<div style={card}>
<h2>Total Revenue</h2>
<p style={{fontSize:"28px",color:"#ff7a00"}}>
₹{revenue}
</p>
</div>

<div style={card}>
<h2>Total Orders</h2>
<p style={{fontSize:"28px"}}>
{orders}
</p>
</div>

<div style={card}>
<h2>Products</h2>
<p style={{fontSize:"28px"}}>
{products}
</p>
</div>

</div>

</div>
);
}
