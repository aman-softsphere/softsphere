"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        router.replace("/");
        return;
      }

      setUser(auth.user);

      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", auth.user.id);

      if (error) {
        console.error(error);
      } else {
        setProducts(products || []);
      }

      setLoading(false);
    };

    load();
  }, [router]);

  if (loading) return <p style={{ padding: 40 }}>Loading dashboard…</p>;

  return (
    <main style={{ padding: 40 }}>
      <h2>Dashboard</h2>
      <p>Welcome, {user.email}</p>

      <h3 style={{ marginTop: 30 }}>Your Products</h3>

      {products.length === 0 ? (
        <p style={{ opacity: 0.7 }}>No products added yet.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #333",
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
              }}
            >
              <h4>{product.title}</h4>
              <p>{product.description}</p>
              <strong>₹{product.price}</strong>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}