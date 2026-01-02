import FunFactCounter from "@/components/FunFactCounter";
import { TestimonialSlider1 } from "@/components/TestimonialSlider";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";
const page = () => {
  return (
    <NextLayout header={1}>
      <section
        className="hero-section hero-1 bg-cover fix"
        style={{
          background:
            "linear-gradient(135deg, #000000 0%, #000000 50%, #FAC014 100%)",
        }}
      >
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="text-white wow fadeInUp" data-wow-delay=".2s">
                  Your <br />
                  <span style={{ backgroundColor: "#FAC014", color: "#000", padding: "0 10px", borderRadius: "4px", display: "inline-block", marginBottom: "10px" }}>Safety</span> <br />
                  <span style={{ backgroundColor: "#FAC014", color: "#000", padding: "0 10px", borderRadius: "4px", display: "inline-block" }}>& Security</span> <br />
                  Our Responsibility
                </h1>
                <p className="text-white wow fadeInUp" data-wow-delay=".4s">
                  Welcome to IBSM Global Security Solutions, your trusted partner in
                  safeguarding what matters most.
                </p>
                <div className="hero-button">
                  <Link
                    href="/"
                    className="theme-btn hover-white wow fadeInUp"
                    style={{
                      background: "linear-gradient(90deg, #FAD02B 0%, #FAC014 100%)",
                      color: "#000",
                      border: "none",
                      fontWeight: "700",
                      boxShadow: "0 4px 15px rgba(250, 192, 20, 0.3)"
                    }}
                    data-wow-delay=".4s"
                  >
                    Get Started Now <i className="far fa-arrow-right" />
                  </Link>
                  <Link
                    href="service"
                    className="btn-link wow fadeInUp"
                    style={{ color: "#FAC014", textDecoration: "none", border: "1px solid #FAC014", padding: "12px 25px", borderRadius: "14px", display: "inline-block" }}
                    data-wow-delay=".6s"
                  >
                    View Services <i className="far fa-arrow-right" />
                  </Link>
                </div>
                <div
                  className="hero-client d-flex align-items-center gap-2 mt-50 wow fadeInUp"
                  data-wow-delay=".8s"
                >
                  <div className="d-flex align-items-center me-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <img
                        key={i}
                        src={`/assets/img/team/0${i}.jpg`}
                        alt="client"
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          border: "2px solid #FAC014",
                          marginLeft: i === 1 ? "0" : "-15px",
                          objectFit: "cover",
                          position: "relative",
                          zIndex: 6 - i,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-white mb-0">
                    Trusted by 1M+ people <br />
                    around the globe
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-5 wow fadeInUp" data-wow-delay=".4s">
              <div className="hero-contact-box">
                <h4>Get Consultations</h4>
                <p>Ready to Register Our Security Services</p>
                <form
                  action="#"
                  id="contact-form"
                  method="POST"
                  className="contact-form-item"
                >
                  <div className="row g-4">
                    <div className="col-lg-12">
                      <div className="form-clt">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Your Name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-clt">
                        <input
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Email Address"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-clt">
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="payment-save">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="save-for-next"
                          id="saveForNext"
                        />
                        <p>
                          I’ve Read and agreed to{" "}
                          <Link href="/">Terms &amp; Conditions</Link>
                        </p>
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
            </div>
          </div>
        </div>
      </section>
      {/* Service Section Start */}
      <section className="service-section fix pt-80 pb-80 section-bg">
        <div className="container">
          <h4
            className="mb-5 text-white text-center wow fadeInUp"
            data-wow-delay=".3s"
          >
            Preparing For Your Business Success With IT Solution
          </h4>
          <div className="row g-4">
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".3s"
            >
              <div className="service-items">
                <div className="content">
                  <p>01</p>
                  <h5>
                    <Link href="service-details">
                      Data Manage &amp; <br />
                      Solutions Center
                    </Link>
                  </h5>
                  <Link className="arrow-btn" href="service-details">
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
                    <Link href="service-details">
                      Preparing For <br />
                      Cloud Services
                    </Link>
                  </h5>
                  <Link className="arrow-btn" href="service-details">
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
                    <Link href="service-details">
                      Machine Learning <br />
                      &amp; Development
                    </Link>
                  </h5>
                  <Link className="arrow-btn" href="service-details">
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
                <div className="thumb">
                  <img src="/assets/img/service/03.jpg" alt="img" />
                </div>
              </div>
            </div>
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
                    <li>Since 2021</li>
                    <li>
                      <i className="fas fa-star" />
                    </li>
                    <li>PSARA Licensed Company</li>
                  </ul>
                  <div className="row g-4 align-items-center">
                    <div className="col-md-6 wow fadeInUp" data-wow-delay=".2s">
                      <div className="about-image">
                        <img src="/assets/img/about/01.jpg" alt="about-img" />
                      </div>
                    </div>
                    <div className="col-md-6 wow fadeInUp" data-wow-delay=".4s">
                      <div className="about-image">
                        <img src="/assets/img/about/02.jpg" alt="about-img" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content">
                  <div className="section-title">
                    <span className="sub-content wow fadeInUp">
                      <img src="/assets/img/bale.png" alt="img" />
                      About Us
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      IBSM Global Security Solutions
                    </h2>
                  </div>
                  <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                    Welcome to IBSM Global Security Solutions, your trusted partner in safeguarding
                    what matters most. With tailored security solutions and a commitment to excellence,
                    we deliver peace of mind and unparalleled protection for your home, business, or event.
                    At IBSM Global Security Solutions, we are dedicated to providing top-notch security
                    services tailored to meet the unique needs of our clients.
                  </p>
                  <div className="section-title mt-4">
                    <span className="sub-content wow fadeInUp">
                      Our History
                    </span>
                  </div>
                  <p className="wow fadeInUp" data-wow-delay=".3s">
                    Founded on May 15, 2021, by Ajesh Kumar, IBSM Global Security Solutions is
                    headquartered in Ghaziabad, Uttar Pradesh. Despite being a relatively young company,
                    we have quickly established ourselves as a trusted name in the security industry.
                    Our commitment to excellence, coupled with our dedication to serving our clients with
                    integrity and professionalism, has been the cornerstone of our success. As we continue
                    to grow and expand our operations, we remain steadfast in our mission to provide
                    top-notch security solutions tailored to meet the unique needs of our clients in
                    Ghaziabad and beyond.
                  </p>
                  <ul className="about-list wow fadeInUp" data-wow-delay=".3s">
                    <li>
                      <i className="fas fa-check" />
                      Highly trained security personnel with cutting-edge technology
                    </li>
                    <li>
                      <i className="fas fa-check" />
                      Integrated solutions: Security, Housekeeping & Manpower under one roof
                    </li>
                    <li>
                      <i className="fas fa-check" />
                      PSARA licensed with comprehensive risk assessment capabilities
                    </li>
                  </ul>
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
              <img src="/assets/img/bale.png" alt="img" />
              Popular Services
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              We Provide Best Quality Service <br />
              For Your Business
            </h2>
          </div>
          <div className="row">
            <div
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".2s"
            >
              <div className="service-card-items">
                <div className="icon">
                  <i className="flaticon-technical" />
                </div>
                <h3>
                  <Link href="service-details">
                    Security Guard & Bouncer Services
                  </Link>
                </h3>
                <p>Professional Security Guard, Bouncer, Body Guard, and Escort Guard services.</p>
                <div className="service-thumb">
                  <img src="/assets/img/service/04.png" alt="service-img" />
                </div>
              </div>
            </div>
            <div
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".4s"
            >
              <div className="service-card-items active">
                <div className="icon">
                  <i className="flaticon-vector-design" />
                </div>
                <h3>
                  <Link href="service-details">
                    Specialized Security Solutions
                  </Link>
                </h3>
                <p>Event, Tourist, Industrial, and Property security along with Cash Management.</p>
                <div className="service-thumb">
                  <img src="/assets/img/service/05.png" alt="service-img" />
                </div>
              </div>
            </div>
            <div
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".6s"
            >
              <div className="service-card-items">
                <div className="icon">
                  <i className="flaticon-database" />
                </div>
                <h3>
                  <Link href="service-details">
                    Facility Management Services
                  </Link>
                </h3>
                <p>Corporate Housekeeping, Pantry Boy, and Office Boy services for your facility.</p>
                <div className="service-thumb">
                  <img src="/assets/img/service/06.png" alt="service-img" />
                </div>
              </div>
            </div>
            <div
              className="col-xxl-3 col-xl-4 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".8s"
            >
              <div className="service-card-items">
                <div className="icon">
                  <i className="flaticon-design-thinking" />
                </div>
                <h3>
                  <Link href="service-details">
                    Professional Manpower Services
                  </Link>
                </h3>
                <p>Office Manpower, Temporary Staff, and Event Staff for your business needs.</p>
                <div className="service-thumb">
                  <img src="/assets/img/service/07.png" alt="service-img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Cta Video Section Start */}
      <div
        className="cta-video-section fix bg-cover"
        style={{ backgroundImage: 'url("/assets/img/cta/security-banner.png")' }}
      >
        <div className="container">
          <div className="cta-video-wrapper" style={{ minHeight: "250px" }}>
            {/* Video button removed for photo section */}
          </div>
        </div>
        <div className="marquee-wrapper">
          <div className="marquee-inner to-left">
            <ul className="marqee-list d-flex">
              <li className="marquee-item">
                <span className="text-slider" style={{ fontSize: "70px" }}>IBSM Global Security</span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Security Guards </span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Bouncer Services </span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Escort Guards </span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Facility Management</span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>IBSM Global Security</span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Security Guards </span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Bouncer Services </span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Escort Guards </span>
                <span className="text-slider style-border" style={{ fontSize: "70px" }} />
                <span className="text-slider" style={{ fontSize: "70px" }}>Facility Management</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Team Section Start */}
      <section className="team-section fix section-padding">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className="section-title">
                <span className="sub-content wow fadeInUp">
                  <img src="/assets/img/bale.png" alt="img" />
                  Our Benchmarks
                </span>
                <h2 className="wow fadeInUp" data-wow-delay=".3s">
                  Setting Benchmarks in Security
                </h2>
              </div>
              <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                IBSM Security sets benchmarks in security with comprehensive risk assessment,
                advanced surveillance, and highly trained personnel, ensuring unparalleled
                safety for clients and their assets.
              </p>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".3s"
            >
              <div className="team-items">
                <div className="team-image">
                  <img src="/assets/img/team/01.jpg" alt="img" />
                </div>
                <div className="team-content">
                  <h4>
                    <Link href="team-details">Robert E. Whitmore</Link>
                  </h4>
                  <p>Product Designer</p>
                  <div className="social-profile">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                    <span className="plus-btn">
                      <i className="far fa-plus" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".5s"
            >
              <div className="team-items">
                <div className="team-image">
                  <img src="/assets/img/team/02.jpg" alt="img" />
                </div>
                <div className="team-content">
                  <h4>
                    <Link href="team-details">Johnny M. Smith</Link>
                  </h4>
                  <p>IT Consultant</p>
                  <div className="social-profile">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                    <span className="plus-btn">
                      <i className="far fa-plus" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".2s"
            >
              <div className="team-items">
                <div className="team-image">
                  <img src="/assets/img/team/03.jpg" alt="img" />
                </div>
                <div className="team-content">
                  <h4>
                    <Link href="team-details">Angelo H. Tomlin</Link>
                  </h4>
                  <p>Senior Manager</p>
                  <div className="social-profile">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                    <span className="plus-btn">
                      <i className="far fa-plus" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".4s"
            >
              <div className="team-items">
                <div className="team-image">
                  <img src="/assets/img/team/04.jpg" alt="img" />
                </div>
                <div className="team-content">
                  <h4>
                    <Link href="team-details">Robert E. Whitmore</Link>
                  </h4>
                  <p>Web Designer</p>
                  <div className="social-profile">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                    <span className="plus-btn">
                      <i className="far fa-plus" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
              data-wow-delay=".6s"
            >
              <div className="team-items">
                <div className="team-image">
                  <img src="/assets/img/team/05.jpg" alt="img" />
                </div>
                <div className="team-content">
                  <h4>
                    <Link href="team-details">Manuel G. Wilmer</Link>
                  </h4>
                  <p>CEO &amp; Founder</p>
                  <div className="social-profile">
                    <ul>
                      <li>
                        <a href="#">
                          <i className="fab fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram" />
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-linkedin-in" />
                        </a>
                      </li>
                    </ul>
                    <span className="plus-btn">
                      <i className="far fa-plus" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 ps-xxl-5 wow fadeInUp"
              data-wow-delay=".8s"
            >
              <Link href="team" className="theme-btn">
                View More Members
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Funfact Section Start */}
      <section className="funfact-section section-padding pt-0">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-content wow fadeInUp">
              <img src="/assets/img/bale.png" alt="img" />
              Company Fun Fact
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Learn Our Company Statistics
            </h2>
          </div>
          <FunFactCounter />
        </div>
      </section>
      {/* Popular Case Study Section Start */}
      <section className="case-study-section fix section-padding theme-bg">
        <div className="left-shape">
          <img src="/assets/img/case-study/left-shape.png" alt="shape-img" />
        </div>
        <div className="right-shape">
          <img src="/assets/img/case-study/right-shape.png" alt="shape-img" />
        </div>
        <div className="container">
          <div className="section-title-area">
            <div className="section-title">
              <span className="sub-content wow fadeInUp">
                <img src="/assets/img/bale.png" alt="img" />
                PSARA License
              </span>
              <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
                A PSARA Approved Company
              </h2>
            </div>
            <p className="text-white wow fadeInUp" data-wow-delay=".5s">
              "IBSM Security is a PSARA-approved company offering premier security solutions. Our highly
              trained professionals provide reliable, top-notch protection for businesses and individuals."
            </p>
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
                  <p>IT Consulting</p>
                  <h3>
                    <Link href="case-study-details">
                      How to achieve more with your nine to five
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
                  <p>Machine Learning</p>
                  <h3>
                    <Link href="case-study-details">
                      Strategies for outstanding future results
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
                  <p>Software Design</p>
                  <h3>
                    <Link href="case-study-details">
                      Discover a better way of system defining company goals.
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
              <img src="/assets/img/bale.png" alt="img" />
              News &amp; Blog
            </span>
            <h2 className="wow fadeInUp" data-wow-delay=".3s">
              Explore Our Latest News &amp; Blog
            </h2>
          </div>
          <div className="row">
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".3s"
            >
              <div className="news-box-items">
                <div className="news-content">
                  <p>November 25, 2024</p>
                  <h4>
                    <Link href="news-details">
                      Revealing Images With Animations Gradients, Blend Modes
                      Cool
                    </Link>
                  </h4>
                  <Link className="link-btn" href="news-details">
                    Read More
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
                <div
                  className="news-image bg-cover"
                  style={{ backgroundImage: 'url("/assets/img/news/01.jpg")' }}
                />
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".5s"
            >
              <div className="news-box-items">
                <div className="news-content">
                  <p>November 25, 2024</p>
                  <h4>
                    <Link href="news-details">
                      List of 5 ways Generating Real Time Audio Sentiment
                      Analysis
                    </Link>
                  </h4>
                  <Link className="link-btn" href="news-details">
                    Read More
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
                <div
                  className="news-image bg-cover"
                  style={{ backgroundImage: 'url("/assets/img/news/02.jpg")' }}
                />
              </div>
            </div>
            <div
              className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp"
              data-wow-delay=".7s"
            >
              <div className="news-box-items">
                <div className="news-content">
                  <p>November 25, 2024</p>
                  <h4>
                    <Link href="news-details">
                      Revealing Images With Animations Gradients, Blend Modes
                      Cool
                    </Link>
                  </h4>
                  <Link className="link-btn" href="news-details">
                    Read More
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
                <div
                  className="news-image bg-cover"
                  style={{ backgroundImage: 'url("/assets/img/news/03.jpg")' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </NextLayout>
  );
};
export default page;
