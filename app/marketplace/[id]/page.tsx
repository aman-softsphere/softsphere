"use client";

import Navbar from "../../components/Navbar";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ProductDetail() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      setProduct(data);
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main style={{ padding: "40px" }}>
          <p>Loading...</p>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main style={{ padding: "40px" }}>
          <p>Product not found.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: "40px" }}>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        <h3>₹{product.price}</h3>

        {/* Razorpay Payment Link */}
        <a
          href="https://rzp.io/rzp/yrVQFh5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
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
            Buy Now
          </button>
        </a>
      </main>
    </>
  );
}
