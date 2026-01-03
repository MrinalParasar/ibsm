"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";

interface FormSubmission {
  _id: string;
  formSource: 'hero-consultation' | 'contact-page' | 'career-application';
  name: string;
  email: string;
  phone?: string;
  message?: string;
  position?: string;
  experience?: string;
  cvUrl?: string;
  cvFileName?: string;
  agreedToTerms?: boolean;
  createdAt: string;
}

interface FormStats {
  total: number;
  bySource: {
    source: string;
    count: number;
  }[];
}

const formSourceLabels: Record<string, string> = {
  'hero-consultation': 'Hero Consultation Form',
  'contact-page': 'Contact Page Form',
  'career-application': 'Career Application Form',
};

export default function AdminFormsPage() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [stats, setStats] = useState<FormStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, []);

  useEffect(() => {
    if (selectedSource === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(submissions.filter(s => s.formSource === selectedSource));
    }
  }, [selectedSource, submissions]);

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/forms", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/forms?type=stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/forms/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSubmissions(submissions.filter(s => s._id !== id));
        if (selectedSubmission?._id === id) {
          setSelectedSubmission(null);
        }
        fetchStats();
      } else {
        alert("Failed to delete submission");
      }
    } catch (error) {
      console.error("Failed to delete submission:", error);
      alert("An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateFull = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: "40px", textAlign: "center", color: "#696969" }}>
          Loading...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: "30px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "600", marginBottom: "10px" }}>
              Form Submissions
            </h1>
            <p style={{ color: "#696969", fontSize: "14px" }}>
              Manage and view all form submissions from your website
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: viewMode === 'table' 
                  ? "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)" 
                  : "#121416",
                color: viewMode === 'table' ? "#000" : "#fff",
                cursor: "pointer",
                fontWeight: viewMode === 'table' ? "600" : "400",
                border: viewMode === 'table' ? "none" : "1px solid rgba(250, 192, 20, 0.1)",
              }}
            >
              <i className="fas fa-table" style={{ marginRight: "8px" }} />
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: viewMode === 'cards' 
                  ? "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)" 
                  : "#121416",
                color: viewMode === 'cards' ? "#000" : "#fff",
                cursor: "pointer",
                fontWeight: viewMode === 'cards' ? "600" : "400",
                border: viewMode === 'cards' ? "none" : "1px solid rgba(250, 192, 20, 0.1)",
              }}
            >
              <i className="fas fa-th" style={{ marginRight: "8px" }} />
              Cards
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            <div
              style={{
                background: "#121416",
                borderRadius: "14px",
                padding: "25px",
                border: "1px solid rgba(250, 192, 20, 0.1)",
              }}
            >
              <div style={{ color: "#696969", fontSize: "14px", marginBottom: "10px" }}>Total Submissions</div>
              <div style={{ color: "#FAC014", fontSize: "32px", fontWeight: "700" }}>{stats.total}</div>
            </div>
            {stats.bySource.map((item) => (
              <div
                key={item.source}
                style={{
                  background: "#121416",
                  borderRadius: "14px",
                  padding: "25px",
                  border: "1px solid rgba(250, 192, 20, 0.1)",
                }}
              >
                <div style={{ color: "#696969", fontSize: "14px", marginBottom: "10px" }}>
                  {formSourceLabels[item.source] || item.source}
                </div>
                <div style={{ color: "#FAC014", fontSize: "32px", fontWeight: "700" }}>{item.count}</div>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => setSelectedSource('all')}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              background: selectedSource === 'all' 
                ? "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)" 
                : "#121416",
              color: selectedSource === 'all' ? "#000" : "#fff",
              cursor: "pointer",
              fontWeight: selectedSource === 'all' ? "600" : "400",
              border: selectedSource === 'all' ? "none" : "1px solid rgba(250, 192, 20, 0.1)",
            }}
          >
            All ({submissions.length})
          </button>
          {stats?.bySource.map((item) => (
            <button
              key={item.source}
              onClick={() => setSelectedSource(item.source)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                background: selectedSource === item.source 
                  ? "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)" 
                  : "#121416",
                color: selectedSource === item.source ? "#000" : "#fff",
                cursor: "pointer",
                fontWeight: selectedSource === item.source ? "600" : "400",
                border: selectedSource === item.source ? "none" : "1px solid rgba(250, 192, 20, 0.1)",
              }}
            >
              {formSourceLabels[item.source] || item.source} ({item.count})
            </button>
          ))}
        </div>

        {/* Submissions View */}
        {filteredSubmissions.length === 0 ? (
          <div
            style={{
              background: "#121416",
              borderRadius: "14px",
              padding: "40px",
              border: "1px solid rgba(250, 192, 20, 0.1)",
              textAlign: "center",
              color: "#696969",
            }}
          >
            No submissions found
          </div>
        ) : viewMode === 'table' ? (
          /* Table View */
          <div
            style={{
              background: "#121416",
              borderRadius: "14px",
              padding: "25px",
              border: "1px solid rgba(250, 192, 20, 0.1)",
              overflowX: "auto",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(250, 192, 20, 0.1)" }}>
                  <th style={{ padding: "15px", textAlign: "left", color: "#FAC014", fontWeight: "600" }}>Source</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#FAC014", fontWeight: "600" }}>Name</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#FAC014", fontWeight: "600" }}>Email</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#FAC014", fontWeight: "600" }}>Phone</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#FAC014", fontWeight: "600" }}>Preview</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#FAC014", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "15px", textAlign: "left", color: "#FAC014", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((submission) => (
                  <tr
                    key={submission._id}
                    style={{
                      borderBottom: "1px solid rgba(250, 192, 20, 0.05)",
                    }}
                  >
                    <td style={{ padding: "15px", color: "#fff" }}>
                      <span
                        style={{
                          padding: "5px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          background: "rgba(250, 192, 20, 0.1)",
                          color: "#FAC014",
                        }}
                      >
                        {formSourceLabels[submission.formSource] || submission.formSource}
                      </span>
                    </td>
                    <td style={{ padding: "15px", color: "#fff" }}>{submission.name}</td>
                    <td style={{ padding: "15px", color: "#fff" }}>{submission.email}</td>
                    <td style={{ padding: "15px", color: "#fff" }}>{submission.phone || "-"}</td>
                    <td style={{ padding: "15px", color: "#fff", maxWidth: "200px" }}>
                      {submission.position && (
                        <div style={{ marginBottom: "5px", fontSize: "13px" }}>
                          <strong>Position:</strong> {submission.position}
                        </div>
                      )}
                      {submission.message && (
                        <div style={{ fontSize: "12px", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {submission.message.substring(0, 50)}...
                        </div>
                      )}
                      {submission.experience && (
                        <div style={{ fontSize: "12px", color: "#999", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {submission.experience.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "15px", color: "#999", fontSize: "13px" }}>
                      {formatDate(submission.createdAt)}
                    </td>
                    <td style={{ padding: "15px", display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => setSelectedSubmission(submission)}
                        style={{
                          padding: "8px 15px",
                          borderRadius: "6px",
                          border: "1px solid #FAC014",
                          background: "transparent",
                          color: "#FAC014",
                          cursor: "pointer",
                          fontSize: "13px",
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
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(submission._id)}
                        style={{
                          padding: "8px 15px",
                          borderRadius: "6px",
                          border: "1px solid #ff6b6b",
                          background: "transparent",
                          color: "#ff6b6b",
                          cursor: "pointer",
                          fontSize: "13px",
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
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards View */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            {filteredSubmissions.map((submission) => (
              <div
                key={submission._id}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
                  <span
                    style={{
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      background: "rgba(250, 192, 20, 0.1)",
                      color: "#FAC014",
                    }}
                  >
                    {formSourceLabels[submission.formSource] || submission.formSource}
                  </span>
                  <span style={{ color: "#696969", fontSize: "12px" }}>
                    {formatDate(submission.createdAt)}
                  </span>
                </div>
                <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "600", marginBottom: "15px" }}>
                  {submission.name}
                </h3>
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ color: "#696969", fontSize: "13px", marginBottom: "5px" }}>Email</div>
                  <div style={{ color: "#fff", fontSize: "14px" }}>{submission.email}</div>
                </div>
                {submission.phone && (
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "5px" }}>Phone</div>
                    <div style={{ color: "#fff", fontSize: "14px" }}>{submission.phone}</div>
                  </div>
                )}
                {submission.position && (
                  <div style={{ marginBottom: "10px" }}>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "5px" }}>Position</div>
                    <div style={{ color: "#fff", fontSize: "14px" }}>{submission.position}</div>
                  </div>
                )}
                {(submission.message || submission.experience) && (
                  <div style={{ marginBottom: "15px" }}>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "5px" }}>
                      {submission.message ? "Message" : "Experience"}
                    </div>
                    <div style={{ color: "#fff", fontSize: "14px", lineHeight: "1.6", maxHeight: "100px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {submission.message || submission.experience}
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button
                    onClick={() => setSelectedSubmission(submission)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "6px",
                      border: "1px solid #FAC014",
                      background: "transparent",
                      color: "#FAC014",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
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
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(submission._id)}
                    style={{
                      padding: "10px 15px",
                      borderRadius: "6px",
                      border: "1px solid #ff6b6b",
                      background: "transparent",
                      color: "#ff6b6b",
                      cursor: "pointer",
                      fontSize: "13px",
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
                    <i className="fas fa-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedSubmission && (
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
            onClick={() => setSelectedSubmission(null)}
          >
            <div
              style={{
                background: "#121416",
                borderRadius: "14px",
                padding: "30px",
                border: "1px solid rgba(250, 192, 20, 0.2)",
                maxWidth: "700px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedSubmission(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "transparent",
                  border: "none",
                  color: "#696969",
                  fontSize: "24px",
                  cursor: "pointer",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#696969";
                }}
              >
                ×
              </button>

              <div style={{ marginBottom: "25px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                  <span
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "13px",
                      background: "rgba(250, 192, 20, 0.1)",
                      color: "#FAC014",
                      fontWeight: "600",
                    }}
                  >
                    {formSourceLabels[selectedSubmission.formSource] || selectedSubmission.formSource}
                  </span>
                  <span style={{ color: "#696969", fontSize: "14px" }}>
                    {formatDateFull(selectedSubmission.createdAt)}
                  </span>
                </div>
                <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "5px" }}>
                  {selectedSubmission.name}
                </h2>
              </div>

              <div style={{ display: "grid", gap: "20px" }}>
                <div>
                  <div style={{ color: "#696969", fontSize: "13px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Email Address
                  </div>
                  <div style={{ color: "#fff", fontSize: "16px" }}>
                    <a href={`mailto:${selectedSubmission.email}`} style={{ color: "#FAC014", textDecoration: "none" }}>
                      {selectedSubmission.email}
                    </a>
                  </div>
                </div>

                {selectedSubmission.phone && (
                  <div>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Phone Number
                    </div>
                    <div style={{ color: "#fff", fontSize: "16px" }}>
                      <a href={`tel:${selectedSubmission.phone}`} style={{ color: "#FAC014", textDecoration: "none" }}>
                        {selectedSubmission.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedSubmission.position && (
                  <div>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Position Applied For
                    </div>
                    <div style={{ color: "#fff", fontSize: "16px", padding: "12px", background: "rgba(250, 192, 20, 0.05)", borderRadius: "8px" }}>
                      {selectedSubmission.position}
                    </div>
                  </div>
                )}

                {selectedSubmission.message && (
                  <div>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Message
                    </div>
                    <div style={{ color: "#fff", fontSize: "15px", lineHeight: "1.8", padding: "15px", background: "rgba(250, 192, 20, 0.05)", borderRadius: "8px", whiteSpace: "pre-wrap" }}>
                      {selectedSubmission.message}
                    </div>
                  </div>
                )}

                {selectedSubmission.experience && (
                  <div>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Experience & Background
                    </div>
                    <div style={{ color: "#fff", fontSize: "15px", lineHeight: "1.8", padding: "15px", background: "rgba(250, 192, 20, 0.05)", borderRadius: "8px", whiteSpace: "pre-wrap" }}>
                      {selectedSubmission.experience}
                    </div>
                  </div>
                )}

                {selectedSubmission.cvUrl && (
                  <div>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      CV / Resume
                    </div>
                    <a
                      href={selectedSubmission.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px 20px",
                        background: "rgba(250, 192, 20, 0.1)",
                        color: "#FAC014",
                        textDecoration: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        border: "1px solid rgba(250, 192, 20, 0.3)",
                        transition: "all 0.3s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(250, 192, 20, 0.2)";
                        e.currentTarget.style.borderColor = "#FAC014";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(250, 192, 20, 0.1)";
                        e.currentTarget.style.borderColor = "rgba(250, 192, 20, 0.3)";
                      }}
                    >
                      <i className="fas fa-file-pdf" />
                      {selectedSubmission.cvFileName || "Download CV"}
                      <i className="fas fa-external-link-alt" style={{ fontSize: "12px" }} />
                    </a>
                  </div>
                )}

                {selectedSubmission.agreedToTerms !== undefined && (
                  <div>
                    <div style={{ color: "#696969", fontSize: "13px", marginBottom: "8px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Terms & Conditions
                    </div>
                    <div style={{ color: selectedSubmission.agreedToTerms ? "#4CAF50" : "#ff6b6b", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <i className={`fas fa-${selectedSubmission.agreedToTerms ? 'check-circle' : 'times-circle'}`} />
                      {selectedSubmission.agreedToTerms ? "Agreed" : "Not Agreed"}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid rgba(250, 192, 20, 0.1)", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => {
                    window.location.href = `mailto:${selectedSubmission.email}?subject=Re: Your ${formSourceLabels[selectedSubmission.formSource]} Submission`;
                  }}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "1px solid #FAC014",
                    background: "transparent",
                    color: "#FAC014",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
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
                  <i className="fas fa-envelope" style={{ marginRight: "8px" }} />
                  Reply via Email
                </button>
                <button
                  onClick={() => handleDelete(selectedSubmission._id)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "8px",
                    border: "1px solid #ff6b6b",
                    background: "transparent",
                    color: "#ff6b6b",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
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
                  <i className="fas fa-trash" style={{ marginRight: "8px" }} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
