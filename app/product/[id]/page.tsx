'use client';

import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useCart } from "@/app/context/CartContext";

export default function ProductPage() {

  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { addToCart } = useCart();

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = () => {
    if (intervalRef.current || !product?.images?.length) return;
    intervalRef.current = setInterval(() => {
      setCurrentImage(prev =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 2500);
  };

  /* FETCH PRODUCT */
  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        const ref = doc(db, "products", id as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProduct({ id: snap.id, ...snap.data() });
        }
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    }
    loadProduct();
  }, [id]);

  /* SINGLE INTERVAL — stops when fullscreen */
  useEffect(() => {
    if (!product?.images?.length || fullscreen) return;
    const interval = setInterval(() => {
      setCurrentImage(prev =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }, 2500);
    return () => clearInterval(interval);
  }, [product, fullscreen]);

  if (!product) {
    return (
      <div style={{
        height: "100vh", display: "flex",
        justifyContent: "center", alignItems: "center",
        background: "#000", color: "white", fontSize: "20px"
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{
      background: "#000",
      minHeight: "100vh",
      paddingTop: "90px",
      paddingInline: "clamp(16px, 5vw, 6vw)",
      paddingBottom: "60px"
    }}>

      {/* PRODUCT GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        gap: "clamp(24px, 5vw, 60px)",
        alignItems: "start"
      }}>

        {/* IMAGE GALLERY */}
        <div>
          <div
            style={{ overflow: "hidden", borderRadius: "20px", cursor: "zoom-in" }}
            onClick={() => { setFullscreen(true); stopInterval(); }}
          >
            <img
              src={product?.images?.[currentImage]}
              style={{
                width: "100%",
                height: "clamp(280px, 45vw, 520px)",
                objectFit: "contain",
                transition: "0.4s",
                cursor: "zoom-in"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            />
          </div>

          {/* THUMBNAIL DOTS */}
          {product.images?.length > 1 && (
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "14px" }}>
              {product.images.map((_: any, i: number) => (
                <div
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  style={{
                    width: i === currentImage ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: i === currentImage ? "#ff7a00" : "#333",
                    cursor: "pointer",
                    transition: "0.3s"
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* INFO */}
        <div>
          <h1 style={{ color: "white", fontSize: "clamp(24px, 5vw, 42px)", fontWeight: "900" }}>
            {product.name}
          </h1>

          <p style={{ color: "#ffffff", fontSize: "clamp(20px, 4vw, 28px)", fontWeight: "900", marginTop: "8px" }}>
            ₹{product.price}
          </p>

          {/* SIZES */}
          <h3 style={{ color: "white", marginTop: "28px", marginBottom: "14px", fontSize: "clamp(14px, 3vw, 18px)" }}>
            Select Size
          </h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
            {Object.entries(product.sizes || {}).map(([size, stock]: any) => {
              const out = Number(stock) <= 0;
              return (
                <button
                  key={size}
                  disabled={out}
                  onClick={() => { if (!out) setSelectedSize(size); }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: selectedSize === size
                      ? "2px solid #ffffff"
                      : out ? "1px solid #333" : "1px solid rgba(255,255,255,.15)",
                    background: selectedSize === size
                      ? "linear-gradient(90deg,#ffffff,#bdbdc6)"
                      : out ? "#0a0a0a" : "#111",
                    color: out ? "#555" : selectedSize === size ? "#000" : "white",
                    cursor: out ? "not-allowed" : "pointer",
                    opacity: out ? 0.45 : 1,
                    position: "relative",
                    fontWeight: "800",
                    fontSize: "clamp(12px, 2.5vw, 14px)"
                  }}
                >
                  {size}
                  {out && (
                    <span style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      fontSize: "9px", background: "#ff2d00",
                      padding: "2px 5px", borderRadius: "6px", fontWeight: "900"
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
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images?.[0] || "",
                size: selectedSize!
              });
            }}
            style={{
              width: "100%",
              padding: "18px",
              borderRadius: "16px",
              border: "none",
              background: "#ffffff",
              color: "#000",
              fontWeight: "900",
              fontSize: "clamp(15px, 3vw, 18px)",
              opacity: !selectedSize ? 0.5 : 1,
              cursor: !selectedSize ? "not-allowed" : "pointer"
            }}
          >
            Add To Cart
          </button>
        </div>
      </div>

      {/* FULLSCREEN VIEWER */}
      {fullscreen && (
        <div
          onClick={() => { setFullscreen(false); startInterval(); }}
          style={{
            position: "fixed", top: 0, left: 0,
            width: "100vw", height: "100vh",
            background: "rgba(0,0,0,.96)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 99999, padding: "16px"
          }}
        >
          <button
            onClick={e => { e.stopPropagation(); setCurrentImage(prev => prev === 0 ? product.images.length - 1 : prev - 1); }}
            style={{
              position: "absolute", left: "clamp(10px, 4vw, 40px)",
              fontSize: "clamp(28px, 5vw, 40px)",
              background: "rgba(255,255,255,.1)", border: "none",
              color: "white", cursor: "pointer", borderRadius: "50%",
              width: "50px", height: "50px", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}
          >‹</button>

          <img
            src={product.images[currentImage]}
            style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
          />

          <button
            onClick={e => { e.stopPropagation(); setCurrentImage(prev => prev === product.images.length - 1 ? 0 : prev + 1); }}
            style={{
              position: "absolute", right: "clamp(10px, 4vw, 40px)",
              fontSize: "clamp(28px, 5vw, 40px)",
              background: "rgba(255,255,255,.1)", border: "none",
              color: "white", cursor: "pointer", borderRadius: "50%",
              width: "50px", height: "50px", display: "flex",
              alignItems: "center", justifyContent: "center"
            }}
          >›</button>
        </div>
      )}
    </div>
  );
}