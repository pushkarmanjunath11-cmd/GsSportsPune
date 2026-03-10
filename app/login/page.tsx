'use client';

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/admin");
    } catch (err: any) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#000"
    }}>
      <div style={{
        background: "#07122a",
        padding: "50px 40px",
        borderRadius: "20px",
        border: "1px solid rgba(255,122,0,.2)",
        width: "100%",
        maxWidth: "420px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <h1 style={{ color: "white", fontWeight: 900, fontSize: "28px", textAlign: "center" }}>
          Admin Login
        </h1>

        {error && (
          <p style={{ color: "#ef4444", textAlign: "center", fontSize: "14px" }}>
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,.08)",
            background: "#020617",
            color: "white",
            fontSize: "15px"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,.08)",
            background: "#020617",
            color: "white",
            fontSize: "15px"
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            padding: "16px",
            background: "linear-gradient(90deg,#2563eb,#3b82f6)",
            border: "none",
            borderRadius: "12px",
            color: "#000",
            fontWeight: "900",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </div>
    </div>
  );
} 