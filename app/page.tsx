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
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    };

    check();
  }, [router]);

  const sendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) alert(error.message);
    else setSent(true);
  };

  if (checking) return <p style={{ padding: 40 }}>Loading…</p>;

  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>SoftSphere</h1>
      <p>Buy & Sell Software, Apps & AI Tools</p>

      {sent ? (
        <p>✅ Check your email for the login link</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, width: 260 }}
          />
          <br />
          <button
            onClick={sendLink}
            style={{
              marginTop: 12,
              padding: "12px 24px",
              background: "black",
              color: "white",
              borderRadius: 6,
            }}
          >
            Send Login Link
          </button>
        </>
      )}
    </main>
  );
}