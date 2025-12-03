"use client";

import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, height: "100vh" }}>
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
