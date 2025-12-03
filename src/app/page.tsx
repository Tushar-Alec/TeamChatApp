"use client";

import MainLayout from "@/components/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <div style={{ padding: "20px" }}>
        <h1>Welcome to the Chat App</h1>
        <p>Select a channel from the sidebar.</p>
      </div>
    </MainLayout>
  );
}
