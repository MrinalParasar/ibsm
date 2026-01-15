import Breadcrumb from "@/components/Breadcrumb";


import { TestimonialSlider2 } from "@/components/TestimonialSlider";
import { WorkingProcess2 } from "@/components/WorkingProcess";
import NextLayout from "@/layouts/NextLayout";
import Link from "next/link";
const page = () => {
  return (
    <NextLayout>
      {/*<< Breadcrumb Section Start >>*/}
      <Breadcrumb />
      {/* About Section Start */}
      <section className="about-section fix section-padding pb-0" style={{ paddingTop: "0px" }}>
        <div className="container">
          <div className="about-wrapper style-2">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="about-content ms-0 style-about">
                  <div className="section-title">
                    <span className="sub-content wow fadeInUp">
                      About Us
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      Your Safety, Our Responsibility
                    </h2>
                  </div>
                  <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                    At IBSM Global Security Solutions, we provide top-notch, tailored security services with a focus on professionalism and reliability. As your trusted partner in safeguarding what matters most, we deliver peace of mind and unparalleled protection for your home, business, or event.
                  </p>
                  <h4 className="wow fadeInUp mt-4" data-wow-delay=".3s">
                    Our History
                  </h4>
                  <p className="mt-3 wow fadeInUp" data-wow-delay=".5s">
                    Founded in 2021 by Ajesh Kumar and headquartered in Ghaziabad, IBSM Global Security Solutions has quickly established itself as a trusted industry name. We provide integrated solutions—combining Security, Housekeeping, and Manpower services—allowing you to rely on a single, professional partner for all your non-core needs.
                  </p>
                </div>
              </div>
              <div className="col-lg-6 wow fadeInUp" data-wow-delay=".4s">
                <div className="about-image-3">
                  <img
                    src="/assets/img/about/security-team.png"
                    alt="IBSM Security Team"
                    style={{
                      borderRadius: "12px",
                      border: "2px solid rgba(255, 217, 102, 0.3)",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      height: "400px",
                      objectFit: "cover",
                      display: "block",
                      margin: "0 auto"
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* About Section Start */}
      {/* About Section Start (Merged) */}

      {/* psara-section-start */}
      <section className="about-section fix section-padding">
        <div className="container">
          <div className="about-wrapper style-2">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6 wow fadeInUp" data-wow-delay=".4s">
                <div className="about-image-3">
                  <img
                    src="/assets/img/about/psara-office.png"
                    alt="IBSM PSARA Certified Office"
                    style={{
                      borderRadius: "12px",
                      border: "2px solid rgba(255, 217, 102, 0.3)",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      height: "400px", // Increased height
                      objectFit: "cover",
                      display: "block",
                      margin: "40px 0 0 0"
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content ms-0">
                  <div className="section-title">
                    <span className="sub-content wow fadeInUp">
                      PSARA License
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      A PSARA Approved Company
                    </h2>
                  </div>
                  <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                    IBSM Security is a fully compliant, PSARA-approved company. Our license ensures we meet the strict legal standards required for private security agencies in India, guaranteeing you professional and regulated service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Working Process Section Start */}
      <WorkingProcess2 />
      {/* Testimonial Section Start */}
      <section className="testimonial-section-2 fix section-padding fix">
        <div className="bg-shape">
          <img src="/assets/img/testimonial/bg-shape.png" alt="shape-img" />
        </div>
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-content">
              Clients Feedback
            </span>
            <h2>What Our 325+ Satisfied Clients Say</h2>
          </div>
        </div>
        <TestimonialSlider2 />
      </section>
      {/* Footer Section Start */}
    </NextLayout>
  );
};
export default page;
