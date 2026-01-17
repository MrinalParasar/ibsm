"use client";

import { useState, useEffect } from "react";
import FunFactCounter from "@/components/FunFactCounter";
import { TestimonialSlider1 } from "@/components/TestimonialSlider";
import Services, { Service2 } from "@/components/Services";
import AboutImageSlider from "@/components/AboutImageSlider";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";
import HeroForm from "@/components/HeroForm";

const page = () => {
  const [heroFormData, setHeroFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agreedToTerms: false,
  });
  const [heroFormStatus, setHeroFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news?type=featured&limit=3');
        if (response.ok) {
          const data = await response.json();
          setFeaturedNews(data.news || []);
        }
      } catch (error) {
        console.error("Failed to fetch featured news", error);
      }
    };

    const fetchFeatures = async () => {
      try {
        const response = await fetch('/api/news?type=services&limit=3');
        if (response.ok) {
          const data = await response.json();
          // The API returns { news: [...] } for type=services
          setFeatures(data.news || []);
        }
      } catch (error) {
        console.error("Failed to fetch features", error);
      }
    };

    fetchNews();
    fetchFeatures();
  }, []);


  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroFormStatus({ type: null, message: '' });

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formSource: "hero-consultation",
          name: heroFormData.name,
          email: heroFormData.email,
          phone: heroFormData.phone,
          agreedToTerms: heroFormData.agreedToTerms,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setHeroFormStatus({ type: 'success', message: 'Thank you! We will contact you soon.' });
        setHeroFormData({ name: "", email: "", phone: "", agreedToTerms: false });
      } else {
        setHeroFormStatus({ type: 'error', message: data.error || 'Failed to submit form' });
      }
    } catch (error) {
      setHeroFormStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    }
  };
  const truncateText = (text: string, limit: number) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <NextLayout header={1}>
      <section
        className="hero-section hero-1 fix"
      >
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="text-black wow fadeInUp" data-wow-delay=".2s">
                  Your <span style={{ backgroundColor: "#ffd966", color: "#000", padding: "0 10px", borderRadius: "4px", display: "inline-block", marginBottom: "8px" }}>Safety</span> & <br />
                  <span style={{ backgroundColor: "#ffd966", color: "#000", padding: "0 10px", borderRadius: "4px", display: "inline-block" }}>Security</span> Our <br />
                  Responsibility
                </h1>
                <div className="d-block d-lg-none py-4">
                  <HeroForm
                    formData={heroFormData}
                    setFormData={setHeroFormData}
                    formStatus={heroFormStatus}
                    onSubmit={handleHeroFormSubmit}
                  />
                </div>
                <p className="text-black wow fadeInUp" data-wow-delay=".4s" style={{ paddingTop: "15px" }}>
                  Welcome to IBSM Global Security Solutions, <br />
                  your trusted partner in safeguarding what matters most.
                </p>
                <div className="hero-button">
                  <Link
                    href="/"
                    className="theme-btn wow fadeInUp"
                    data-wow-delay=".4s"
                  >
                    Get Started Now <i className="far fa-arrow-right" />
                  </Link>
                  <Link
                    href="service"
                    className="theme-btn wow fadeInUp"
                    style={{ background: "transparent", border: "1px solid #000", color: "#000", boxShadow: "none" }}
                    data-wow-delay=".6s"
                  >
                    View Services <i className="far fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-5 wow fadeInUp d-none d-lg-block" data-wow-delay=".4s">
              <HeroForm
                formData={heroFormData}
                setFormData={setHeroFormData}
                formStatus={heroFormStatus}
                onSubmit={handleHeroFormSubmit}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Service Section Start */}
      <section className="service-section fix pt-80 pb-80" style={{ backgroundColor: "#000" }}>
        <div className="container">
          <h4
            className="mb-5 text-white text-center wow fadeInUp"
            data-wow-delay=".3s"
          >
            Ensuring Your Safety With \u003cbr /\u003e Professional Security Solutions
          </h4>
          <div className="row g-4">
            {features.length > 0 ? (
              features.map((feature, index) => (
                <div
                  key={feature._id}
                  className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                  data-wow-delay={`${0.3 + index * 0.2}s`}
                >
                  <div className="service-items">
                    <div className="content">
                      <p>{String(index + 1).padStart(2, '0')}</p>
                      <h5>
                        <Link href={`/blog/${feature.slug}`}>
                          {truncateText(feature.title, 45)}
                        </Link>
                      </h5>
                      <Link className="arrow-btn" href={`/blog/${feature.slug}`}>
                        <i className="far fa-arrow-right" />
                      </Link>
                    </div>
                    <div className="thumb">
                      <img src={feature.featuredImage} alt={feature.title} style={{ maxWidth: "160px", borderRadius: "10px" }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to hardcoded if no dynamic features
              <>
                <div
                  className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                  data-wow-delay=".3s"
                >
                  <div className="service-items">
                    <div className="content">
                      <p>01</p>
                      <h5>
                        <Link href="/service-details?service=monitoring">
                          24/7 Monitoring & <br />
                          Control Center
                        </Link>
                      </h5>
                      <Link className="arrow-btn" href="/service-details?service=monitoring">
                        <i className="far fa-arrow-right" />
                      </Link>
                    </div>
                    <div className="thumb">
                      <img src="/assets/img/service/01.jpg" alt="img" />
                    </div>
                  </div>
                </div>
                <div
                  className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  <div className="service-items">
                    <div className="content">
                      <p>02</p>
                      <h5>
                        <Link href="/service-details?service=personnel">
                          Highly Trained <br />
                          Security Personnel
                        </Link>
                      </h5>
                      <Link className="arrow-btn" href="/service-details?service=personnel">
                        <i className="far fa-arrow-right" />
                      </Link>
                    </div>
                    <div className="thumb">
                      <img src="/assets/img/service/02.jpg" alt="img" />
                    </div>
                  </div>
                </div>
                <div
                  className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                  data-wow-delay=".7s"
                >
                  <div className="service-items">
                    <div className="content">
                      <p>03</p>
                      <h5>
                        <Link href="/service-details?service=technology">
                          Advanced Security <br />
                          Technology Support
                        </Link>
                      </h5>
                      <Link className="arrow-btn" href="/service-details?service=technology">
                        <i className="far fa-arrow-right" />
                      </Link>
                    </div>
                    <div className="thumb">
                      <img src="/assets/img/service/03.jpg" alt="img" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {/* About Section Start */}
      <section className="about-section fix section-padding">
        <div className="container">
          <div className="about-wrapper">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="about-image-items">
                  <ul
                    className="experience-text wow fadeInUp"
                    data-wow-delay=".6s"
                  >
                    <li>25+ Years Of Experience</li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>Awards Winning Company</li>
                  </ul>
                  <AboutImageSlider />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content">
                  <div className="section-title">
                    <span className="sub-content wow fadeInUp">

                      About Us
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      IBSM Global Security Solutions
                    </h2>
                  </div>
                  <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                    At IBSM Global Security Solutions, we are dedicated to providing top-notch
                    security services tailored to meet the unique needs of our clients. With a
                    focus on professionalism, reliability, and excellence, we strive to ensure the
                    safety and security of our clients' assets and personnel.
                  </p>
                  <div className="section-title mt-4">
                    <span className="sub-content wow fadeInUp">
                      Our History
                    </span>
                  </div>
                  <p className="wow fadeInUp" data-wow-delay=".3s">
                    Founded on May 15, 2021, by Ajesh Kumar, IBSM Global Security Solutions is
                    headquartered in Ghaziabad, Uttar Pradesh. Our commitment to excellence,
                    coupled with our dedication to serving our clients with integrity and
                    professionalism, has been the cornerstone of our success.
                  </p>

                  <div
                    className="about-author wow fadeInUp"
                    data-wow-delay=".5s"
                  >
                    <div className="about-button">
                      <Link href="about" className="theme-btn">
                        Learn More Us
                        <i className="far fa-arrow-right" />
                      </Link>
                    </div>
                    <div className="author-image">
                      <img src="/assets/img/about/author.jpg" alt="author-img" />
                      <div className="content">
                        <h5>
                          Ajesh Kumar / <span>Founder & CEO</span>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Service Section Start */}
      <section className="service-section section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-content wow fadeInUp">

              Popular Services
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              We Provide Best Quality Service <br />
              For Your Business
            </h2>
          </div>
          <div className="row">
            <div
              className="col-xl-7 col-lg-7 col-md-12 wow fadeInUp"
              data-wow-delay=".2s"
            >
              <div className="service-card-items">
                <div className="service-thumb">
                  <img src="/assets/img/service/guard-service.png" alt="service-img" />
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="service-details">
                      Security Guard & Bouncer Services
                    </Link>
                  </h3>
                  <p>Our professional security services provide highly trained personnel tailored to your specific needs. From discreet personal protection and specialized bouncer services for high-profile events to robust escort guard solutions, we ensure comprehensive safety and peace of mind through vigilant and reliable security management.</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-5 col-lg-5 col-md-12 wow fadeInUp"
              data-wow-delay=".4s"
            >
              <div className="service-card-items active">
                <div className="service-thumb">
                  <img src="/assets/img/service/specialized-service.png" alt="service-img" />
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="service-details">
                      Specialized Security Solutions
                    </Link>
                  </h3>
                  <p>Event, Tourist, Industrial, and Property security along with Cash Management.</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-5 col-lg-5 col-md-12 wow fadeInUp"
              data-wow-delay=".6s"
            >
              <div className="service-card-items">
                <div className="service-thumb">
                  <img src="/assets/img/service/facility-service.png" alt="service-img" />
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="service-details">
                      Facility Management Services
                    </Link>
                  </h3>
                  <p>Corporate Housekeeping, Pantry Boy, and Office Boy services for your facility.</p>
                </div>
              </div>
            </div>
            <div
              className="col-xl-7 col-lg-7 col-md-12 wow fadeInUp"
              data-wow-delay=".8s"
            >
              <div className="service-card-items">
                <div className="service-thumb">
                  <img src="/assets/img/service/manpower-service.png" alt="service-img" />
                </div>
                <div className="service-content">
                  <h3>
                    <Link href="service-details">
                      Professional Manpower Services
                    </Link>
                  </h3>
                  <p>We offer comprehensive manpower solutions to streamline your business operations. Our services include providing skilled office personnel, temporary staffing for seasonal peaks, and specialized event staff. We bridge the talent gap by matching qualified individuals with your unique requirements, ensuring professional excellence in every role.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Cta Video Section Start */}
      <div
        className="cta-video-section fix bg-cover"
      >
        <div className="container">
          <div className="cta-video-wrapper" style={{ minHeight: "0px" }}>
            {/* Video button removed for photo section */}
          </div>
        </div>
        <div className="marquee-wrapper">
          <div className="marquee-inner to-left">
            <ul className="marqee-list d-flex">
              <li className="marquee-item">
                <span className="text-slider">IBSM Global Security</span>
                <span className="text-slider style-border" />
                <span className="text-slider">Security Guards </span>
                <span className="text-slider style-border" />
                <span className="text-slider">Bouncer Services </span>
                <span className="text-slider style-border" />
                <span className="text-slider">Escort Guards </span>
                <span className="text-slider style-border" />
                <span className="text-slider">Facility Management</span>
                <span className="text-slider style-border" />
                <span className="text-slider">IBSM Global Security</span>
                <span className="text-slider style-border" />
                <span className="text-slider">Security Guards </span>
                <span className="text-slider style-border" />
                <span className="text-slider">Bouncer Services </span>
                <span className="text-slider style-border" />
                <span className="text-slider">Escort Guards </span>
                <span className="text-slider style-border" />
                <span className="text-slider">Facility Management</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Funfact Section Start */}
      <section className="funfact-section section-padding">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-content wow fadeInUp">

              Company Fun Fact
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Learn Our Company Statistics
            </h2>
          </div>
          <FunFactCounter style={undefined} />
        </div>
      </section>
      {/* Popular Case Study Section Start */}
      <section className="case-study-section fix section-padding" style={{ backgroundColor: "#0D0D0D" }}>
        <div className="container">
          <div className="section-title-area mb-5">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="section-title mb-0">
                  <span className="sub-content wow fadeInUp" style={{ backgroundColor: "rgba(255, 217, 102, 0.1)", color: "#ffd966", boxShadow: "none" }}>

                    PSARA License
                  </span>
                  <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
                    A PSARA Approved <br /> Security Company
                  </h2>
                </div>
                <p className="text-white mt-4 wow fadeInUp" data-wow-delay=".5s" style={{ opacity: 0.8, fontSize: "18px" }}>
                  IBSM Security is a PSARA-approved company offering premier security solutions. Our highly
                  trained professionals provide reliable, top-notch protection for businesses and individuals,
                  fully compliant with the Private Security Agencies (Regulation) Act.
                </p>
              </div>
              <div className="col-lg-5 text-center text-lg-end">
                <div className="psara-badge-container wow zoomIn" data-wow-delay=".4s">
                  <div className="psara-badge">
                    <div className="badge-inner">
                      <div className="badge-content">
                        <i className="fas fa-shield-check mb-2"></i>
                        <span>PSARA</span>
                        <strong>APPROVED</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".3s"
            >
              <div className="case-study-items">
                <div className="thumb">
                  <img src="/assets/img/case-study/01.jpg" alt="img" />
                </div>
                <div className="content">
                  <p>Industrial Security</p>
                  <h3>
                    <Link href="case-study-details">
                      Your Safety & Security <br /> Our Responsibility
                    </Link>
                  </h3>
                  <Link className="arrow-btn" href="case-study-details">
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".5s"
            >
              <div className="case-study-items">
                <div className="thumb">
                  <img src="/assets/img/case-study/02.jpg" alt="img" />
                </div>
                <div className="content">
                  <p>Commercial Security</p>
                  <h3>
                    <Link href="case-study-details">
                      Comprehensive Protection For All Your Assets
                    </Link>
                  </h3>
                  <Link className="arrow-btn" href="case-study-details">
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".7s"
            >
              <div className="case-study-items">
                <div className="thumb">
                  <img src="/assets/img/case-study/03.jpg" alt="img" />
                </div>
                <div className="content">
                  <p>Personal Security</p>
                  <h3>
                    <Link href="case-study-details">
                      Expert Surveillance and Guarding Solutions
                    </Link>
                  </h3>
                  <Link className="arrow-btn" href="case-study-details">
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonial Section Start */}
      <section className="testimonial-section fix section-padding">
        <div className="container">
          <div className="testimonial-wrapper">
            <div className="row g-4">
              <div className="col-lg-3">
                <div className="testimonial-image">
                  <img src="/assets/img/testimonial/testimonial.png" alt="img" />
                </div>
              </div>
              <div className="col-lg-7 ps-lg-5">
                <TestimonialSlider1 />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* News Section Start */}
      <section className="news-section section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-content wow fadeInUp">

              News &amp; Blog
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Explore Our Latest News &amp; Blog
            </h2>
          </div>
          <div className="row">
            {featuredNews.map((newsItem: any, index: number) => (
              <div
                key={index}
                className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
                data-wow-delay={`${0.3 + index * 0.2}s`}
              >
                <div className="news-box-items">
                  <div className="news-content">
                    <p>{new Date(newsItem.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <h4>
                      <Link href={`/blog/${newsItem.slug}`}>
                        {truncateText(newsItem.title, 45)}
                      </Link>
                    </h4>
                    <Link className="link-btn" href={`/blog/${newsItem.slug}`}>
                      Read More
                      <i className="far fa-arrow-right" />
                    </Link>
                  </div>
                  <div
                    className="news-image bg-cover"
                    style={{ backgroundImage: `url("${newsItem.featuredImage}")` }}
                  />
                </div>
              </div>
            ))}
            {featuredNews.length === 0 && (
              <div className="col-12 text-center">
                <p>Loading news...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </NextLayout>
  );
};
export default page;
