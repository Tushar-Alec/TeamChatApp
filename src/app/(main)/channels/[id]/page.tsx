"use client";

import { use } from "react";
import { useEffect, useState, useRef } from "react";
import { db } from "@/firebase/firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);
  const [memberCount, setMemberCount] = useState(0);

  const auth = getAuth();
  const user = auth.currentUser;

  const bottomRef = useRef<HTMLDivElement>(null);

  const memberRef = doc(db, "channels", id, "members", user?.uid || "unknown");

  // Check if joined
  useEffect(() => {
    if (!user) return;

    const checkJoin = async () => {
      const snap = await getDoc(memberRef);
      setJoined(snap.exists());
    };

    checkJoin();
  }, [id, user]);

  // Listen to messages
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

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send Message
  const sendMessage = async () => {
    if (!message.trim() || !joined) return;

    await addDoc(collection(db, "channels", id, "messages"), {
      text: message,
      createdAt: serverTimestamp(),
      user: user?.displayName || user?.email || "User",
      uid: user?.uid,
      channelId: id,
    });

    setMessage("");
  };

  // Join Channel
  const joinChannel = async () => {
    if (!user) return;

    await setDoc(memberRef, {
      uid: user.uid,
      name: user.displayName || user.email || "User",
      joinedAt: serverTimestamp(),
    });

    setJoined(true);
  };

  // Leave Channel
  const leaveChannel = async () => {
    if (!user) return;

    await deleteDoc(memberRef);
    setJoined(false);
  };

  // Live Member Count
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "channels", id, "members"),
      (snapshot) => {
        setMemberCount(snapshot.size);
      }
    );

    return () => unsub();
  }, [id]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0f0f0f",
        color: "white",
      }}
    >
      
      <div
        style={{
          padding: "15px 24px",
          borderBottom: "1px solid #e75480",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#111",
        }}
      >
        <div>
          <h2 style={{ fontSize: "22px", color: "#e75480" }}>{id}</h2>
          <p style={{ fontSize: "14px", opacity: 0.7 }}>
            {memberCount} members
          </p>
        </div>

        {joined ? (
          <button
            onClick={leaveChannel}
            style={{
              background: "#ef4444",
              color: "white",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.3s",
            }}
          >
            Leave
          </button>
        ) : (
          <button
            onClick={joinChannel}
            style={{
              background: "#22c55e",
              color: "white",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              transition: "0.3s",
            }}
          >
            Join
          </button>
        )}
      </div>

      
      <div
        style={{
          flex: 1,
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent:
                msg.uid === user?.uid ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background:
                msg.uid === user?.uid ? "#e75480" : "#353232ff",
                color: "white",
                padding: "16px 22px",
                borderRadius: "14px",
                maxWidth: "70%",
                fontSize: "20px",
                lineHeight: "1.4",
              }}
            >
              <strong style={{ fontSize: "13px", opacity: 0.7 }}>
                {msg.user}
              </strong>
              <div>{msg.text}</div>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      
      <div
        style={{
          padding: "14px",
          borderTop: "1px solid #222",
          display: "flex",
          gap: "12px",
          background: "#111",
        }}
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            joined ? "Type a message..." : "Join channel to send messages"
          }
          disabled={!joined}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: joined ? "white" : "#444",
            color: joined ? "black" : "gray",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!joined}
          style={{
            padding: "12px 22px",
            background: joined ? "#e75480" : "#555",
            color: "white",
            borderRadius: "10px",
            cursor: joined ? "pointer" : "not-allowed",
            fontSize: "16px",
            transition: "0.3s",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
