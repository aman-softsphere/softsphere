"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const finalizeLogin = async () => {
      await supabase.auth.getSession();
      router.replace("/dashboard");
    };

    finalizeLogin();
  }, [router]);

  return <p style={{ padding: "40px" }}>Signing you in…</p>;
}

