"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { ref, set, onDisconnect } from "firebase/database";
import { rtdb } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";


export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
  const auth = getAuth();

  const unsub = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const userStatusRef = ref(rtdb, `/status/${user.uid}`);

    await set(userStatusRef, {
      state: "online",
      name: user.displayName || user.email,
      lastChanged: Date.now(),
    });

    onDisconnect(userStatusRef).set({
      state: "offline",
      lastChanged: Date.now(),
    });
  });

  return () => unsub();
}, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
}
