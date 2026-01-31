"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  if (loading) {
    return (
      <main style={{ padding: "40px", textAlign: "center" }}>
        <button disabled>Loading...</button>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px", textAlign: "center" }}>
      <h1>SoftSphere</h1>
      <p>Buy & Sell Software, Apps & AI Tools</p>

      <button
        onClick={signInWithGoogle}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          background: "black",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Sign in with Google
      </button>
    </main>
  );
}
