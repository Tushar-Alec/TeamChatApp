"use client";

import { getAuth, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { addDoc } from "firebase/firestore";
import { create } from "domain";
import { doc, setDoc } from "firebase/firestore";

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
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #222",
          fontSize: "30px",
          fontWeight: "bold",
          background: "#cd5b5bff",
          textAlign: "center",
          letterSpacing: "3px",
          color: "white",
        }}
      >
      TeamChat
      </div>
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #222",
          fontSize: "20px",
          fontWeight: "bold",
          background: "#0c0c0c",
          textAlign: "left",
          letterSpacing: "0.5px",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Channels
      </div>

      <div
        style={{
          padding: "15px 20px",
          borderTop: "1px solid #222",
          background: "#0c0c0c",
          height: "100px",
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "#1a1818ff",
            color: "white",
            border: "1px groove white",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "10px",
            transition: "0.2s",

          }}
          onClick={async () => {
            const channelName = prompt("Enter channel name:");
            if (!channelName) return;

            const auth = getAuth();
            const user = auth.currentUser;

            const docRef = doc(db, "channels", channelName.toLowerCase());

            await setDoc(docRef, {
              name: channelName,
              createdAt: new Date(),
              createdBy: user?.displayName || user?.email || "Unknown",
            });
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3b3737ff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#1a1818ff")}
        >
          Create Channel
        </button>
      </div>

      <div
  style={{
    padding: "15px",
    flex: 1,
    overflowY: "auto",     // ✅ enables vertical scrolling
    overflowX: "hidden",  // ✅ prevents sideways scroll
  }}
>
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
            border: isActive
              ? "1px solid #555"
              : "1px solid transparent",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.background = isActive
              ? "#3d3d3d"
              : "#262626")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.background = isActive
              ? "#333"
              : "#161616")
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
        }}
      >
        <button
          onClick={() => {
            const auth = getAuth();
            signOut(auth);
          }}
          style={{
            width: "100%",
            padding: "10px",
            background: "#1a1818ff",
            color: "white",
            border: "1px groove white",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "10px",
            transition: "0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#3b3737ff")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#1a1818ff")}
        >
          Logout
        </button>

        <div style={{ fontSize: "14px", opacity: 0.9 }}>
          Logged in as <strong>{name}</strong>
        </div>
      </div>
    </div>
  );
}
