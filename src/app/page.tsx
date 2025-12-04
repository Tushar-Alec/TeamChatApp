"use client";

import MainLayout from "@/components/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <div
        style={{
          flex: 1,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
          color: "white",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "#141414",
            padding: "40px 50px",
            borderRadius: "16px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "12px",
              letterSpacing: "0.5px",
            }}
          >
            Welcome to TeamChat
          </h1>

          <p
            style={{
              fontSize: "16px",
              opacity: 0.85,
              marginBottom: "30px",
              lineHeight: "1.6",
            }}
          >
            Select a channel from the sidebar to start chatting with your team.
          </p>

          <div
            style={{
              padding: "14px 22px",
              background: "#e75480",
              color: "white",
              borderRadius: "10px",
              display: "inline-block",
              fontWeight: "600",
              cursor: "default",
              letterSpacing: "0.4px",
              boxShadow: "0 6px 16px rgba(205, 91, 91, 0.4)",
            }}
          >
            Real-time - Secure - Fast
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
