"use client";

import Navbar from "../components/Navbar";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;

      if (!currentUser) {
        router.push("/");
        return;
      }

      setUser(currentUser);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      setRole(profile?.role?.trim() || null);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const addProduct = async () => {
    if (!user) return;

    await supabase.from("products").insert({
      seller_id: user.id,
      title,
      description,
      price: Number(price),
    });

    setTitle("");
    setDescription("");
    setPrice("");
    alert("Product added successfully");
  };

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading...</p>;
  }

  return (
  <>
    <Navbar />
    <main style={{ padding: "40px" }}>
      <h1>Dashboard</h1>

      <p>
        Welcome, <b>{user.email}</b>
      </p>
      <p>
        Your role: <b>{role}</b>
      </p>


      {role?.trim() === "seller" && (
        <>
          <h2 style={{ marginTop: "30px" }}>Add a Product</h2>

          <input
            placeholder="Product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />

          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ display: "block", marginBottom: "10px" }}
          />

          <button onClick={addProduct}>Add Product</button>
        </>
      )}

      {role === "buyer" && (
        <p style={{ marginTop: "30px" }}>
          You are logged in as a buyer. Browse products in the marketplace.
        </p>
      )}
        </main>
  </>
);
}
