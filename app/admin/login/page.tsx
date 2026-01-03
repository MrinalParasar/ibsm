"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Store token in localStorage
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #000000 50%, #101828 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          background: "#121416",
          borderRadius: "14px",
          padding: "40px",
          boxShadow: "0 4px 25px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(250, 192, 20, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1
            style={{
              color: "#FAC014",
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Admin Login
          </h1>
          <p style={{ color: "#696969", fontSize: "14px" }}>
            Sign in to access the admin panel
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(255, 0, 0, 0.1)",
              border: "1px solid rgba(255, 0, 0, 0.3)",
              color: "#ff6b6b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                color: "#fff",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#0D0D0D",
                border: "1px solid #373737",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FAC014";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#373737";
              }}
              placeholder="admin@example.com"
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label
              style={{
                display: "block",
                color: "#fff",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "#0D0D0D",
                border: "1px solid #373737",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#FAC014";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#373737";
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(250, 192, 20, 0.3)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(250, 192, 20, 0.4)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(250, 192, 20, 0.3)";
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
}

