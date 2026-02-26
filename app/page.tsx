'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "./context/CartContext";
import Link from "next/link";

/* ✅ TEMP FIX (remove import error) */
type Product = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  featured?: boolean;
  sizes?: Record<string, number>;
};

export default function Home(){

const [products,setProducts] = useState<Product[]>([]);
const [selectedCategory,setSelectedCategory] = useState("featured");

const [popupProduct,setPopupProduct] = useState<Product | null>(null);
const [selectedSize,setSelectedSize] = useState<string | null>(null);

const {addToCart} = useCart();

/* ================= FETCH ================= */

useEffect(()=>{
async function fetchProducts(){
const snapshot = await getDocs(collection(db,"products"));
const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
})) as Product[];
setProducts(list);
}
fetchProducts();
},[]);

/* ================= FILTER ================= */

const filtered = products.filter(product=>{
if(selectedCategory === "featured") return product.featured === true;
return product.category === selectedCategory;
});

return(

<div style={{
background:"#000",
minHeight:"100vh"
}}>

{/* ================= HERO ================= */}

<div style={{
height:"100vh",
position:"fixed",
top:0,
left:0,
width:"100%",
zIndex:-1,
overflow:"hidden"
}}>

<img
src="/images/hero.png"
style={{
width:"100%",
height:"100%",
objectFit:"cover",   // ✅ FIXED (no cropping issue now)
filter:"brightness(.4)"
}}
/>

<div style={{
position:"absolute",
width:"100%",
height:"100%",
background:"linear-gradient(to bottom, rgba(0,0,0,0.2), #000)"
}}/>

<div style={{
position:"absolute",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
textAlign:"center",
padding:"0 20px"
}}>

<h1 style={{
fontSize:"clamp(32px,8vw,120px)",   // ✅ MOBILE FIX
fontWeight:900,
letterSpacing:"-2px",
background:"linear-gradient(90deg,#ff7a00,#ffffff)",
WebkitBackgroundClip:"text",
color:"transparent",
whiteSpace:"nowrap"   // ✅ FORCE 1 LINE
}}>
MAD BALLERS
</h1>

<p style={{
color:"#ccc",
fontSize:"clamp(14px,3vw,20px)"
}}>
Premium Football Store
</p>

</div>
</div>


{/* ================= PRODUCTS ================= */}

<div style={{
marginTop:"100vh",
background:"#050505",
borderTopLeftRadius:"40px",
borderTopRightRadius:"40px",
padding:"50px 20px"
}}>


{/* CATEGORY */}

<div style={{
display:"flex",
gap:"10px",
overflowX:"auto",
marginBottom:"30px"
}}>

{["featured","boots","jerseys","gloves","jackets","balls","gear"].map(cat=>(

<button
key={cat}
onClick={()=>setSelectedCategory(cat)}
style={{
padding:"10px 18px",
borderRadius:"999px",
border:"1px solid #222",
background:selectedCategory===cat ? "#ff7a00" : "#111",
color:selectedCategory===cat ? "#000" : "#aaa",
fontWeight:"700",
whiteSpace:"nowrap"
}}
>
{cat.toUpperCase()}
</button>

))}

</div>


{/* PRODUCT GRID */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",  // ✅ MOBILE FIX
gap:"16px"
}}>

{filtered.map(product=>(

<div
key={product.id}
style={{
background:"#0a0a0a",
padding:"14px",
borderRadius:"16px",
border:"1px solid #111",
transition:"0.3s"
}}
onMouseEnter={(e)=>{
e.currentTarget.style.transform="translateY(-6px)";
}}
onMouseLeave={(e)=>{
e.currentTarget.style.transform="translateY(0)";
}}
>

<Link href={`/product/${product.id}`}>
<img
src={product.images?.[0] || "/placeholder.png"}
style={{
width:"100%",
height:"140px",   // ✅ MOBILE FIX
objectFit:"contain"
}}
/>
</Link>

<h3 style={{
color:"white",
fontSize:"14px",
marginTop:"10px"
}}>
{product.name}
</h3>

<p style={{
color:"#ff7a00",
fontWeight:"800",
fontSize:"14px"
}}>
₹{product.price}
</p>


{/* ✅ FIXED SIZE FLOW */}

<button
onClick={()=>{
setPopupProduct(product);
setSelectedSize(null);
}}
style={{
marginTop:"8px",
width:"100%",
padding:"10px",
borderRadius:"10px",
border:"none",
background:"#ff7a00",
color:"#000",
fontWeight:"800"
}}
>
Add
</button>

</div>

))}

</div>

</div>


{/* ================= SIZE POPUP ================= */}

{popupProduct && (

<div
onClick={()=>setPopupProduct(null)}
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,.9)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:9999
}}
>

<div
onClick={(e)=>e.stopPropagation()}
style={{
background:"#050505",
padding:"25px",
borderRadius:"20px",
width:"90%",
maxWidth:"400px"
}}
>

<img
src={popupProduct.images?.[0]}
style={{width:"100%"}}
/>

<h2 style={{color:"white"}}>
{popupProduct.name}
</h2>

<p style={{color:"#ff7a00"}}>
₹{popupProduct.price}
</p>


{/* SIZES */}

<div style={{
display:"flex",
flexWrap:"wrap",
gap:"10px",
margin:"15px 0"
}}>

{Object.entries(popupProduct.sizes || {}).map(([size,stock])=>{

const out = Number(stock)<=0;

return(

<button
key={size}
disabled={out}
onClick={()=>setSelectedSize(size)}
style={{
width:"44px",
height:"44px",
borderRadius:"50%",
border:selectedSize===size
? "2px solid #ff7a00"
: "1px solid #333",
background: out ? "#111" : "#000",
color: out ? "#555" : "white",
opacity: out ? 0.4 : 1
}}
>
{size}
</button>

);

})}

</div>


<button
disabled={!selectedSize}
onClick={()=>{

addToCart({
id:popupProduct.id,
name:popupProduct.name,
price:popupProduct.price,
image:popupProduct.images?.[0] || "",
size:selectedSize!
});

setPopupProduct(null);

}}
style={{
width:"100%",
padding:"14px",
background:selectedSize ? "#ff7a00" : "#222",
border:"none",
borderRadius:"10px",
fontWeight:"900"
}}
>
Add To Cart
</button>

</div>
</div>

)}

</div>
);
}