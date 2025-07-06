import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import cookie from "js-cookie";

export default function admindashboard() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = cookie.get("token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    try {
      const decoded = jwt.verify(token, "your_secret_key");
      if (decoded.email === "admin@ourwill.xyz") {
        setAuthorized(true);
      } else {
        router.push("/admin/login");
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      router.push("/admin/login");
    }

    setLoading(false);
  }, []);

  if (loading) return <p>Checking authentication...</p>;
  if (!authorized) return null;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, Admin 👋</h1>
      <p>This is your admin dashboard.</p>
      {/* Future: Add buttons or links for managing candidates */}
    </div>
  );
}
