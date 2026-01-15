import Link from "next/link";

const Team = () => {
  return (
    <section className="team-section fix footer-bg section-padding" id="team">
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-content wow fadeInUp">
            Team Member
          </span>
          <h2 className="text-white wow fadeInUp" data-wow-delay=".3s">
            Meet Our Professional Team Members
          </h2>
        </div>
        <div className="row">
          <div
            className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
            data-wow-delay=".2s"
          >
            <div className="team-card-items">
              <div className="team-image">
                <img src="assets/img/team/06.jpg" alt="team-img" />
                <div className="icon-list">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-pinterest-p" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h4>
                  <Link href="team-details">Ajesh Kumar</Link>
                </h4>
                <p>CEO &amp; Founder</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
            data-wow-delay=".4s"
          >
            <div className="team-card-items">
              <div className="team-image">
                <img src="assets/img/team/07.jpg" alt="team-img" />
                <div className="icon-list">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-pinterest-p" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h4>
                  <Link href="team-details">Sanjay Singh</Link>
                </h4>
                <p>Operations Head</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
            data-wow-delay=".6s"
          >
            <div className="team-card-items">
              <div className="team-image">
                <img src="assets/img/team/08.jpg" alt="team-img" />
                <div className="icon-list">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-pinterest-p" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h4>
                  <Link href="team-details">Vikram Rathore</Link>
                </h4>
                <p>Senior Manager</p>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
            data-wow-delay=".8s"
          >
            <div className="team-card-items">
              <div className="team-image">
                <img src="assets/img/team/09.jpg" alt="team-img" />
                <div className="icon-list">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="fab fa-facebook-f" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin-in" />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-pinterest-p" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="team-content">
                <h4>
                  <Link href="team-details">Rajesh Sharma</Link>
                </h4>
                <p>Security Consultant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Team;
