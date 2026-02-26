'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { 
collection,
getDocs,
doc,
updateDoc,
getDoc
} from "firebase/firestore";

async function reduceStock(order:any){

for(const item of order.items){

const ref = doc(db,"products",item.id);
const snap = await getDoc(ref);

if(!snap.exists()) continue;

const data = snap.data();

const sizes = {...data.sizes};

sizes[item.size] -= 1;

await updateDoc(ref,{sizes});

}

}

export default function OrdersPage(){

const [orders,setOrders] = useState<any[]>([]);

useEffect(()=>{

async function fetchOrders(){

const snapshot = await getDocs(collection(db,"orders"));

const list = snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setOrders(list);
}

fetchOrders();

},[]);

async function reduceStock(order:any){

for(const item of order.items){

const productRef = doc(db,"products",item.id);

const snap = await getDoc(productRef);

if(!snap.exists()) continue;

const product = snap.data();

const updatedSizes = {
...product.sizes,
[item.size]: Math.max(0, (product.sizes?.[item.size] || 0) - 1)
};

await updateDoc(productRef,{
sizes: updatedSizes
});

}
}

/* 🔥 CHANGE STATUS */

async function changeStatus(order:any,status:string){

if(status === "Confirmed"){
await reduceStock(order);
}

await updateDoc(doc(db,"orders",order.id),{
status
});

setOrders(prev =>
prev.map(o =>
o.id === order.id ? {...o,status} : o
));

}

return(

<div>

<h1 style={{
    marginBottom:"30px",
    marginTop:"80px"
}}>
Orders
</h1>

{orders.map(order=>(

<div key={order.id}
style={{
background:"radial-gradient(circle at top,#111217,#050507)",
border:"1px solid rgba(34,197,94,.15)",
boxShadow:"0 20px 60px rgba(0,0,0,.6)",
padding:"20px",
borderRadius:"14px",
marginBottom:"20px"
}}
>

<h3>₹{order.total}</h3>

<p>Status: 
<span style={{
color:
order.status === "Delivered"
? "#22c55e"
: order.status === "Shipped"
? "#60a5fa"
: "#facc15"
}}>
</span>
</p>

<select
value={order.status}
onChange={(e)=>changeStatus(order,e.target.value)}
style={{
padding:"8px",
borderRadius:"6px",
marginTop:"10px"
}}
>
<option>Confirmed</option>
<option>Processing</option>
<option>Shipped</option>
<option>Out for Delivery</option>
<option>Delivered</option>
</select>

<button onClick={()=>{
reduceStock(order);
}}>
Confirm Order
</button>

<div style={{marginTop:"15px"}}>

{order.items.map((item:any)=>(
<p key={item.name}>
• {item.name} — Size {item.size}
</p>
))}

</div>

</div>

))}

</div>
);
}
