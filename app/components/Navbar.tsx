"use client";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

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
        display: "flex",
        justifyContent: "space-between",
        padding: "15px 40px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link href="/" style={{ fontWeight: "bold" }}>
        SoftSphere
      </Link>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/dashboard">Dashboard</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
