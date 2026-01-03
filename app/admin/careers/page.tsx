"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

interface Career {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export default function AdminCareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState<Career | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
    requirements: "",
  });

  useEffect(() => {
    initializeDefaultCareers();
  }, []);

  useEffect(() => {
    fetchCareers(currentPage);
  }, [currentPage]);

  const initializeDefaultCareers = async () => {
    const token = localStorage.getItem("adminToken");
    try {
      await fetch("/api/admin/init-careers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCareers(1);
    } catch (error) {
      console.error("Failed to initialize careers:", error);
      fetchCareers(1);
    }
  };

  const fetchCareers = async (page: number = 1) => {
    setLoading(true);
    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`/api/admin/careers?page=${page}&limit=9`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCareers(data.careers || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch careers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (career?: Career) => {
    if (career) {
      setEditingCareer(career);
      setFormData({
        title: career.title,
        location: career.location,
        type: career.type,
        description: career.description,
        requirements: career.requirements.join("\n"),
      });
    } else {
      setEditingCareer(null);
      setFormData({
        title: "",
        location: "",
        type: "",
        description: "",
        requirements: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCareer(null);
    setFormData({
      title: "",
      location: "",
      type: "",
      description: "",
      requirements: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("adminToken");
    const requirements = formData.requirements
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    try {
      const url = editingCareer
        ? `/api/admin/careers/${editingCareer._id}`
        : "/api/admin/careers";
      const method = editingCareer ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          location: formData.location,
          type: formData.type,
          description: formData.description,
          requirements,
        }),
      });

      if (response.ok) {
        fetchCareers(currentPage);
        handleCloseModal();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to save career");
      }
    } catch (error) {
      console.error("Failed to save career:", error);
      alert("Failed to save career");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this career?")) {
      return;
    }

    const token = localStorage.getItem("adminToken");
    try {
      const response = await fetch(`/api/admin/careers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // If we're on the last page and it's the only item, go to previous page
        if (careers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchCareers(currentPage);
        }
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete career");
      }
    } catch (error) {
      console.error("Failed to delete career:", error);
      alert("Failed to delete career");
    }
  };

  return (
    <AdminLayout>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#FAC014",
                fontSize: "32px",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Manage Careers
            </h1>
            <p style={{ color: "#696969", fontSize: "14px" }}>
              Add, edit, or delete career listings
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(250, 192, 20, 0.3)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(250, 192, 20, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(250, 192, 20, 0.3)";
            }}
          >
            <i className="fas fa-plus" style={{ marginRight: "8px" }} />
            Add New Career
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#FAC014" }}>
            Loading...
          </div>
        ) : careers.length === 0 ? (
          <div
            style={{
              background: "#121416",
              borderRadius: "14px",
              padding: "40px",
              textAlign: "center",
              border: "1px solid rgba(250, 192, 20, 0.1)",
            }}
          >
            <p style={{ color: "#696969", fontSize: "16px" }}>
              No careers found. Click "Add New Career" to create one.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "20px",
            }}
          >
            {careers.map((career) => (
              <div
                key={career._id}
                style={{
                  background: "#121416",
                  borderRadius: "14px",
                  padding: "25px",
                  border: "1px solid rgba(250, 192, 20, 0.1)",
                  transition: "all 0.3s",
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
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span
                      style={{
                        background: "#1800ad",
                        color: "white",
                        padding: "4px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-block",
                        marginBottom: "10px",
                      }}
                    >
                      {career.type}
                    </span>
                    <h3
                      style={{
                        color: "#fff",
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      {career.title}
                    </h3>
                    <p style={{ color: "#696969", fontSize: "14px", marginBottom: "10px" }}>
                      <i className="fas fa-map-marker-alt" style={{ marginRight: "6px" }} />
                      {career.location}
                    </p>
                  </div>
                </div>
                <p
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    marginBottom: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  {career.description}
                </p>
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ color: "#696969", fontSize: "12px", marginBottom: "8px" }}>
                    Requirements:
                  </p>
                  <ul style={{ color: "#ccc", fontSize: "13px", paddingLeft: "20px" }}>
                    {career.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    paddingTop: "15px",
                    borderTop: "1px solid #373737",
                  }}
                >
                  <button
                    onClick={() => handleOpenModal(career)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "transparent",
                      color: "#FAC014",
                      border: "1px solid #FAC014",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = "#FAC014";
                      e.currentTarget.style.color = "#000";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#FAC014";
                    }}
                  >
                    <i className="fas fa-edit" style={{ marginRight: "6px" }} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(career._id)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "transparent",
                      color: "#ff6b6b",
                      border: "1px solid #ff6b6b",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s",
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
                    <i className="fas fa-trash" style={{ marginRight: "6px" }} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: "10px 20px",
                background: currentPage === 1 ? "#373737" : "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                color: currentPage === 1 ? "#696969" : "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              <i className="fas fa-chevron-left" style={{ marginRight: "5px" }} />
              Previous
            </button>

            <div
              style={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
              }}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: "10px 16px",
                        background: currentPage === page
                          ? "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)"
                          : "#0D0D0D",
                        color: currentPage === page ? "#000" : "#fff",
                        border: currentPage === page ? "none" : "1px solid #373737",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: currentPage === page ? "700" : "500",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        minWidth: "40px",
                      }}
                      onMouseOver={(e) => {
                        if (currentPage !== page) {
                          e.currentTarget.style.borderColor = "#FAC014";
                          e.currentTarget.style.color = "#FAC014";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (currentPage !== page) {
                          e.currentTarget.style.borderColor = "#373737";
                          e.currentTarget.style.color = "#fff";
                        }
                      }}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span
                      key={page}
                      style={{
                        color: "#696969",
                        padding: "0 5px",
                      }}
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: "10px 20px",
                background: currentPage === totalPages ? "#373737" : "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                color: currentPage === totalPages ? "#696969" : "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Next
              <i className="fas fa-chevron-right" style={{ marginLeft: "5px" }} />
            </button>
          </div>
        )}

        {totalPages > 1 && (
          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
              color: "#696969",
              fontSize: "14px",
            }}
          >
            Showing page {currentPage} of {totalPages} ({total} total careers)
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
            onClick={handleCloseModal}
          >
            <div
              style={{
                background: "#121416",
                borderRadius: "14px",
                padding: "30px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                border: "1px solid rgba(250, 192, 20, 0.1)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "25px",
                }}
              >
                <h2
                  style={{
                    color: "#FAC014",
                    fontSize: "24px",
                    fontWeight: "700",
                  }}
                >
                  {editingCareer ? "Edit Career" : "Add New Career"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#696969",
                    fontSize: "24px",
                    cursor: "pointer",
                    padding: "0",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>

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
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#0D0D0D",
                      border: "1px solid #373737",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FAC014";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#373737";
                    }}
                  />
                </div>

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
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#0D0D0D",
                      border: "1px solid #373737",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FAC014";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#373737";
                    }}
                  />
                </div>

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
                    Job Type *
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    required
                    placeholder="e.g., Full Time, Part Time, Contract"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#0D0D0D",
                      border: "1px solid #373737",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FAC014";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#373737";
                    }}
                  />
                </div>

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
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#0D0D0D",
                      border: "1px solid #373737",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FAC014";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#373737";
                    }}
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
                    Requirements * (one per line)
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    required
                    rows={5}
                    placeholder="Enter each requirement on a new line"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: "#0D0D0D",
                      border: "1px solid #373737",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "14px",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#FAC014";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#373737";
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: "12px 24px",
                      background: "transparent",
                      color: "#696969",
                      border: "1px solid #373737",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: "12px 24px",
                      background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                      color: "#000",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "700",
                      cursor: "pointer",
                      boxShadow: "0 4px 15px rgba(250, 192, 20, 0.3)",
                    }}
                  >
                    {editingCareer ? "Update" : "Create"} Career
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

