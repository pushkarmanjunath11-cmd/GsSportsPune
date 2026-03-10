'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const path = usePathname();
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  /* AUTH GUARD */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAllowed(true);
      } else {
        router.replace("/login");
      }
      setChecking(false);
    });
    return () => unsub();
  }, []);

  if (checking) {
    return (
      <div style={{
        height: "100vh", display: "flex",
        justifyContent: "center", alignItems: "center",
        background: "#000", color: "white", fontSize: "18px"
      }}>
        Checking access...
      </div>
    );
  }

  if (!allowed) return null;

  const nav = (href: string) => ({
    padding: "12px 16px",
    borderRadius: "10px",
    marginBottom: "8px",
    display: "block",
    fontWeight: "700",
    textDecoration: "none",
    fontSize: "clamp(13px, 2vw, 15px)",
    background: path === href
      ? "linear-gradient(135deg,#ff7a00,#ffb347)"
      : "transparent",
    color: path === href ? "#02120a" : "#9ca3af",
    transition: "0.25s"
  });

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(180deg,#020617,#000)",
      flexDirection: "row"
    }}>

      {/* MOBILE TOP BAR */}
      <div style={{
        display: "none",
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "60px",
        background: "#080808",
        borderBottom: "1px solid rgba(255,255,255,.06)",
        zIndex: 1000,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px"
      }} className="adminMobileBar">
        <span style={{ color: "white", fontWeight: 900, fontSize: "16px" }}>⚡ Admin</span>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,.1)",
            color: "white", padding: "8px 12px", borderRadius: "8px", cursor: "pointer"
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* SIDEBAR */}
      <div
        className="adminSidebar"
        style={{
          width: "260px",
          background: "#080808",
          boxShadow: "20px 0 60px rgba(0,0,0,.8)",
          padding: "30px 20px",
          borderRight: "1px solid rgba(255,255,255,.06)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column"
        }}
      >
        <h1 style={{
          fontSize: "clamp(16px, 2vw, 22px)",
          fontWeight: "900",
          marginTop: "80px",
          marginBottom: "32px",
          color: "white",
          textAlign: "center"
        }}>
          ⚡ Boots Vault Admin
        </h1>

        <Link href="/admin" style={nav("/admin")}>📊 Dashboard</Link>
        <Link href="/admin/add-product" style={nav("/admin/add-product")}>➕ Add Product</Link>
        <Link href="/admin/orders" style={nav("/admin/orders")}>📦 Orders</Link>
        <Link href="/admin/products" style={nav("/admin/products")}>👟 Products</Link>

        <div style={{ flex: 1 }} />

        <button
          onClick={() => auth.signOut().then(() => router.replace("/login"))}
          style={{
            marginTop: "24px",
            width: "100%",
            padding: "12px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: "10px",
            color: "#9ca3af",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Sign Out
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          top: "60px", left: 0, right: 0,
          background: "#080808",
          borderBottom: "1px solid rgba(255,255,255,.06)",
          zIndex: 999,
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
          {[
            { href: "/admin", label: "📊 Dashboard" },
            { href: "/admin/add-product", label: "➕ Add Product" },
            { href: "/admin/orders", label: "📦 Orders" },
            { href: "/admin/products", label: "👟 Products" },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                fontWeight: "700",
                textDecoration: "none",
                background: path === item.href ? "linear-gradient(135deg,#ff7a00,#ffb347)" : "transparent",
                color: path === item.href ? "#02120a" : "#9ca3af",
              }}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => auth.signOut().then(() => router.replace("/login"))}
            style={{
              marginTop: "8px", padding: "12px",
              background: "transparent", border: "1px solid rgba(255,255,255,.1)",
              borderRadius: "10px", color: "#9ca3af", fontWeight: "700", cursor: "pointer"
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{
        flex: 1,
        padding: "clamp(16px, 4vw, 50px)",
        paddingTop: "clamp(80px, 10vw, 80px)",
        overflowX: "hidden"
      }}>
        {children}
      </div>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @media (max-width: 768px) {
          .adminSidebar { display: none !important; }
          .adminMobileBar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}