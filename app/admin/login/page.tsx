"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Alert,
  CircularProgress,
  Avatar,
  Container,
} from "@mui/material";
import { LockOutlined as LockIcon } from "@mui/icons-material";

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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            bgcolor: "#ffffff",
            borderRadius: 4,
            border: "1px solid #eeeeee",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "primary.main",
              width: 56,
              height: 56,
              color: "white",
              mb: 2,
            }}
          >
            <LockIcon />
          </Avatar>

          <Typography
            variant="h4"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mb: 1,
              textAlign: "center",
            }}
          >
            Admin Login
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 4, textAlign: "center" }}
          >
            Sign in to access the IBSM administration panel
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mb: 3,
                bgcolor: "rgba(255, 0, 0, 0.05)",
                color: "#ff6b6b",
                border: "1px solid rgba(255, 0, 0, 0.1)",
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              required
              type="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@example.com"
              sx={{
                "& .MuiInputBase-input": {
                  color: "#000000 !important",
                  WebkitTextFillColor: "#000000 !important",
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              required
              type="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              sx={{
                "& .MuiInputBase-input": {
                  color: "#000000 !important",
                  WebkitTextFillColor: "#000000 !important",
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 4,
                mb: 2,
                py: 1.5,
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 4px 15px rgba(24, 0, 173, 0.3)",
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

