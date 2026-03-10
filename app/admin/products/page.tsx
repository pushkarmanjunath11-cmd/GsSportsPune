'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
collection,
getDocs,
doc,
deleteDoc,
updateDoc
} from "firebase/firestore";

export default function ProductsPage(){

const [products,setProducts] = useState<any[]>([]);
const [loading,setLoading] = useState(true);

useEffect(() => {
  async function fetchProducts() {
    try {
      const snap = await getDocs(collection(db, "products"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list as any[]);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      alert("❌ Could not load products. Please refresh.");
    } finally {
      setLoading(false);
    }
  }
  fetchProducts();
}, []);

/* DELETE PRODUCT */

async function deleteProduct(id: string) {
  const confirmDelete = confirm("Delete this product permanently?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "products", id));
    setProducts(prev => prev.filter(p => p.id !== id));
  } catch (err) {
    console.error("Failed to delete product:", err);
    alert("❌ Could not delete product. Try again.");
  }
}

/* UPDATE STOCK */

async function updateStock(id: string, size: string, value: number) {
  const product = products.find(p => p.id === id);
  const newSizes = { ...product.sizes, [size]: value };

  try {
    await updateDoc(doc(db, "products", id), { sizes: newSizes });
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, sizes: newSizes } : p)
    );
  } catch (err) {
    console.error("Failed to update stock:", err);
    alert("❌ Could not update stock. Try again.");
  }
}

/* LOW STOCK CHECK */

function isLowStock(product:any){

if(!product.sizes) return false;

return Object.values(product.sizes)
.some((qty:any)=> qty <= 2); // 🔥 change number if you want
}

if(loading){
return <h2 style={{padding:"40px"}}>Loading Products...</h2>
}

return(

<div>

<h1 style={{
marginBottom:"30px",
fontWeight:"900",
fontSize:"32px",
marginTop:"80px"
}}>
🔥 Products Manager
</h1>


{/* PRODUCT LIST */}

{products.map(product=>(

<div key={product.id}

style={{
background:"linear-gradient(145deg,#07122a,#020617)",
padding:"25px",
borderRadius:"18px",
marginBottom:"25px",
border: isLowStock(product)
? "2px solid #ef4444"
: "1px solid rgba(34,197,94,.15)",
boxShadow:"0 20px 60px rgba(0,0,0,.6)"
}}
>

{/* TOP SECTION */}

<div style={{
display:"flex",
gap:"20px",
alignItems:"center"
}}>

<img
src={product.images?.[0] || product.image || "/placeholder.png"}
width={90}
style={{
borderRadius:"10px",
objectFit:"cover",
height:"90px"
}}
/>

<div style={{flex:1}}>

<h2 style={{margin:0}}>
{product.name}
</h2>

<p style={{
color:"#2563eb",
fontWeight:"800",
fontSize:"18px"
}}>
₹{product.price}
</p>

{/* LOW STOCK BADGE */}

{isLowStock(product) && (

<span style={{
background:"#ef4444",
padding:"6px 10px",
borderRadius:"8px",
fontSize:"12px",
fontWeight:"700"
}}>
LOW STOCK ⚠️
</span>

)}

</div>

<button
onClick={()=>deleteProduct(product.id)}
style={{
background:"var(--primary)",
border:"none",
color:"var(--text)",
padding:"10px 16px",
borderRadius:"10px",
cursor:"pointer",
fontWeight:"700"
}}
>
Delete
</button>

</div>


{/* STOCK EDITOR */}

<div style={{
marginTop:"20px",
display:"flex",
flexWrap:"wrap",
gap:"14px"
}}>

{Object.entries(product.sizes || {}).map(([size,qty]:any)=>(

<div key={size}
style={{
background:"#020617",
padding:"10px",
borderRadius:"10px",
border:"1px solid rgba(255,255,255,.08)"
}}
>

<p style={{
margin:"0 0 6px 0",
fontSize:"13px",
opacity:.7
}}>
Size {size}
</p>

<input
type="number"
defaultValue={qty}
onBlur={(e)=>
updateStock(
product.id,
size,
Number(e.target.value)
)
}
style={{
width:"70px",
padding:"6px",
borderRadius:"6px",
background:"#07122a",
border:"none",
color:"var(--text)"
}}
/>

</div>

))}

</div>

</div>

))}

</div>
);
}
