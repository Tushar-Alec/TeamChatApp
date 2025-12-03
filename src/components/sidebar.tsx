"use client";

import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [channels, setChannels] = useState<any[]>([]);
  const pathname = usePathname();
  const [name, setName] = useState("");

  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "channels"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChannels(list);
    });

    return () => unsub();
  }, []);

  
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      setName(user.displayName || user.email || "User");
    }
  }, []);

  return (
    <div
      style={{
        width: "260px",
        background: "#0e0e0e",
        color: "white",
        height: "100vh",
        boxSizing: "border-box",
        borderRight: "1px solid #222",
        display: "flex",
        flexDirection: "column",
      }}
    >
    
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #222",
          fontSize: "20px",
          fontWeight: "bold",
          background: "linear-gradient(90deg, #1a1a1a, #111)",
          textAlign: "left",
          letterSpacing: "0.5px",
        }}
      >
        Channels
      </div>

      
      <div style={{ padding: "15px", flex: 1 }}>
        {channels.map((c) => {
          const isActive = pathname === `/channels/${c.id}`;

          return (
            <Link
              key={c.id}
              href={`/channels/${c.id}`}
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  marginBottom: "8px",
                  background: isActive ? "#333" : "#161616",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "0.2s",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: isActive ? "1px solid #555" : "1px solid transparent",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = isActive ? "#3d3d3d" : "#262626")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = isActive ? "#333" : "#161616")
                }
              >
                <span style={{ opacity: 0.8 }}>#</span> {c.name}
              </div>
            </Link>
          );
        })}
      </div>

      
      <div
        style={{
          padding: "15px 20px",
          borderTop: "1px solid #222",
          background: "#0c0c0c",
          fontSize: "14px",
          opacity: 0.9,
        }}
      >
        Logged in as <strong>{name}</strong>
      </div>
    </div>
  );
}
