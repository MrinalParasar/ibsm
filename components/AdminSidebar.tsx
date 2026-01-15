"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAdmin } from "./AdminContext";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Newspaper as NewspaperIcon,
  Email as EmailIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAdmin();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <DashboardIcon />,
    },
    {
      label: "Careers",
      path: "/admin/careers",
      icon: <WorkIcon />,
    },
    {
      label: "News",
      path: "/admin/news",
      icon: <NewspaperIcon />,
    },
    {
      label: "Form Submissions",
      path: "/admin/forms",
      icon: <EmailIcon />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  const sidebarWidth = isSidebarCollapsed ? 80 : 280;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        "& .MuiDrawer-paper": {
          width: sidebarWidth,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          boxSizing: "border-box",
        },
      }}
    >
      {/* Logo/Header */}
      <Box sx={{
        px: isSidebarCollapsed ? 2 : 4,
        py: isSidebarCollapsed ? 1 : 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSidebarCollapsed ? 'center' : 'flex-start',
        minHeight: isSidebarCollapsed ? 60 : 80
      }}>
        {isSidebarCollapsed ? (
          <Typography variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>IA</Typography>
        ) : (
          <>
            <Typography variant="h5" sx={{ color: "primary.main", fontWeight: 700, mb: 0.5 }}>
              IBSM Admin
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Admin Panel
            </Typography>
          </>
        )}
      </Box>
      <Divider sx={{ borderColor: "#eeeeee" }} />



      {/* Menu Items */}
      <Box sx={{ flexGrow: 1, py: 2 }}>
        <List disablePadding>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                component={Link}
                href={item.path}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  justifyContent: isSidebarCollapsed ? 'center' : 'initial',
                  py: 1.5,
                  px: 2.5,
                  borderLeft: (!isSidebarCollapsed && isActive(item.path)) ? "3px solid #1800ad" : "3px solid transparent",
                  bgcolor: isActive(item.path) ? "rgba(24, 0, 173, 0.08)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(24, 0, 173, 0.04)",
                    "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                      color: "primary.main",
                    },
                  },
                  "&.Mui-selected": {
                    bgcolor: "rgba(24, 0, 173, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(24, 0, 173, 0.15)",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: isSidebarCollapsed ? 0 : 3,
                    justifyContent: 'center',
                    color: isActive(item.path) ? "primary.main" : "text.secondary",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? "primary.main" : "text.secondary",
                  }}
                  sx={{ opacity: isSidebarCollapsed ? 0 : 1, display: isSidebarCollapsed ? 'none' : 'block' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2.5 }}>
        <Button
          fullWidth={!isSidebarCollapsed}
          variant="outlined"
          color="error"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
          sx={{
            py: 1.5,
            fontWeight: 600,
            minWidth: isSidebarCollapsed ? 0 : 'auto',
            px: isSidebarCollapsed ? 1 : 2,
            "& .MuiButton-startIcon": { mr: isSidebarCollapsed ? 0 : 1 },
            "&:hover": {
              bgcolor: "error.main",
              color: "white",
            },
          }}
        >
          {!isSidebarCollapsed && "Logout"}
        </Button>
      </Box>
    </Drawer>
  );
}

