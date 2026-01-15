"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import ThemeRegistry from "./ThemeRegistry/ThemeRegistry";
import { AdminProvider } from "./AdminContext";
import { Box, CircularProgress, Typography } from "@mui/material";

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
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ ml: 2, color: 'primary.main' }}>Loading...</Typography>
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AdminProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AdminSidebar user={user} onLogout={handleLogout} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            minHeight: '100vh',
            width: '100%', // Ensure it takes remaining width
            overflowX: 'hidden'
          }}
        >
          {children}
        </Box>
      </Box>
    </AdminProvider>
  );
}

