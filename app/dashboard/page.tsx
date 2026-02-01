"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/");
        return;
      }

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(profile?.role || "buyer");
      setLoading(false);
    };

    loadDashboard();
  }, [router]);

  if (loading) {
    return <p style={{ padding: 40 }}>Loading dashboard…</p>;
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ marginBottom: 6 }}>Dashboard</h1>
        <p style={{ opacity: 0.6, marginBottom: 32 }}>
          Welcome, {user.email}
        </p>

        {/* SELLER VIEW */}
        {role === "seller" && (
          <section
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 14,
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
              marginBottom: 30,
            }}
          >
            <h2>Your Seller Space</h2>
            <p style={{ opacity: 0.7, marginBottom: 20 }}>
              Manage your products and track performance.
            </p>

            <button
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                background: "#000",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              + Add New Product
            </button>
          </section>
        )}

        {/* BUYER VIEW */}
        {role === "buyer" && (
          <section
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 14,
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2>Your Purchases</h2>
            <p style={{ opacity: 0.7 }}>
              You haven’t purchased any products yet.
            </p>
          </section>
        )}
      </main>
    </>
  );
}