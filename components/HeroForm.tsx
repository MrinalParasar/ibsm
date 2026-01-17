"use client";

import Link from "next/link";
import React from "react";

interface HeroFormProps {
    formData: {
        name: string;
        email: string;
        phone: string;
        agreedToTerms: boolean;
    };
    setFormData: (data: any) => void;
    formStatus: {
        type: "success" | "error" | null;
        message: string;
    };
    onSubmit: (e: React.FormEvent) => void;
    className?: string;
}

const HeroForm: React.FC<HeroFormProps> = ({
    formData,
    setFormData,
    formStatus,
    onSubmit,
    className = "",
}) => {
    return (
        <div
            className={`hero-contact-box ${className}`}
            style={{ border: "1px solid #333" }}
        >
            <h4>Get Consultations</h4>
            <p>Ready to Register Our Security Services</p>
            <form onSubmit={onSubmit} className="contact-form-item">
                {formStatus.type && (
                    <div
                        style={{
                            padding: "12px",
                            borderRadius: "8px",
                            marginBottom: "20px",
                            background:
                                formStatus.type === "success"
                                    ? "rgba(76, 175, 80, 0.1)"
                                    : "rgba(255, 0, 0, 0.1)",
                            border: `1px solid ${formStatus.type === "success" ? "#4CAF50" : "#f44336"
                                }`,
                            color: formStatus.type === "success" ? "#4CAF50" : "#f44336",
                            fontSize: "14px",
                        }}
                    >
                        {formStatus.message}
                    </div>
                )}
                <div className="row g-4">
                    <div className="col-lg-12">
                        <div className="form-clt">
                            <input
                                type="text"
                                name="name"
                                id="hero-name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-clt">
                            <input
                                type="email"
                                name="email"
                                id="hero-email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div className="form-clt">
                            <input
                                type="tel"
                                name="phone"
                                id="hero-phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={(e) =>
                                    setFormData({ ...formData, phone: e.target.value })
                                }
                            />
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <button type="submit" className="theme-btn">
                            Get Started Now <i className="far fa-arrow-right" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default HeroForm;
