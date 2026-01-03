import Breadcrumb from "@/components/Breadcrumb";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";

const Careers = () => {
    const vacancies = [
        {
            title: "Security Guard (Unarmed)",
            location: "Ghaziabad / Delhi NCR",
            type: "Full Time",
            description: "Responsible for monitoring premises and personnel. Patrolling, monitoring surveillance equipment, and inspecting buildings.",
            requirements: ["High school diploma or equivalent", "Physical fitness", "Good communication skills"]
        },
        {
            title: "Armed Security Officer",
            location: "Noida / Gurugram",
            type: "Full Time",
            description: "Provide high-level security for high-value assets and VIPs. Requires valid arms license and extensive experience.",
            requirements: ["Valid Arms License", "Ex-Servicemen preferred", "5+ years experience"]
        },
        {
            title: "Security Supervisor",
            location: "Ghaziabad",
            type: "Full Time",
            description: "Supervise a team of security guards, conduct orientation, and ensure all security protocols are followed strictly.",
            requirements: ["Leadership skills", "Previous supervisory experience", "Conflict resolution skills"]
        },
        {
            title: "Event Bouncer",
            location: "Delhi NCR",
            type: "Part Time / Contract",
            description: "Managing crowd control and ensuring safety at high-profile events, clubs, and private functions.",
            requirements: ["Height: 5'10\"+", "Strong build", "Experience in crowd management"]
        },
        {
            title: "Housekeeping Staff",
            location: "Noida",
            type: "Full Time",
            description: "Perform cleaning and maintenance duties to ensure premises are kept clean and in orderly condition.",
            requirements: ["Punctuality", "Hardworking", "Attention to detail"]
        }
    ];

    return (
        <NextLayout>
            <Breadcrumb pageName="Careers" />

            {/* Why Join Us Section Start */}
            <section className="about-section fix section-padding pb-0">
                <div className="container">
                    <div className="about-wrapper style-2">
                        <div className="row g-4 align-items-center">
                            <div className="col-lg-6">
                                <div className="about-content ms-0">
                                    <div className="section-title">
                                        <span className="sub-content wow fadeInUp">
                                            <img src="/assets/img/bale.png" alt="img" />
                                            Join Our Team
                                        </span>
                                        <h2 className="wow fadeInUp" data-wow-delay=".3s">
                                            Build Your Career in Security Excellence
                                        </h2>
                                    </div>
                                    <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                                        At IBSM Global Security Solutions, we believe our people are our greatest asset.
                                        We offer a supportive environment, continuous training, and numerous opportunities
                                        for professional growth.
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
                            <img src="/assets/img/bale.png" alt="img" />
                            Current Openings
                        </span>
                        <h2>Explore New Opportunities</h2>
                    </div>
                    <div className="row g-4 mt-4">
                        {vacancies.map((job, index) => (
                            <div key={index} className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay={`${0.2 * (index % 3 + 1)}s`}>
                                <div className="service-card-items style-2" style={{ height: '100%' }}>
                                    <div className="service-content">
                                        <span className="type-tag" style={{ background: '#1800ad', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>{job.type}</span>
                                        <h3 className="mt-2">
                                            <Link href="#">{job.title}</Link>
                                        </h3>
                                        <p style={{ fontSize: '14px', color: '#666' }}>
                                            <i className="fas fa-map-marker-alt me-2" /> {job.location}
                                        </p>
                                        <p className="mt-3">{job.description}</p>
                                        <Link href="#apply" className="theme-btn mt-4">
                                            Apply Now <i className="far fa-arrow-right" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
                                        <p>Tell us about yourself and we will get back to you soon.</p>
                                    </div>
                                    <form action="#" id="career-form" className="contact-form-items">
                                        <div className="row g-4">
                                            <div className="col-lg-6">
                                                <div className="form-clt">
                                                    <input type="text" name="name" id="name" placeholder="Full Name" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-clt">
                                                    <input type="email" name="email" id="email" placeholder="Email Address" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-clt">
                                                    <input type="text" name="phone" id="phone" placeholder="Phone Number" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-clt">
                                                    <select name="position" id="position" className="form-control" style={{ height: '60px', borderRadius: '5px', border: '1px solid #eee' }} required>
                                                        <option value="">Select Position</option>
                                                        {vacancies.map((job, index) => (
                                                            <option key={index} value={job.title}>{job.title}</option>
                                                        ))}
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-clt">
                                                    <textarea name="experience" id="experience" placeholder="Briefly describe your experience" required />
                                                </div>
                                            </div>
                                            <div className="col-lg-12 text-center">
                                                <button type="submit" className="theme-btn">
                                                    Submit Application
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

        </NextLayout>
    );
};

export default Careers;
