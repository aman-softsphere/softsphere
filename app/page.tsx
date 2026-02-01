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
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(true);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    };

    checkUser();
  }, [router]);

  const sendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      alert(error.message);
    } else {
      setSent(true);
    }
  };

  if (checking) {
    return <p style={{ padding: 40 }}>Loading…</p>;
  }

  return (
    <main
      style={{
        padding: 40,
        textAlign: "center",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      <h1>SoftSphere</h1>
      <p style={{ opacity: 0.7 }}>
        Buy & Sell Software, Apps & AI Tools
      </p>

      {sent ? (
        <p style={{ marginTop: 20 }}>
          ✅ Check your email for the login link
        </p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 12,
              width: "100%",
              borderRadius: 10,
              marginTop: 20,
            }}
          />

          <button
            onClick={sendLink}
            style={{
              marginTop: 16,
              padding: "12px 22px",
              background: "#ffffff",
              color: "#000000",
              borderRadius: 10,
              fontWeight: 600,
              width: "100%",
            }}
          >
            Send Login Link
          </button>
        </>
      )}
    </main>
  );
}