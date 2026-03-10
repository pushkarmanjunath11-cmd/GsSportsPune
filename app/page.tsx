'use client';

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useCart } from "./context/CartContext";
import Link from "next/link";
import Footer from "./components/Footer";

type Product = {
  id: string;
  name: string;
  price: number;
  images?: string[];
  category?: string;
  featured?: boolean;
  sizes?: Record<string, number>;
};

export default function Home() {

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("featured");
  const [popupProduct, setPopupProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(list);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    }
    fetchProducts();
  }, []);

  const filtered = products.filter(product => {
    if (selectedCategory === "featured") return product.featured === true;
    return product.category === selectedCategory;
  });

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>

      {/* ======= HERO ======= */}
      <div style={{
        height: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden"
      }}>
        <img
          src="/images/hero.png"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",  // ✅ always centered
            filter: "brightness(.35)",
            display: "block"
          }}
        />

        {/* bottom fade */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0,
          width: "100%",
          height: "50%",
          background: "linear-gradient(to bottom, transparent, #000)"
        }} />

        {/* hero text — centered, wraps properly on mobile */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
          width: "90%",          // ✅ constrained width so text doesn't overflow
          maxWidth: "700px"
        }}>
          <h1 style={{
            fontSize: "clamp(32px, 10vw, 100px)",
            fontWeight: 900,
            letterSpacing: "-1px",
            background: "linear-gradient(90deg,#2563eb,#ffffff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            lineHeight: 1.1,
            whiteSpace: "normal",   // ✅ allow wrapping on small screens
            wordBreak: "break-word"
          }}>
            GS SPORTS PUNE
          </h1>
          <p style={{
            color: "#ccc",
            fontSize: "clamp(12px, 3vw, 18px)",
            marginTop: "14px",
            lineHeight: 1.6
          }}>
            Jerseys | Cleats | Accessories<br />
            Pan-India Shipping 🌍
          </p>
        </div>
      </div>

      {/* ======= PRODUCTS SECTION ======= */}
      <div style={{
        background: "#050505",
        borderTopLeftRadius: "28px",
        borderTopRightRadius: "28px",
        marginTop: "-28px",
        position: "relative",
        zIndex: 1,
        padding: "28px 14px 60px"
      }}>

        {/* CATEGORY TABS */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          overflowX: "auto",
          paddingBottom: "8px",
          scrollbarWidth: "none" as any,
          msOverflowStyle: "none" as any,
        }}>
          <style>{`::-webkit-scrollbar { display: none; }`}</style>
          {["featured", "jerseys", "cleats", "accessories", "gloves", "balls"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px solid #222",
                background: selectedCategory === cat ? "#2563eb" : "#111",
                color: selectedCategory === cat ? "#fff" : "#aaa",
                fontWeight: "700",
                whiteSpace: "nowrap",
                flexShrink: 0,
                cursor: "pointer",
                fontSize: "11px",
                letterSpacing: "0.5px"
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
          width: "100%"
        }}>
          <style>{`
            @media (min-width: 600px)  { .pgrid { grid-template-columns: repeat(3, 1fr) !important; } }
            @media (min-width: 900px)  { .pgrid { grid-template-columns: repeat(4, 1fr) !important; } }
            @media (min-width: 1200px) { .pgrid { grid-template-columns: repeat(5, 1fr) !important; } }
          `}</style>

          {filtered.length === 0 && (
            <p style={{ color: "#444", gridColumn: "1/-1", textAlign: "center", padding: "40px 0" }}>
              No products in this category yet.
            </p>
          )}

          {filtered.map(product => (
            <div
              key={product.id}
              className="pgrid"
              style={{
                background: "#0a0a0a",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid #161616",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Link href={`/product/${product.id}`} style={{ display: "block" }}>
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "contain",
                    borderRadius: "10px",
                    background: "#111"
                  }}
                />
              </Link>

              <h3 style={{
                color: "white",
                fontSize: "clamp(11px, 2.8vw, 13px)",
                marginTop: "10px",
                flexGrow: 1,
                lineHeight: "1.4",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as any,
              }}>
                {product.name}
              </h3>

              <p style={{
                color: "#2563eb",
                fontWeight: "800",
                fontSize: "clamp(12px, 3vw, 14px)",
                marginTop: "6px"
              }}>
                ₹{product.price}
              </p>

              <button
                onClick={() => { setPopupProduct(product); setSelectedSize(null); }}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: "800",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ======= SIZE POPUP — bottom sheet ======= */}
      {popupProduct && (
        <div
          onClick={() => setPopupProduct(null)}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            zIndex: 9999,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#0d0d0d",
              padding: "20px 20px 40px",
              borderRadius: "24px 24px 0 0",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "85vh",
              overflowY: "auto",
              border: "1px solid #1a1a1a",
              borderBottom: "none"
            }}
          >
            {/* drag handle */}
            <div style={{
              width: "40px", height: "4px",
              background: "#333", borderRadius: "999px",
              margin: "0 auto 20px"
            }} />

            <div style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "20px" }}>
              <img
                src={popupProduct.images?.[0]}
                style={{
                  width: "80px", height: "80px",
                  objectFit: "contain",
                  borderRadius: "12px",
                  background: "#111",
                  padding: "6px",
                  flexShrink: 0
                }}
              />
              <div>
                <h2 style={{ color: "white", fontSize: "16px", fontWeight: "800", lineHeight: "1.4" }}>
                  {popupProduct.name}
                </h2>
                <p style={{ color: "#2563eb", fontWeight: "800", fontSize: "18px", marginTop: "4px" }}>
                  ₹{popupProduct.price}
                </p>
              </div>
            </div>

            <p style={{ color: "#555", fontSize: "11px", marginBottom: "12px", letterSpacing: "1.5px" }}>
              SELECT SIZE
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}>
              {Object.entries(popupProduct.sizes || {}).map(([size, stock]) => {
                const out = Number(stock) <= 0;
                return (
                  <button
                    key={size}
                    disabled={out}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      minWidth: "52px",
                      height: "52px",
                      padding: "0 14px",
                      borderRadius: "12px",
                      border: selectedSize === size
                        ? "2px solid #2563eb"
                        : "1px solid #2a2a2a",
                      background: selectedSize === size ? "#2563eb" : out ? "#0a0a0a" : "#1a1a1a",
                      color: selectedSize === size ? "#fff" : out ? "#444" : "white",
                      opacity: out ? 0.5 : 1,
                      cursor: out ? "not-allowed" : "pointer",
                      fontWeight: "800",
                      fontSize: "13px",
                      position: "relative"
                    }}
                  >
                    {size}
                    {out && (
                      <span style={{
                        position: "absolute", top: "-5px", right: "-5px",
                        fontSize: "8px", background: "#ff2d00",
                        padding: "1px 5px", borderRadius: "4px", fontWeight: "900"
                      }}>
                        OUT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              disabled={!selectedSize}
              onClick={() => {
                addToCart({
                  id: popupProduct.id,
                  name: popupProduct.name,
                  price: popupProduct.price,
                  image: popupProduct.images?.[0] || "",
                  size: selectedSize!
                });
                setPopupProduct(null);
              }}
              style={{
                width: "100%",
                padding: "18px",
                background: selectedSize ? "linear-gradient(90deg,#2563eb,#3b82f6)" : "#1a1a1a",
                border: "none",
                borderRadius: "14px",
                fontWeight: "900",
                fontSize: "16px",
                color: selectedSize ? "#fff" : "#444",
                cursor: selectedSize ? "pointer" : "not-allowed",
              }}
            >
              {selectedSize ? `Add to Cart — ₹${popupProduct.price}` : "Select a Size"}
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}