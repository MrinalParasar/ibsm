"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: "fas fa-home",
    },
    {
      label: "Careers",
      path: "/admin/careers",
      icon: "fas fa-briefcase",
    },
    {
      label: "News",
      path: "/admin/news",
      icon: "fas fa-newspaper",
    },
    {
      label: "Form Submissions",
      path: "/admin/forms",
      icon: "fas fa-envelope",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(path);
  };

  return (
    <div
      style={{
        width: "280px",
        height: "100vh",
        background: "#121416",
        borderRight: "1px solid rgba(250, 192, 20, 0.1)",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Logo/Header */}
      <div
        style={{
          padding: "30px 20px",
          borderBottom: "1px solid rgba(250, 192, 20, 0.1)",
        }}
      >
        <h2
          style={{
            color: "#FAC014",
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "5px",
          }}
        >
          IBSM Admin
        </h2>
        <p style={{ color: "#696969", fontSize: "12px" }}>
          Admin Panel
        </p>
      </div>

      {/* User Info */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid rgba(250, 192, 20, 0.1)",
        }}
      >
        <p style={{ color: "#fff", fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
          {user.name}
        </p>
        <p style={{ color: "#696969", fontSize: "12px" }}>
          {user.email}
        </p>
      </div>

      {/* Menu Items */}
      <div style={{ flex: 1, padding: "20px 0" }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px 20px",
              color: isActive(item.path) ? "#FAC014" : "#696969",
              textDecoration: "none",
              background: isActive(item.path)
                ? "rgba(250, 192, 20, 0.1)"
                : "transparent",
              borderLeft: isActive(item.path)
                ? "3px solid #FAC014"
                : "3px solid transparent",
              transition: "all 0.3s",
              fontSize: "14px",
              fontWeight: isActive(item.path) ? "600" : "400",
            }}
            onMouseOver={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.color = "#FAC014";
                e.currentTarget.style.background = "rgba(250, 192, 20, 0.05)";
              }
            }}
            onMouseOut={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.color = "#696969";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <i
              className={item.icon}
              style={{
                marginRight: "12px",
                width: "20px",
                textAlign: "center",
              }}
            />
            {item.label}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <div style={{ padding: "20px", borderTop: "1px solid rgba(250, 192, 20, 0.1)" }}>
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "12px",
            background: "transparent",
            color: "#ff6b6b",
            border: "1px solid #ff6b6b",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#ff6b6b";
            e.currentTarget.style.color = "#fff";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#ff6b6b";
          }}
        >
          <i className="fas fa-sign-out-alt" />
          Logout
        </button>
      </div>
    </div>
  );
}

