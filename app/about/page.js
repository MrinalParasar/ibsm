import Breadcrumb from "@/components/Breadcrumb";
import FunFactCounter from "@/components/FunFactCounter";
import Team from "@/components/Team";
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
      <section className="about-section fix section-padding pb-0">
        <div className="container">
          <div className="about-wrapper style-2">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6">
                <div className="about-content ms-0 style-about">
                  <div className="section-title">
                    <span className="sub-content wow fadeInUp">
                      <img src="/assets/img/bale.png" alt="img" />
                      About Us
                    </span>
                    <h2 className="wow fadeInUp" data-wow-delay=".3s">
                      Your Safety, Our Responsibility
                    </h2>
                  </div>
                  <p className="mt-3 mt-md-0 wow fadeInUp" data-wow-delay=".5s">
                    At IBSM Global Security Solutions, we are dedicated to
                    providing top-notch security services tailored to meet the
                    unique needs of our clients. With a focus on
                    professionalism, reliability, and excellence, we strive to
                    ensure the safety and security of our clients' assets and
                    personnel.
                  </p>
                  <div className="icon-items wow fadeInUp" data-wow-delay=".3s">
                    <div className="dot" />
                    <div className="content">
                      <h4>Welcome to IBSM Global Security Solutions</h4>
                      <p>
                        Your trusted partner in safeguarding what matters most. With
                        tailored security solutions and a commitment to excellence, we deliver
                        peace of mind and unparalleled protection for your home, business, or
                        event. Welcome to a safer, more secure environment with IBSM.
                      </p>
                    </div>
                  </div>
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
      {/* About Section Start */}
      <section className="about-section fix section-padding pt-80">
        <div className="container">
          <div className="about-wrapper style-2">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6 wow  fadeInUp" data-wow-delay=".3s">
                <div className="about-image-3">
                  <img src="/assets/img/about/06.jpg" alt="img" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="about-content">
                  <h4 className="wow fadeInUp" data-wow-delay=".3s">
                    Our History
                  </h4>
                  <p className="mt-3 wow fadeInUp" data-wow-delay=".5s">
                    Founded on May 15, 2021, by Ajesh Kumar, IBSM Global
                    Security Solutions is headquartered in Ghaziabad, Uttar
                    Pradesh. Despite being a relatively young company, we
                    have quickly established ourselves as a trusted name in
                    the security industry. Our commitment to excellence,
                    coupled with our dedication to serving our clients with
                    integrity and professionalism, has been the cornerstone of
                    our success.
                  </p>
                  <div className="icon-items wow fadeInUp" data-wow-delay=".3s">
                    <div className="dot" />
                    <div className="content">
                      <h4>Our Excellence</h4>
                      <p>
                        At IBSM Global Security Solutions, excellence is not just a goal; it's our
                        standard. We provide integrated solutions to our clients by combining Security,
                        Housekeeping and Manpower services under one roof, thereby enabling our clients
                        to avoid multiple vendors and deal only with us for all such non-core tasks.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="about"
                    className="theme-btn mt-50 wow fadeInUp"
                    data-wow-delay=".5s"
                  >
                    Learn More About Us
                    <i className="far fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Team Section Start */}
      <Team />
      {/* Funfact Section Start */}
      <section className="funfact-section-2 section-padding pt-0">
        <div className="container">
          <FunFactCounter style={2} />
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
              <img src="/assets/img/bale.png" alt="img" />
              Clients Feedback
            </span>
            <h2>We’ve 1250+ Global Clients Say Us</h2>
          </div>
        </div>
        <TestimonialSlider2 />
      </section>
      {/* Footer Section Start */}
    </NextLayout>
  );
};
export default page;
