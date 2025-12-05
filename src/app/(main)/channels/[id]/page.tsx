"use client";

import { use } from "react";
import { useEffect, useState, useRef } from "react";
import { db, rtdb } from "@/firebase/firebase";
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
  limit,
  startAfter,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { onValue, ref, set, remove } from "firebase/database";

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
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  const bottomRef = useRef<HTMLDivElement>(null);
  const memberRef = doc(db, "channels", id, "members", user?.uid || "unknown");
  const isLoadingMoreRef = useRef(false);

  useEffect(() => {
    const statusRef = ref(rtdb, "/status");

    const unsub = onValue(statusRef, (snapshot) => {
      const data = snapshot.val() || {};
      const users = Object.values(data).filter(
        (u: any) => u.state === "online"
      );
      setOnlineUsers(users);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const typingRef = ref(rtdb, `typing/${id}`);

    const unsub = onValue(typingRef, (snapshot) => {
      const data = snapshot.val() || {};
      setTypingUsers(Object.values(data));
    });

    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!user) return;

    const checkJoin = async () => {
      const snap = await getDoc(memberRef);
      setJoined(snap.exists());
    };

    checkJoin();
  }, [id, user]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "channels", id, "messages"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(list.reverse());
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    });

    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (isLoadingMoreRef.current) {
      isLoadingMoreRef.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !joined) return;

    if (editingId) {
      await updateDoc(doc(db, "channels", id, "messages", editingId), {
        text: message,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "channels", id, "messages"), {
        text: message,
        createdAt: serverTimestamp(),
        user: user?.displayName || user?.email || "User",
        uid: user?.uid,
        channelId: id,
      });
    }

    setMessage("");
    remove(ref(rtdb, `typing/${id}/${user?.uid}`));
  };

  const loadMoreMessages = async () => {
    if (!lastDoc) return;

    isLoadingMoreRef.current = true;

    const q = query(
      collection(db, "channels", id, "messages"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(10)
    );

    const snapshot = await getDocs(q);

    const olderMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMessages((prev) => [...olderMessages.reverse(), ...prev]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
  };

  const joinChannel = async () => {
    if (!user) return;

    await setDoc(memberRef, {
      uid: user.uid,
      name: user.displayName || user.email || "User",
      joinedAt: serverTimestamp(),
    });

    setJoined(true);
  };

  const leaveChannel = async () => {
    if (!user) return;
    await deleteDoc(memberRef);
    setJoined(false);
  };

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "channels", id, "members"),
      (snapshot) => {
        setMemberCount(snapshot.size);
      }
    );

    return () => unsub();
  }, [id]);

  const handleTyping = (val: string) => {
    setMessage(val);

    if (!user) return;

    const typingRef = ref(rtdb, `typing/${id}/${user.uid}`);

    if (val.trim()) {
      set(typingRef, user.displayName || user.email);
    } else {
      remove(typingRef);
    }
  };

  const deleteMessage = async (msgId: string) => {
    await deleteDoc(doc(db, "channels", id, "messages", msgId));
  };

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

        <span
          style={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#33bd68ff",
            padding: "4px 10px",
            borderRadius: "999px",
          }}
        >
          ● {onlineUsers.length} online
        </span>

        {joined ? (
          <button
            onClick={leaveChannel}
            style={{
              background: "#ef4444",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Leave
          </button>
        ) : (
          <button
            onClick={joinChannel}
            style={{
              background: "#22c55e",
              padding: "8px 18px",
              borderRadius: "8px",
            }}
          >
            Join
          </button>
        )}
      </div>

      <div style={{ flex: 1, padding: "20px", overflowY: "auto",borderLeft: "1px solid #e75480" }}>
        <button
          onClick={loadMoreMessages}
          style={{
            margin: "10px auto",
            display: "block",
            padding: "8px 14px",
            color: "#646263ff",
            cursor: "pointer",
          }}
        >
          Load Older Messages 
        </button>

        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: msg.uid === user?.uid ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: msg.uid === user?.uid ? "#e75480" : "#353232ff",
                padding: "16px 22px",
                borderRadius: "14px",
                maxWidth: "70%",
                fontSize: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "4px",
                  opacity: 0.7,
                  fontSize: "12px",
                }}
              >
                <strong>{msg.user}</strong>
                <span>
                  {msg.createdAt?.seconds
                    ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )
                    : ""}
                </span>
              </div>

              <div>{msg.text}</div>

              {msg.uid === user?.uid && (
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "6px",
                    fontSize: "12px",
                    opacity: 0.7,
                  }}
                >
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEditingId(msg.id);
                      setMessage(msg.text);
                    }}
                  >
                    Edit
                  </span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteMessage(msg.id)}
                  >
                    Delete
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {typingUsers.length > 0 && (
        <div style={{ paddingLeft: "20px", fontSize: "13px", opacity: 0.7 }}>
          {typingUsers.join(", ")} typing...
        </div>
      )}

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
          onChange={(e) => handleTyping(e.target.value)}
          placeholder={joined ? "Type a message..." : "Join channel to chat"}
          disabled={!joined}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!joined}
          style={{
            padding: "12px 22px",
            background: "#e75480",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update" : "Send"}
        </button>
      </div>
    </div>
  );
}
