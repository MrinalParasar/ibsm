"use client";

import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div>
        <h1
          style={{
            color: "#FAC014",
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "30px",
          }}
        >
          Dashboard Overview
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <Link
            href="/admin/careers"
            style={{
              background: "#121416",
              borderRadius: "14px",
              padding: "30px",
              border: "1px solid rgba(250, 192, 20, 0.1)",
              textDecoration: "none",
              transition: "all 0.3s",
              display: "block",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#FAC014";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(250, 192, 20, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                fontSize: "24px",
                color: "#000",
              }}
            >
              <i className="fas fa-briefcase" />
            </div>
            <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
              Manage Careers
            </h3>
            <p style={{ color: "#696969", fontSize: "14px" }}>
              Add, edit, or delete career listings
            </p>
          </Link>

          <Link
            href="/admin/news"
            style={{
              background: "#121416",
              borderRadius: "14px",
              padding: "30px",
              border: "1px solid rgba(250, 192, 20, 0.1)",
              textDecoration: "none",
              transition: "all 0.3s",
              display: "block",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#FAC014";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(250, 192, 20, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                fontSize: "24px",
                color: "#000",
              }}
            >
              <i className="fas fa-newspaper" />
            </div>
            <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
              Manage News
            </h3>
            <p style={{ color: "#696969", fontSize: "14px" }}>
              Add, edit, or delete news articles
            </p>
          </Link>

          <Link
            href="/admin/forms"
            style={{
              background: "#121416",
              borderRadius: "14px",
              padding: "30px",
              border: "1px solid rgba(250, 192, 20, 0.1)",
              textDecoration: "none",
              transition: "all 0.3s",
              display: "block",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#FAC014";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "rgba(250, 192, 20, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                fontSize: "24px",
                color: "#000",
              }}
            >
              <i className="fas fa-envelope" />
            </div>
            <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>
              Form Submissions
            </h3>
            <p style={{ color: "#696969", fontSize: "14px" }}>
              View and manage form submissions from your website
            </p>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}

