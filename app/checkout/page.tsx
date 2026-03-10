'use client';

import { useCart } from "../context/CartContext";

export default function Checkout() {

  const { cart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  function sendWhatsApp() {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    let message = `🔥 *NEW ORDER — MAD BALLERS* 🔥%0A%0A`;

    cart.forEach(item => {
      message += `• ${item.name}%0A`;
      message += `Size: ${item.size || "Ask customer"}%0A`;
      message += `Price: ₹${item.price}%0A%0A`;
    });

    message += `💰 *Total: ₹${total}*`;

    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const url = `https://wa.me/${phone}?text=${message}`;

    window.open(url, "_blank");
    clearCart();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#000",
      padding: "clamp(16px, 4vw, 40px)",
      paddingTop: "clamp(90px, 12vw, 130px)"
    }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "rgba(10,10,10,.8)",
        backdropFilter: "blur(20px)",
        borderRadius: "clamp(16px, 4vw, 30px)",
        border: "1px solid rgba(255,120,0,.2)",
        padding: "clamp(20px, 5vw, 40px)"
      }}>

        <h1 style={{
          fontSize: "clamp(28px, 7vw, 48px)",
          fontWeight: "900",
          marginBottom: "28px"
        }}>
          Checkout
        </h1>

        {cart.length === 0 && (
          <p style={{ color: "#666", textAlign: "center", padding: "40px 0" }}>
            Your cart is empty
          </p>
        )}

        {cart.map(item => (
          <div
            key={`${item.id}-${item.size}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "clamp(10px, 3vw, 18px)",
              background: "#0a0a0a",
              padding: "clamp(12px, 3vw, 16px)",
              borderRadius: "14px",
              marginBottom: "12px",
              border: "1px solid rgba(255,120,0,.15)"
            }}
          >
            {/* IMAGE */}
            <img
              src={item.image}
              style={{
                width: "clamp(60px, 15vw, 90px)",
                height: "clamp(60px, 15vw, 90px)",
                objectFit: "contain",
                borderRadius: "10px",
                background: "#050505",
                padding: "6px",
                flexShrink: 0
              }}
            />

            {/* INFO */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                color: "white", fontWeight: "800",
                fontSize: "clamp(13px, 3vw, 16px)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
              }}>
                {item.name}
              </h3>
              <p style={{ color: "#ff7a00", fontSize: "clamp(13px, 3vw, 15px)", fontWeight: "700" }}>
                ₹{item.price}
              </p>
              {item.size && (
                <p style={{ color: "#999", fontSize: "clamp(11px, 2.5vw, 13px)" }}>
                  Size: {item.size}
                </p>
              )}
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <>
            <h2 style={{ marginTop: "28px", fontSize: "clamp(18px, 4vw, 24px)" }}>
              Total: <span style={{ color: "#ff7a00" }}>₹{total}</span>
            </h2>

            <button
              onClick={sendWhatsApp}
              style={{
                marginTop: "24px",
                width: "100%",
                padding: "clamp(14px, 4vw, 18px)",
                borderRadius: "14px",
                border: "none",
                background: "linear-gradient(90deg,#ff7a00,#ffb347)",
                color: "#000",
                fontWeight: "900",
                fontSize: "clamp(15px, 3.5vw, 18px)",
                cursor: "pointer"
              }}
            >
              Order on WhatsApp 🚀
            </button>
          </>
        )}
      </div>
    </div>
  );
}