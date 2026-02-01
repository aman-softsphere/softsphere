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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6f7f9",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: 40,
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: 6 }}>SoftSphere</h1>
        <p style={{ opacity: 0.6, marginBottom: 24 }}>
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
                padding: 14,
                width: "100%",
                borderRadius: 12,
                border: "1px solid #ddd",
                marginBottom: 14,
                fontSize: 15,
              }}
            />

            <button
              onClick={sendLink}
              style={{
                padding: "14px 22px",
                background: "#000000",
                color: "#ffffff",
                borderRadius: 12,
                fontWeight: 600,
                width: "100%",
                fontSize: 15,
              }}
            >
              Send Login Link
            </button>
          </>
        )}
      </div>
    </main>
  );
}