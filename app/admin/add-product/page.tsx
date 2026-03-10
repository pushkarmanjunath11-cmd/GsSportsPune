'use client';

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddProduct(){

const router = useRouter();

/* SIZE MAP */

const sizeMap:any = {
boots:["6","6.5","7","7.5","8","8.5","9","9.5","10","10.5","11"],
jerseys:["S","M","L","XL"],
gloves:["7","8","9","10"],
jackets:["S","M","L","XL"],
balls:["3","4","5"],
gear:["Standard"]
};

/* STATE */

const [name,setName] = useState("");
const [price,setPrice] = useState("");
const [category,setCategory] = useState("boots");
const [featured,setFeatured] = useState(false);
const [sizes,setSizes] = useState<Record<string,number>>({});
const [images,setImages] = useState<string[]>([""]);
const [loading,setLoading] = useState(false);


/* AUTO SIZE RESET */

useEffect(()=>{

const selectedSizes = sizeMap[category];

const emptyStock = Object.fromEntries(
selectedSizes.map((size:string)=>[size,0])
);

setSizes(emptyStock);

},[category]);


/* ADD PRODUCT */

async function addProduct() {
  const cleanImages = images.filter(img => img.trim() !== "");

  if (!name || !price || cleanImages.length === 0) {
    alert("Fill all fields!");
    return;
  }

  const formattedSizes = Object.fromEntries(
    Object.entries(sizes).map(([size, qty]) => [size, Number(qty) || 0])
  );

  if (Object.values(formattedSizes).every(qty => qty <= 0)) {
    alert("Add stock before creating product");
    return;
  }

  setLoading(true);
  try {
    await addDoc(collection(db, "products"), {
      name,
      price: Number(price),
      images: cleanImages,
      category,
      sizes: formattedSizes,
      featured,
      createdAt: new Date()
    });
    alert("✅ Product Added!");
    router.push("/admin/products");
  } catch (err) {
    console.error("Failed to add product:", err);
    alert("❌ Failed to add product. Please try again.");
  } finally {
    setLoading(false); // ✅ always resets, even on failure
  }
}

/* UI */

return(

<div style={{
maxWidth:"900px",
margin:"auto",
padding:"40px"
}}>

<h1 style={{
fontSize:"34px",
fontWeight:"900",
marginBottom:"30px"
}}>
Add New Product
</h1>


<div style={{
background:"#07122a",
padding:"40px",
borderRadius:"18px",
border:"1px solid rgba(34,197,94,.2)",
boxShadow:"0 30px 80px rgba(0,0,0,.6)",
display:"flex",
flexDirection:"column",
gap:"18px"
}}>

<input
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
style={input}
/>

<select
value={category}
onChange={(e)=>setCategory(e.target.value)}
style={input}
>
<option value="boots">Boots</option>
<option value="jerseys">Jerseys</option>
<option value="gloves">Gloves</option>
<option value="jackets">Jackets</option>
<option value="balls">Balls</option>
<option value="gear">Gear</option>
</select>

<input
placeholder="Price"
value={price}
onChange={(e)=>setPrice(e.target.value)}
style={input}
/>

{/* IMAGES */}

<h3>Product Images</h3>

{images.map((img,index)=>(

<input
key={index}
placeholder={`Image ${index+1} URL`}
value={img}
onChange={(e)=>{
const updated = [...images];
updated[index] = e.target.value;
setImages(updated);
}}
style={input}
/>

))}

<button
onClick={()=>setImages([...images,""])}
style={secondaryBtn}
>
+ Add Another Image
</button>


<label style={{marginTop:"10px"}}>
<input
type="checkbox"
checked={featured}
onChange={(e)=>setFeatured(e.target.checked)}
/>
 Featured Product
</label>


{/* STOCK */}

<h3>Stock</h3>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",
gap:"10px"
}}>

{Object.keys(sizes).map(size => (

<input
key={size}
placeholder={`Size ${size}`}
value={sizes[size] || ""}
onChange={(e)=>
setSizes({
...sizes,
[size]:Number(e.target.value)
})
}
style={input}
/>

))}

</div>


<button
onClick={addProduct}
disabled={loading}
style={{
padding:"18px",
background:"var(--primary)",
border:"none",
borderRadius:"14px",
fontWeight:"900",
fontSize:"18px",
cursor:"pointer",
marginTop:"10px"
}}
>
{loading ? "Adding..." : "Add Product"}
</button>

</div>
</div>
);
}

const input = {
padding:"14px",
borderRadius:"10px",
border:"1px solid rgba(255,255,255,.08)",
background:"#020617",
color:"var(--text)"
};

const secondaryBtn = {
padding:"10px",
background:"#111",
border:"1px solid rgba(255,255,255,.1)",
borderRadius:"10px",
cursor:"pointer"
};