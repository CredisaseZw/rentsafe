import BlankLayout from "../components/Layouts/BlankLayout.jsx";
import LandingPageHeader from "../components/LandingPageHeader.jsx";
import LandingPageFeature from "../components/LandingPageFeature.jsx";

export default function Index() {
  return (
    <div className="c-bg-whitesmoke">
      <LandingPageHeader />

      <div className="container">
        <>
          <div className="mb-3 px-3 d-flex align-items-center" style={{ minHeight: "20vh" }}>
            <h1 className="fs-2 w-100 text-center">
              Growing the <span className="text-info">African</span> credit & financial <br />{" "}
              <span className="text-info"> ecosystem</span>.
            </h1>
          </div>

          <div>
            <LandingPageFeature title="Credit Scoring" image="">
              We credit score the formal and informal sectors making sure everyone is financially
              included and bridging the devide.
            </LandingPageFeature>
          </div>

          <div>
            <LandingPageFeature
              title={
                <span className="text-nowrap">
                  RentSafe{" "}
                  <i className=" c-fs-07 mx-1 d-inline-block material-icons">arrow_forward</i>{" "}
                  Property & Rent <br /> Management
                </span>
              }
              image="/images/landing-page/credit-scoring.png"
              reversed
            >
              Through RentSafe, you can manage your property investment as a corporate or as an
              individual
            </LandingPageFeature>
          </div>

          <div>
            <LandingPageFeature
              title={
                <span className="text-nowrap">
                  CountSafe{" "}
                  <i className=" c-fs-07 mx-1 d-inline-block material-icons">arrow_forward</i>{" "}
                  Accounting
                </span>
              }
              image="/images/landing-page/credit-scoring.png"
            >
              An aacounting app made for the African environment. Perfom multicurrency commission,
              cashflow management, and forecasts.
            </LandingPageFeature>
          </div>

          <div>
            <LandingPageFeature
              title="Debt Collection"
              image="/images/landing-page/credit-scoring.png"
              reversed
            >
              Be able to follow up your funds automatically at scale and a fraction of the cost.
            </LandingPageFeature>
          </div>
        </>

        <div>
          <h2 className="fs-4 text-center mb-4">Secure Your Money & Investment With Us.</h2>

          <h3 className="fs-5 c-bg-light p-2 mb-4 rounded-3 text-center">Contact</h3>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="row justify-content-around align-items-start gap-2"
          >
            <div className="col col-4">
              <fieldset className="p-4 custom-rounded-1">
                <legend>Call or WhatsApp</legend>
                <div className="d-flex align-items-center gap-3">
                  <i className="material-icons fs-5">phone</i>
                  <p className="m-0">+263-772219151</p>
                </div>
              </fieldset>
            </div>

            <div className="col col-5">
              <fieldset className="p-4 custom-rounded-1">
                <legend>Email us</legend>

                <div className="d-flex gap-3 mb-3">
                  <div className="flex-fill">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="flex-fill">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Your email"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    className="form-control"
                    id="subject"
                    placeholder="Subjejct of your message"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    rows="3"
                    required
                    placeholder="Your message"
                  ></textarea>
                </div>

                <div className="text-end pt-3 px-3">
                  <button type="submit" className="btn text-capitalize btn-info text-white">
                    Send
                  </button>
                </div>
              </fieldset>
            </div>
          </form>
        </div>
      </div>

      <footer className="bg-white border-top border-5 mt-5 py-5">
        <div className="container">
          <div className="row row-cols-3 mb-4">
            <div className="col">
              <div className="">
                <h6 className="text-decoration-underline mb-3">Address</h6>

                <div>
                  <p className="m-0">8th Floor</p>
                  <p className="m-0">Club Chambers</p>
                  <p className="m-0">Cnr 3rd Str / Nelson Mandela Avenue </p>
                  <p className="m-0">Harare</p>
                  <p className="m-0">Zimbabwe</p>
                </div>

                <div className="mt-3">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.2212917829142!2d31.05049427499587!3d-17.828258283136076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a5e92b293c33%3A0x2e72f90a43b23a12!2sClumb%20Chambers!5e0!3m2!1sen!2szw!4v1744196761560!5m2!1sen!2szw"
                    width="200"
                    height="100"
                    className="border border-3 w-100"
                    style={{ aspectRatio: "16/9" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="">
                <h6 className="text-decoration-underline mb-3">Mobile</h6>

                <div>
                  <p className="m-0">+263-772219151</p>
                </div>
              </div>
            </div>

            <div className="col">
              <div className="">
                <h6 className="text-decoration-underline mb-3">Email</h6>

                <div>
                  <p className="m-0">info@credi-safe.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between gap-3 align-items-center">
            <p className="m-0 text-muted">© {new Date().getFullYear()} CrediSafe</p>

            <div className="text-decoration-none text-muted">All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

Index.layout = (page) => <BlankLayout children={page} title="Home" />;
