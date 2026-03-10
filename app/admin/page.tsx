'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminDashboard() {

  const [orders, setOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [products, setProducts] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const ordersSnap = await getDocs(collection(db, "orders"));
        const productsSnap = await getDocs(collection(db, "products"));

        let total = 0;
        ordersSnap.forEach((doc: any) => {
          total += doc.data().total || 0;
        });

        setOrders(ordersSnap.size);
        setRevenue(total);
        setProducts(productsSnap.size);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      }
    }
    load();
  }, []);

  const stats = [
    { label: "Total Revenue", value: `₹${revenue}`, color: "#2563eb" },
    { label: "Total Orders", value: orders, color: "white" },
    { label: "Products", value: products, color: "white" },
  ];

  return (
    <div style={{ padding: "clamp(16px, 4vw, 40px)" }}>

      <h1 style={{
        fontSize: "clamp(24px, 5vw, 42px)",
        fontWeight: "900",
        marginBottom: "32px",
        marginTop: "clamp(16px, 5vw, 80px)",
      }}>
        Admin Dashboard
      </h1>

      {/* STATS GRID — stacks on mobile */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "16px",
        width: "100%"
      }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: "var(--card)",
            padding: "clamp(20px, 4vw, 35px)",
            borderRadius: "18px",
            border: "1px solid rgba(37,99,235,.15)",
            boxShadow: "0 20px 60px rgba(0,0,0,.7)",
            minWidth: 0   // prevents overflow
          }}>
            <h2 style={{
              fontSize: "clamp(13px, 3vw, 16px)",
              fontWeight: "700",
              color: "#9ca3af",
              marginBottom: "12px"
            }}>
              {stat.label}
            </h2>
            <p style={{
              fontSize: "clamp(22px, 5vw, 32px)",
              fontWeight: "900",
              color: stat.color
            }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK LINKS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginTop: "32px"
      }}>
        {[
          { label: "➕ Add Product", href: "/admin/add-product" },
          { label: "📦 View Orders", href: "/admin/orders" },
          { label: "👟 Manage Products", href: "/admin/products" },
        ].map(link => (
          <a key={link.href} href={link.href} style={{
            display: "block",
            padding: "16px",
            background: "#0f172a",
            borderRadius: "14px",
            border: "1px solid rgba(37,99,235,.15)",
            color: "white",
            fontWeight: "700",
            textDecoration: "none",
            fontSize: "clamp(13px, 3vw, 15px)",
            textAlign: "center"
          }}>
            {link.label}
          </a>
        ))}
      </div>

    </div>
  );
}