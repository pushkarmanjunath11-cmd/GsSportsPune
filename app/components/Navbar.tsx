"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setCartOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", zIndex: 9999,
        background: "rgba(0,0,0,.75)", backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,140,0,.2)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        height: "70px", padding: "0 5vw", boxSizing: "border-box"
      }}>

        {/* LOGO */}
        <Link href="/" style={{
          fontWeight: 900, fontSize: "clamp(18px, 4vw, 26px)",
          letterSpacing: "1px", textDecoration: "none"
        }}>
          <span style={{
            background: "linear-gradient(90deg,#ffffff,#9ca3af)",
            WebkitBackgroundClip: "text", color: "transparent"
          }}>
            GS Sports
          </span>
        </Link>

        {/* RIGHT */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => setCartOpen(true)} style={{
            padding: "8px 16px", borderRadius: "12px",
            border: "1px solid rgba(255,255,255,.08)",
            background: "#ffffff", color: "#000",
            fontWeight: "800", cursor: "pointer", fontSize: "14px"
          }}>
            🛒 {cart.length}
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} setOpen={setCartOpen} />
    </>
  );
}