"use client";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useState } from "react";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
  try {
    setError("");

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCred.user, { displayName: name });

    await setDoc(doc(db, "users", userCred.user.uid), {
      uid: userCred.user.uid,
      name: name,
      email: email,
      createdAt: Date.now(),
      online: true,
    });

    window.location.href = "/login";
  } catch (err: any) {
    setError(err.message);
  }
};


  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "300px" }}>
        <h2 style={{ textAlign: "center" }}>Signup</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px", margin: "5px 0" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button 
          onClick={handleSignup}
          style={{
            width: "107%",
            padding: "10px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            marginTop: "10px",
            cursor: "pointer"
          }}
        >
          Create Account
        </button>
        <p 
  style={{ 
    marginTop: "15px", 
    textAlign: "center", 
    fontSize: "14px", 
    color: "#555" 
  }}
>
  Already have an account?{" "}
  <a 
    href="/login" 
    style={{ 
      color: "#0070f3", 
      textDecoration: "none", 
      fontWeight: "500",
      transition: "0.2s"
    }}
    onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
    onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
  >
    Login
  </a>
</p>


      </div>
    </div>
  );
}
