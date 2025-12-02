"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/navigation";

export default function RedirectIfAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/"); 
      } else {
        setChecking(false);
      }
    });

    return () => unsub();
  }, [router]);

  if (checking) return <p>Loading...</p>;

  return <>{children}</>;
}
