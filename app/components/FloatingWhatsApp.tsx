export default function FloatingWhatsApp(){

return(

<a
href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
target="_blank"
style={{
position:"fixed",
bottom:"25px",
right:"25px",
background:"#22c55e",
width:"65px",
height:"65px",
borderRadius:"50%",
display:"flex",
justifyContent:"center",
alignItems:"center",
fontSize:"30px",
boxShadow:"0 10px 30px rgba(0,0,0,.5)",
zIndex:999
}}
>

💬

</a>

);
}