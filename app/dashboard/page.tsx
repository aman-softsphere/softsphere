"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function DashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      // If coming from OAuth / magic link
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
        router.replace("/dashboard");
        return;
      }

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

    run();
  }, [code, router]);

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading dashboard…</p>;
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Dashboard</h1>
      <p>
        Welcome, <b>{user.email}</b>
      </p>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p style={{ padding: "40px" }}>Loading…</p>}>
      <DashboardInner />
    </Suspense>
  );
}