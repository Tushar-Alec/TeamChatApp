"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  const auth = getAuth();
  const user = auth.currentUser;

  
  useEffect(() => {
    const q = query(
      collection(db, "channels", id, "messages"),
      orderBy("createdAt")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(list);
    });

    return () => unsub();
  }, [id]);

  
  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, "channels", id, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
      user: user?.displayName || user?.email || "User",
      uid: user?.uid,
    });

    setMessage("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      
      
      <div style={{ padding: "15px", borderBottom: "1px solid #222", fontWeight: "bold" }}>
         {id}
      </div>

      
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "10px",
              display: "flex",
              justifyContent: msg.uid === user?.uid ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: msg.uid === user?.uid ? "#0070f3" : "#1f1f1f",
                color: "white",
                padding: "10px 14px",
                borderRadius: "10px",
                maxWidth: "70%",
                fontSize: "14px",
              }}
            >
              <strong style={{ fontSize: "12px", opacity: 0.7 }}>{msg.user}</strong>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}
      </div>

      
      <div style={{ padding: "15px", borderTop: "1px solid #222", display: "flex", gap: "10px" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 16px",
            background: "#0070f3",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
