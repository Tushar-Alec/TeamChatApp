"use client";

export default function HomePage() {
  console.log("ENV TEST:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  return <h1>Env Test</h1>;
}
