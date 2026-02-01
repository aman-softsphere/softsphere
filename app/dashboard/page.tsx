"use client";
export const dynamic = "force-dynamic";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const finalizeLogin = async () => {
      // If redirected from Google with code
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace("/dashboard");
        return;
      }

      // Normal session check
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      setUser(user);
      setLoading(false);
    };

    finalizeLogin();
  }, [code, router]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading dashboard…</p>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>Welcome, <b>{user.email}</b></p>
    </main>
  );
}