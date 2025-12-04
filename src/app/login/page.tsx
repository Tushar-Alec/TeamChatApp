"use client";

import { useState } from "react";
import { auth } from "@/firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import RedirectIfAuth from "@/components/RedirectIfAuth";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <RedirectIfAuth>
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "300px" }}>
        <h2 style={{ textAlign: "center" }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "300px", padding: "8px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "300px", padding: "8px", margin: "5px 0", border: "1px solid #ccc", borderRadius: "4px" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button 
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            marginTop: "10px",
            cursor: "pointer"
          }}

          onMouseOver={(e) => (e.currentTarget.style.background = "#1c1b1bff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "black")}

        >
          Login
        </button>
        <p 
  style={{ 
    marginTop: "15px", 
    textAlign: "center", 
    fontSize: "14px", 
    color: "#555" 
  }}
>
  Don’t have an account?{" "}
  <a 
    href="/signup" 
    style={{ 
      color: "#0070f3", 
      textDecoration: "none", 
      fontWeight: "500",
      transition: "0.2s"
    }}
    onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
    onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
  >
    Create one
  </a>
</p>


      </div>
    </div>
    </RedirectIfAuth>
  );
}
