import Counter from "./Counter";
const FunFactCounter = ({ style }) => {
  return (
    <div className="row">
      <div
        className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
        data-wow-delay=".2s"
      >
        <div className={`funfact-box-items style-${style}`}>
          <h2>
            <span className="count">
              <Counter end={325} />
            </span>
            +
          </h2>
          <h6>Satisfied Clients</h6>
          <p>Trusted by a diverse range of clients across various sectors.</p>
        </div>
      </div>
      <div
        className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
        data-wow-delay=".4s"
      >
        <div className={`funfact-box-items active`}>
          <h2>
            <span className="count">
              <Counter end={96} />
            </span>
            %
          </h2>
          <h6>Retention Rate</h6>
          <p>Our commitment to excellence ensures long-term partnerships.</p>
        </div>
      </div>
      <div
        className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
        data-wow-delay=".6s"
      >
        <div className={`funfact-box-items style-${style}`}>
          <h2>
            <span className="count">
              <Counter end={2700} />
            </span>
            +
          </h2>
          <h6>Manpower</h6>
          <p>A massive workforce of trained professionals at your service.</p>
        </div>
      </div>
      <div
        className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp"
        data-wow-delay=".8s"
      >
        <div className={`funfact-box-items style-${style}`}>
          <h2>
            <span className="count">
              <Counter end={325} />
            </span>
            +
          </h2>
          <h6>Compliance</h6>
          <p>Adhering to the highest industry standards and regulations.</p>
        </div>
      </div>
    </div>
  );
};
export default FunFactCounter;
