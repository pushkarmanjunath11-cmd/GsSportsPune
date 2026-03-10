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

      {/* HERO */}
      <div style={{
        height: "100vh",
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        zIndex: -1,
        overflow: "hidden"
      }}>
        <img
          src="/images/hero.png"
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.4)" }}
        />
        <div style={{
          position: "absolute", width: "100%", height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2), #000)"
        }} />
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
          padding: "0 20px",
          width: "100%"
        }}>
          <h1 style={{
            fontSize: "clamp(36px, 10vw, 120px)",
            fontWeight: 900,
            letterSpacing: "-2px",
            background: "linear-gradient(90deg,#ff7a00,#ffffff)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            whiteSpace: "nowrap"
          }}>
            MAD BALLERS
          </h1>
          <p style={{ color: "#ccc", fontSize: "clamp(14px, 3vw, 20px)" }}>
            Premium Football Store
          </p>
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <div style={{
        marginTop: "100vh",
        background: "#050505",
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
        padding: "clamp(24px, 5vw, 50px) clamp(12px, 4vw, 24px)"
      }}>

        {/* CATEGORY TABS */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "32px",
          overflowX: "auto",
          paddingBottom: "8px",
          WebkitOverflowScrolling: "touch" as any,
          scrollbarWidth: "none" as any,
        }}>
          {["featured", "boots", "jerseys", "gloves", "jackets", "balls", "gear"].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "10px 16px",
                borderRadius: "999px",
                border: "1px solid #222",
                background: selectedCategory === cat ? "#ff7a00" : "#111",
                color: selectedCategory === cat ? "#000" : "#aaa",
                fontWeight: "700",
                whiteSpace: "nowrap",
                flexShrink: 0,
                cursor: "pointer",
                fontSize: "clamp(11px, 2.5vw, 13px)"
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "clamp(10px, 2vw, 20px)",
          width: "100%"
        }}>
          {filtered.map(product => (
            <div
              key={product.id}
              style={{
                background: "#0a0a0a",
                padding: "12px",
                borderRadius: "16px",
                border: "1px solid #111",
                transition: "0.3s",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Link href={`/product/${product.id}`}>
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  style={{ width: "100%", height: "clamp(120px, 20vw, 180px)", objectFit: "contain" }}
                />
              </Link>

              <h3 style={{ color: "white", fontSize: "clamp(12px, 2.5vw, 14px)", marginTop: "8px", flexGrow: 1 }}>
                {product.name}
              </h3>

              <p style={{ color: "#ff7a00", fontWeight: "800", fontSize: "clamp(12px, 2.5vw, 14px)" }}>
                ₹{product.price}
              </p>

              <button
                onClick={() => { setPopupProduct(product); setSelectedSize(null); }}
                style={{
                  marginTop: "8px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#ff7a00",
                  color: "#000",
                  fontWeight: "800",
                  cursor: "pointer",
                  fontSize: "clamp(12px, 2.5vw, 14px)"
                }}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SIZE POPUP */}
      {popupProduct && (
        <div
          onClick={() => setPopupProduct(null)}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100%", height: "100%",
            background: "rgba(0,0,0,.9)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 9999,
            padding: "16px"
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#050505",
              padding: "clamp(16px, 4vw, 28px)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "400px",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            <img src={popupProduct.images?.[0]} style={{ width: "100%", borderRadius: "12px" }} />

            <h2 style={{ color: "white", marginTop: "14px", fontSize: "clamp(16px, 4vw, 22px)" }}>
              {popupProduct.name}
            </h2>
            <p style={{ color: "#ff7a00", fontWeight: "800" }}>₹{popupProduct.price}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "16px 0" }}>
              {Object.entries(popupProduct.sizes || {}).map(([size, stock]) => {
                const out = Number(stock) <= 0;
                return (
                  <button
                    key={size}
                    disabled={out}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: "44px", height: "44px",
                      borderRadius: "50%",
                      border: selectedSize === size ? "2px solid #ff7a00" : "1px solid #333",
                      background: out ? "#111" : "#000",
                      color: out ? "#555" : "white",
                      opacity: out ? 0.4 : 1,
                      cursor: out ? "not-allowed" : "pointer",
                      fontWeight: "700"
                    }}
                  >
                    {size}
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
                padding: "14px",
                background: selectedSize ? "#ff7a00" : "#222",
                border: "none",
                borderRadius: "10px",
                fontWeight: "900",
                color: selectedSize ? "#000" : "#666",
                cursor: selectedSize ? "pointer" : "not-allowed",
                fontSize: "16px"
              }}
            >
              Add To Cart
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}