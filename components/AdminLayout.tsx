"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedUser = localStorage.getItem("adminUser");

    if (!token || !storedUser) {
      router.push("/admin/login");
      return;
    }

    const verifyAuth = async () => {
      try {
        const response = await fetch("/api/admin/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          router.push("/admin/login");
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #000000 0%, #000000 50%, #101828 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#FAC014", fontSize: "18px" }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #000000 50%, #101828 100%)",
        display: "flex",
      }}
    >
      <AdminSidebar user={user} onLogout={handleLogout} />
      <div
        style={{
          marginLeft: "280px",
          flex: 1,
          padding: "30px",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

