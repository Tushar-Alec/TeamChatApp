"use client";
import AuthGuard from "@/components/AuthGuard";


export default function HomePage() {
  return (
    <AuthGuard>
      <h1>Welcome to the Chat App</h1>
    </AuthGuard>
  );
}
