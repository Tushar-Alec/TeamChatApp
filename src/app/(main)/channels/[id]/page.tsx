"use client";

import { use } from "react";

export default function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ unwrap the promise

  return (
    <div style={{ padding: "20px" }}>
      <h1>Channel: {id}</h1>
      <p>Messages will appear here...</p>
    </div>
  );
}
