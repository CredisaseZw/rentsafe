import BlankLayout from "../components/Layouts/BlankLayout.jsx";
import LandingPageHeader from "../components/LandingPageHeader.jsx";
import LandingPageFeature from "../components/LandingPageFeature.jsx";

export default function Index() {
  return (
    <div className="c-bg-whitesmoke">
      <div id="hero-section" className="d-flex flex-column text-light">
        <div>
          <LandingPageHeader />
        </div>

        <div style={{ paddingBottom: "5%" }} className="hero-raise my-auto px-3 text-center">
          <h1 className=" fs-1 fw-bold text-light">
            Growing the <span className="text-info border-text">African</span> credit & financial{" "}
            <br className="d-none d-md-inline" />{" "}
            <span className="text-info border-text"> ecosystem</span>.
          </h1>
          <p className="custom-mx-w-5 mx-auto">
            CrediSafe provides fintech solutions tailored <br /> to the African market.
          </p>
        </div>

        <div className="hero-raise text-center d-flex flex-column align-self-center justify-content-center ">
          <i className="material-icons text-info fw-bolder">keyboard_arrow_down</i>
          <i className="material-icons fs-1">keyboard_double_arrow_down</i>
        </div>
      </div>

      <div
        style={{ minHeight: "30vh" }}
        className="d-flex border-dark border-bottom border-top border-5 justify-content-center text-center align-items-center flex-column gap-3 mission-statement px-3 py-4"
      >
        <h2 className="text-light fw-bold">Our Mission</h2>

        <p className="custom-mx-w-6 text-light">
          Our mission is to empower individuals and businesses across Africa by enhancing access to
          credit and financial services. We aim to create a more inclusive financial system that
          supports growth and development for all.
        </p>
      </div>

      <div className="container">
        <div id="credit-scoring">
          <LandingPageFeature
            title="Credit & Capacity Scoring"
            image="https://github.com/credisafe/media-files/blob/main/risk-review-plan.png?raw=true"
          >
            With the informal sector being over 80% in some parts of Africa, how do you bridge the
            divide so that everyone is financially included? CrediSafe has innovated to be able to
            credit score both the formal and informal sector so that all can be included. We are
            also innovating in providing Capacity Score to gauge what kind of credit capacity an
            informal player can handle.
          </LandingPageFeature>
        </div>

        <div id="rentsafe">
          <LandingPageFeature
            title="RentSafe - Property & Rental Management"
            image="https://github.com/credisafe/media-files/blob/main/property.png?raw=true"
            reversed
          >
            Made for unique African markets, RentSafe is the ultimate property and rental management
            tool that can service not only commercial property players, but also via mobile for
            individual landlords.
          </LandingPageFeature>
        </div>

        <div id="countsafe">
          <LandingPageFeature
            title="CountSafe"
            image="https://github.com/credisafe/media-files/blob/main/analysis.png?raw=true"
          >
            An accounting system made for the African environment. Businesses can run multicurrency
            accounts, manage cashflows and make automated account collections.
          </LandingPageFeature>
        </div>

        <div id="debt-collection">
          <LandingPageFeature
            title="DebtSafe - Debt Collection"
            image="https://github.com/credisafe/media-files/blob/main/debt.png?raw=true"
            reversed
          >
            Experience higher recovery rates and reduced operational costs with DebtSafe. Our
            recovery system exponentially improves efficiency all with less effort through our
            automated system.
          </LandingPageFeature>
        </div>
      </div>

      <div className="container">
        <div
          id="contact"
          style={{ minHeight: "70vh" }}
          className="d-flex justify-content-center align-items-center px-3"
        >
          <div className="w-100">
            <h2 className="fs-4 text-center fw-bold mb-5">
              Secure Your Money & Investments With Us
            </h2>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="row justify-content-center gap-5 align-items-start pt-5"
            >
              <div className="col col-12 col-md-4">
                <div>
                  <p className="fw-bold">Call or WhatsApp</p>

                  <div className="d-flex align-items-center gap-3">
                    <i className="material-icons border border-3 border-info text-info rounded-circle p-1 fs-5">
                      phone
                    </i>
                    <p className="m-0">+263-772219151</p>
                  </div>
                </div>
              </div>

              <div className="col col-12 col-md-4">
                <div>
                  <p className="fw-bold">Email us</p>

                  <div className="d-flex gap-3 mb-3">
                    <input
                      type="text"
                      className="form-control flex-fill bg-white border-light shadow-sm  rounded-pill"
                      id="name"
                      placeholder="Name"
                      required
                    />

                    <input
                      type="email"
                      className="form-control flex-fill bg-white border-light shadow-sm  rounded-pill"
                      id="email"
                      placeholder="Email"
                      required
                    />
                  </div>

                  <input
                    className="form-control bg-white border-light shadow-sm  rounded-pill mb-3"
                    id="subject"
                    placeholder="Subject"
                    required
                  />

                  <textarea
                    className="form-control bg-white border-light shadow-sm  custom-rounded-1 py-4 mb-3"
                    id="message"
                    rows="3"
                    required
                    placeholder="Message..."
                  ></textarea>

                  <button
                    type="button"
                    className="btn fw-bold w-100 mt-4 justify-content-center rounded-pill  text-capitalize btn-info border text-white"
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <footer className="bg-black text-light border-top border-5 mt-5 py-4">
        <div className="container">
          <div className="row row-cols-1  row-cols-md-3 g-4 mb-4">
            <div className="col order-last order-md-0">
              <div>
                <h6 className="text-light border-bottom pb-1 fst-italic c-w-fit border-3 border-info mb-3">
                  Address
                </h6>

                <div>
                  <p className="m-0">8th Floor</p>
                  <p className="m-0">Club Chambers</p>
                  <p className="m-0">Cnr 3rd Str / Nelson Mandela Avenue </p>
                  <p className="m-0">Harare</p>
                  <p className="m-0">Zimbabwe</p>
                </div>

                {/* <div className="mt-3">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.2212917829142!2d31.05049427499587!3d-17.828258283136076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a5e92b293c33%3A0x2e72f90a43b23a12!2sClumb%20Chambers!5e0!3m2!1sen!2szw!4v1744196761560!5m2!1sen!2szw"
                    width="200"
                    height="100"
                    className="border border-2 border-info w-100 custom-rounded-1"
                    style={{ aspectRatio: "16/9" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div> */}
              </div>
            </div>

            <div className="col">
              <div className="text-md-center">
                <h6 className="text-light border-bottom pb-1 fst-italic mx-md-auto c-w-fit border-3 border-info mb-3">
                  Mobile
                </h6>

                <div>
                  <p className="m-0">+263-772219151</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="text-md-end">
                <h6 className="text-light border-bottom pb-1 fst-italic ms-md-auto c-w-fit border-3 border-info mb-3">
                  Email
                </h6>

                <div>
                  <p className="m-0">info@credi-safe.com</p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ color: "rgb(170,170,170)" }}
            className="d-flex justify-content-between gap-3 align-items-center my-3"
          >
            <p className="m-0 small fst-italic ">© {new Date().getFullYear()} CrediSafe</p>

            <div className="small fst-italic ">All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

Index.layout = (page) => <BlankLayout children={page} title="Home" />;
