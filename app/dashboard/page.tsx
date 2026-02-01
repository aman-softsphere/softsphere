"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  title: string;
  price: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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

      const userRole = profile?.role || "buyer";
      setRole(userRole);

      // Fetch seller products
      if (userRole === "seller") {
        const { data: productsData } = await supabase
          .from("products")
          .select("id, title, price")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        setProducts(productsData || []);
      }

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
            <h2 style={{ marginBottom: 10 }}>Your Products</h2>

            {products.length === 0 ? (
              <p style={{ opacity: 0.7 }}>
                You haven’t added any products yet.
              </p>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {products.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #eee",
                      borderRadius: 12,
                      padding: 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0 }}>
                        {product.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          opacity: 0.6,
                        }}
                      >
                        ₹{product.price}
                      </p>
                    </div>

                    <span
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "#f2f2f2",
                      }}
                    >
                      Live
                    </span>
                  </div>
                ))}
              </div>
            )}
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