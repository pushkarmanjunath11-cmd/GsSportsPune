'use client';

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartDrawer({ open, setOpen }: any) {

  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.6)",
            zIndex: 9998
          }}
        />
      )}

      {/* DRAWER */}
      <div style={{
        position: "fixed",
        top: 0,
        right: open ? "0px" : "-100vw",
        width: "min(420px, 100vw)",       // ✅ full width on mobile
        height: "100vh",
        background: "#0b0d11",
        boxShadow: "-10px 0 40px rgba(0,0,0,.6)",
        transition: "0.35s",
        zIndex: 9999,
        padding: "clamp(16px, 4vw, 24px)",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box"
      }}>

        {/* HEADER */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px"
        }}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)" }}>Your Cart</h2>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "rgba(255,255,255,.08)",
              border: "none",
              color: "var(--text)",
              fontSize: "20px",
              cursor: "pointer",
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            ✕
          </button>
        </div>

        {/* ITEMS */}
        <div style={{ flex: 1, overflowY: "auto", marginTop: "16px" }}>

          {cart.length === 0 && (
            <p style={{ color: "#666", textAlign: "center", marginTop: "40px" }}>
              Your cart is empty
            </p>
          )}

          {cart.map((item, index) => (
            <div key={`${item.id}-${item.size}-${index}`} style={{
              display: "flex",
              gap: "12px",
              marginBottom: "16px",
              background: "#111",
              padding: "12px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,.05)"
            }}>
              <img
                src={item.image}
                style={{
                  width: "clamp(55px, 15vw, 70px)",
                  height: "clamp(55px, 15vw, 70px)",
                  objectFit: "cover",
                  borderRadius: "8px",
                  flexShrink: 0
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontWeight: "700", fontSize: "clamp(12px, 3vw, 14px)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>
                  {item.name}
                </p>
                <p style={{ color: "#999", fontSize: "12px" }}>Size: {item.size}</p>
                <p style={{ color: "#ff7a00", fontWeight: "700", fontSize: "14px" }}>₹{item.price}</p>
              </div>

              <button
                onClick={() => removeFromCart(index)}
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "none",
                  color: "#999",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  flexShrink: 0,
                  alignSelf: "center",
                  fontSize: "13px"
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
              <span style={{ color: "#999" }}>Total</span>
              <span style={{ color: "#ff7a00", fontWeight: "900", fontSize: "18px" }}>₹{total}</span>
            </div>
            <Link href="/checkout" onClick={() => setOpen(false)}>
              <button style={{
                width: "100%",
                padding: "16px",
                background: "linear-gradient(90deg,#ff7a00,#ffb347)",
                border: "none",
                borderRadius: "12px",
                fontWeight: "900",
                fontSize: "16px",
                cursor: "pointer",
                color: "#000"
              }}>
                Checkout 🚀
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}