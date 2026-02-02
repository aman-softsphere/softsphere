"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        background: "#0b0b0b",
        borderBottom: "1px solid #222",
      }}
    >
      <Link href="/" style={{ fontWeight: 700, fontSize: 18 }}>
        SoftSphere
      </Link>

      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/dashboard">Dashboard</Link>

        <button
          onClick={logout}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: "#fff",
            color: "#000",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}