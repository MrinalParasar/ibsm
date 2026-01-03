"use client";

import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import NextLayout from "@/layouts/NextLayout";

const page = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: null, message: '' });

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formSource: "contact-page",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus({ type: 'success', message: 'Thank you! We will contact you soon.' });
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setFormStatus({ type: 'error', message: data.error || 'Failed to submit form' });
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };
  return (
    <NextLayout>
      <Breadcrumb pageName="Contact Us" />
      {/* Contact Section Section Start */}
      <section className="contact-section section-padding">
        <div className="container">
          <div className="contact-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="contact-content">
                  <div className="section-title">
                    <span className="sub-content wow fadeInUp">
                      <img src="assets/img/bale.png" alt="img" />
                      Contact Us
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      Your Safety, Our Responsibility. <br />
                      Get in Touch!
                    </h2>
                  </div>
                  <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                    Sed ut perspiciatis unde omnis iste natus error voluptatem
                    accusantium <br />
                    doloremque laudantium, totam rem aperiam
                  </p>
                  <ul
                    className="contact-list wow fadeInUp"
                    data-wow-delay=".3s"
                  >
                    <li>
                      <a href="mailto:info@ibrainstormmedia.com">info@ibrainstormmedia.com</a><br />
                      <a href="mailto:ajesh771@gmail.com">ajesh771@gmail.com</a>
                    </li>
                    <li>Shop no.2 B-73 shalimar Garden extn.-1 Sahibabad, Ghaziabad, U.P. 201005</li>
                    <li>
                      <a href="tel:8512036470">8512036470</a>, <a href="tel:8750856069">8750856069</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6">
                <div
                  className="contact-right wow fadeInUp"
                  data-wow-delay=".4s"
                >
                  <h3>Send Us Message</h3>
                  <form
                    onSubmit={handleSubmit}
                    className="contact-form-items"
                  >
                    {formStatus.type && (
                      <div
                        style={{
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: "20px",
                          background: formStatus.type === 'success' 
                            ? "rgba(76, 175, 80, 0.1)" 
                            : "rgba(255, 0, 0, 0.1)",
                          border: `1px solid ${formStatus.type === 'success' ? '#4CAF50' : '#f44336'}`,
                          color: formStatus.type === 'success' ? '#4CAF50' : '#f44336',
                          fontSize: "14px",
                        }}
                      >
                        {formStatus.message}
                      </div>
                    )}
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <input
                            type="text"
                            name="name"
                            id="contact-name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <input
                            type="tel"
                            name="phone"
                            id="contact-phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <input
                            type="email"
                            name="email"
                            id="contact-email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <textarea
                            name="message"
                            id="contact-message"
                            placeholder="Comments"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={5}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <button type="submit" className="theme-btn">
                          Send a Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Map Section Start */}
      <div className="map-section">
        <div className="map-items">
          <div className="googpemap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </NextLayout>
  );
};
export default page;
