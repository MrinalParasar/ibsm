"use client";

import Link from "next/link";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  alpha,
} from "@mui/material";
import {
  Work as WorkIcon,
  Newspaper as NewspaperIcon,
  Email as EmailIcon
} from "@mui/icons-material";

export default function AdminDashboardPage() {
  const menuItems = [
    {
      title: "Manage Careers",
      description: "Add, edit, or delete career listings",
      icon: <WorkIcon sx={{ fontSize: 32, color: "white" }} />,
      href: "/admin/careers",
      color: "primary.main",
    },
    {
      title: "Manage News",
      description: "Add, edit, or delete news articles",
      icon: <NewspaperIcon sx={{ fontSize: 32, color: "white" }} />,
      href: "/admin/news",
      color: "secondary.main", // Keeping yellow as accent for News if desired, or can be primary
    },
    {
      title: "Form Submissions",
      description: "View and manage form submissions",
      icon: <EmailIcon sx={{ fontSize: 32, color: "white" }} />,
      href: "/admin/forms",
      color: "primary.dark",
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 1 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Welcome back to your admin dashboard
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={item.href}>
            <Link href={item.href} style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    borderColor: item.color,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      bgcolor: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      boxShadow: `0 4px 10px ${alpha("#000", 0.2)}`,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

