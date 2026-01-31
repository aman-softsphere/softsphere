"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
};

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, title, description, price")
        .order("created_at", { ascending: false });

      setProducts(data || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <main style={{ padding: "40px" }}>
        <h1>Marketplace</h1>
        <p>Browse software, apps & AI tools</p>

        {loading && <p>Loading products...</p>}

        {!loading && products.length === 0 && (
          <p>No products listed yet.</p>
        )}

        {!loading &&
          products.map((product) => (
            <Link
              key={product.id}
              href={`/marketplace/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginTop: "15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <h3>{product.title}</h3>
                {product.description && <p>{product.description}</p>}
                <p>
                  <b>₹{product.price}</b>
                </p>
              </div>
            </Link>
          ))}
      </main>
    </>
  );
}
