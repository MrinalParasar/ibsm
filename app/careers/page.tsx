"use client";

import { useEffect, useState, useRef } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/stateful-button";

interface Vacancy {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

const Careers = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [careerFormData, setCareerFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvUrl, setCvUrl] = useState<string>("");
  const [careerFormStatus, setCareerFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchCareers(currentPage);
  }, [currentPage]);

  const fetchCareers = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/careers?page=${page}&limit=9`);
      if (response.ok) {
        const data = await response.json();
        setVacancies(data.careers || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch careers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCvUpload = async (file: File) => {
    setCvUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'careers/cv');
      // Preset will be used from server-side env if not provided

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setCvUrl(data.url);
        setCareerFormStatus({ type: 'success', message: 'CV uploaded successfully!' });
        return data.url;
      } else {
        setCareerFormStatus({ type: 'error', message: data.error || 'Failed to upload CV' });
        return null;
      }
    } catch (error) {
      setCareerFormStatus({ type: 'error', message: 'An error occurred while uploading CV.' });
      return null;
    } finally {
      setCvUploading(false);
    }
  };

  const handleCareerFormSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    setCareerFormStatus({ type: null, message: '' });

    if (!cvUrl && !cvFile) {
      setCareerFormStatus({ type: 'error', message: 'Please upload your CV' });
      // Throwing error to stop stateful button animation chain if caught (or just break it)
      throw new Error("CV Missing");
    }

    let finalCvUrl = cvUrl;

    // Upload CV if file is selected but not yet uploaded
    if (cvFile && !cvUrl) {
      const uploadedUrl = await handleCvUpload(cvFile);
      if (!uploadedUrl) {
        setCareerFormStatus({ type: 'error', message: 'Failed to upload CV' });
        throw new Error("Upload Failed");
      }
      finalCvUrl = uploadedUrl;
    }

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formSource: "career-application",
          name: careerFormData.name,
          email: careerFormData.email,
          phone: careerFormData.phone,
          position: careerFormData.position,
          experience: careerFormData.experience,
          cvUrl: finalCvUrl,
          cvFileName: cvFile?.name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setCareerFormStatus({ type: 'success', message: 'Thank you! We will review your application and get back to you soon.' });
        setCareerFormData({ name: "", email: "", phone: "", position: "", experience: "" });
        setCvFile(null);
        setCvUrl("");
      } else {
        setCareerFormStatus({ type: 'error', message: data.error || 'Failed to submit application' });
        throw new Error(data.error || 'Submission Failed');
      }
    } catch (error) {
      setCareerFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
      throw error;
    }
  };

  const handleStatefulClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (formRef.current && !formRef.current.reportValidity()) {
      throw new Error("Form Invalid");
    }
    await handleCareerFormSubmit(e);
  };

  return (
    <NextLayout>
      <Breadcrumb pageName="Careers" />

      {/* Why Join Us Section Start */}
      <section className="about-section fix section-padding pb-0" style={{ paddingTop: "0px" }}>
        <style jsx global>{`
          .contact-form-items .form-clt input:not(:placeholder-shown),
          .contact-form-items .form-clt textarea:not(:placeholder-shown) {
            background-color: #fff9e6 !important;
            border: 1px solid #ffd966 !important;
          }
          .apply-now-btn:hover,
          .service-card-items:hover .apply-now-btn {
            background: #000 !important;
            color: #fff !important;
            border-color: #000 !important;
          }
        `}</style>
        <div className="container">
          <div className="about-wrapper style-2">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="about-content ms-0">
                  <div className="section-title">
                    <span className="sub-content wow fadeInUp">
                      Join Our Team
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      Build Your Career in Security Excellence
                    </h2>
                  </div>
                  <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                    At IBSM Global Security Solutions, we believe our people are
                    our greatest asset. We offer a supportive environment,
                    continuous training, and numerous opportunities for
                    professional growth.
                  </p>
                  <ul className="about-list wow fadeInUp" data-wow-delay=".7s">
                    <li>
                      <i className="far fa-check" />
                      Ongoing Professional Training
                    </li>
                    <li>
                      <i className="far fa-check" />
                      Competitive Compensation
                    </li>
                    <li>
                      <i className="far fa-check" />
                      Health and Insurance Benefits
                    </li>
                    <li>
                      <i className="far fa-check" />
                      Supportive Work Culture
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay=".4s">
                <div className="about-image-3">
                  <img src="/assets/img/about/05.jpg" alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vacancies Section Start */}
      <section className="service-section section-padding pb-0">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-content">
              Current Openings
            </span>
            <h2>Explore New Opportunities</h2>
          </div>
          <div className="row g-4 mt-4">
            {loading ? (
              <div className="col-12 text-center" style={{ padding: "40px", color: "#696969" }}>
                Loading careers...
              </div>
            ) : vacancies.length === 0 ? (
              <div className="col-12 text-center" style={{ padding: "40px", color: "#696969" }}>
                No career openings available at the moment.
              </div>
            ) : (
              vacancies.map((job, index) => (
                <div
                  key={index}
                  className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                  data-wow-delay={`${0.2 * (index % 3 + 1)}s`}
                >
                  <div
                    className="service-card-items style-2"
                    style={{ height: "100%" }}
                  >
                    <div className="service-content">
                      <span
                        className="type-tag"
                        style={{
                          background: "#fff",
                          color: "#666",
                          border: "1px solid #e0e0e0",
                          padding: "0px 12px",
                          borderRadius: "30px",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "inline-block",
                        }}
                      >
                        {job.type}
                      </span>
                      <h3 className="mt-2">
                        <Link href="#">{job.title}</Link>
                      </h3>
                      <p style={{ fontSize: "14px", color: "#666" }}>
                        <i className="fas fa-map-marker-alt me-2" /> {job.location}
                      </p>
                      <p className="mt-3">{job.description}</p>
                      <Link href="#apply" className="theme-btn apply-now-btn mt-4" style={{ borderRadius: "30px", padding: "10px 25px", lineHeight: "1" }}>
                        Apply Now <i className="far fa-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
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
        </div>
      </section>

      {/* Application Form Section Start */}
      <section id="apply" className="contact-section section-padding">
        <div className="container">
          <div className="contact-wrapper">
            <div className="row g-4">
              <div className="col-lg-12">
                <div className="contact-right wow fadeInUp" data-wow-delay=".4s">
                  <div className="section-title text-center mb-5">
                    <h2>Submit Your Application</h2>
                    <p>
                      Tell us about yourself and we will get back to you soon.
                    </p>
                  </div>
                  <form
                    ref={formRef}
                    onSubmit={(e) => e.preventDefault()}
                    className="contact-form-items"
                  >
                    {careerFormStatus.type && (
                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: "20px",
                          background: careerFormStatus.type === 'success'
                            ? "rgba(76, 175, 80, 0.1)"
                            : "rgba(255, 0, 0, 0.1)",
                          border: `1px solid ${careerFormStatus.type === 'success' ? '#4CAF50' : '#f44336'}`,
                          color: careerFormStatus.type === 'success' ? '#4CAF50' : '#f44336',
                          fontSize: "14px",
                        }}
                      >
                        {careerFormStatus.message}
                      </div>
                    )}
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <input
                            type="text"
                            name="name"
                            id="career-name"
                            placeholder="Full Name"
                            value={careerFormData.name}
                            onChange={(e) => setCareerFormData({ ...careerFormData, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <input
                            type="email"
                            name="email"
                            id="career-email"
                            placeholder="Email Address"
                            value={careerFormData.email}
                            onChange={(e) => setCareerFormData({ ...careerFormData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <input
                            type="tel"
                            name="phone"
                            id="career-phone"
                            placeholder="Phone Number"
                            value={careerFormData.phone}
                            onChange={(e) => setCareerFormData({ ...careerFormData, phone: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <select
                            name="position"
                            id="career-position"
                            className="form-control"
                            style={{
                              height: "60px",
                              borderRadius: "5px",
                              border: "1px solid #eee",
                            }}
                            value={careerFormData.position}
                            onChange={(e) => setCareerFormData({ ...careerFormData, position: e.target.value })}
                            required
                          >
                            <option value="">Select Position</option>
                            {vacancies.map((job, index) => (
                              <option key={index} value={job.title}>
                                {job.title}
                              </option>
                            ))}
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <textarea
                            name="experience"
                            id="career-experience"
                            placeholder="Briefly describe your experience"
                            value={careerFormData.experience}
                            onChange={(e) => setCareerFormData({ ...careerFormData, experience: e.target.value })}
                            rows={3} /* Shortened height */
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <label style={{ fontSize: "14px", color: "#888", marginBottom: "8px", display: "block" }}>
                            Tip: Upload your resume here (PDF preferred)
                          </label>
                          <label
                            htmlFor="career-cv"
                            className="cv-upload-box"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "40px",
                              border: cvFile ? "2px solid #ffd966" : "2px dashed #444",
                              borderRadius: "12px",
                              background: cvFile ? "rgba(255, 217, 102, 0.05)" : "rgba(255, 255, 255, 0.02)",
                              cursor: "pointer",
                              transition: "all 0.3s ease",
                              width: "100%",
                              textAlign: "center"
                            }}
                            onMouseOver={(e) => {
                              if (!cvFile) e.currentTarget.style.borderColor = "#ffd966";
                              e.currentTarget.style.background = "rgba(255, 217, 102, 0.05)";
                            }}
                            onMouseOut={(e) => {
                              if (!cvFile) e.currentTarget.style.borderColor = "#444";
                              if (!cvFile) e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                            }}
                          >
                            <i className="fas fa-cloud-upload-alt" style={{ fontSize: "32px", marginBottom: "15px", color: "#ffd966" }} />
                            <span style={{ color: "#fff", fontSize: "16px", fontWeight: "600", marginBottom: "5px" }}>
                              {cvFile ? "Change File" : "Click to Upload CV"}
                            </span>
                            <span style={{ color: "#888", fontSize: "13px" }}>
                              {cvFile ? cvFile.name : "Supported: PDF, DOC, DOCX (Max 5MB)"}
                            </span>
                          </label>
                          <input
                            type="file"
                            id="career-cv"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) {
                                  setCareerFormStatus({ type: 'error', message: 'File size must be less than 5MB' });
                                  return;
                                }
                                setCvFile(file);
                                setCvUrl("");
                              }
                            }}
                            style={{ display: "none" }}
                          />
                          {cvFile && (
                            <div style={{ marginTop: "10px", color: "#000", fontSize: "13px" }}>
                              <i className="fas fa-file" style={{ marginRight: "5px", color: "#000" }} />
                              {cvFile.name} {cvUploading && "(Uploading...)"}
                            </div>
                          )}
                          {cvUrl && (
                            <div style={{ marginTop: "10px", color: "#4CAF50", fontSize: "13px" }}>
                              <i className="fas fa-check-circle" style={{ marginRight: "5px" }} />
                              CV uploaded successfully
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12 text-center" style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          onClick={handleStatefulClick}
                          disabled={
                            cvUploading ||
                            !careerFormData.name ||
                            !careerFormData.email ||
                            !careerFormData.phone ||
                            !careerFormData.position ||
                            !careerFormData.experience ||
                            (!cvFile && !cvUrl)
                          }
                          style={{
                            opacity: (cvUploading || !careerFormData.name || !careerFormData.email || !careerFormData.phone || !careerFormData.position || !careerFormData.experience || (!cvFile && !cvUrl)) ? 0.5 : 1,
                            cursor: (cvUploading || !careerFormData.name || !careerFormData.email || !careerFormData.phone || !careerFormData.position || !careerFormData.experience || (!cvFile && !cvUrl)) ? 'not-allowed' : 'pointer',
                            backgroundColor: "#ffd966",
                            color: "black",
                            border: "1px solid black"
                          }}
                        >
                          {cvUploading ? "Uploading CV..." : "Submit Application"}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </NextLayout>
  );
};

export default Careers;

