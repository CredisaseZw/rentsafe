export default function LandingPageFeature({ title, children, image, reversed }) {
  return (
    <>
      <div
        className={`row ${reversed ? "flex-row-reverse" : ""} landing-feature align-items-center justify-content-around mb-5 py-5 py-md-0`}
      >
        <div className="col col-12 col-md-5 order-3 order-md-1">
          <div className="py-3 md:px-3">
            <h2 className="fs-5 fw-bold text-center text-md-start">{title}</h2>
            <div className="bg-dark custom-rounded-1 p-3 text-light">{children}</div>
          </div>
        </div>

        <div className="d-none d-md-block col connector order-2 bg-dark" />

        <div className="col col-12 col-md-6  order-1 order-md-3">
          <img
            src={image}
            alt={title}
            className="w-100 d-block custom-rounded-2 border border-5 border-dark shadow-lg"
            style={{
              objectFit: "cover",
              aspectRatio: "16/9",
            }}
          />
        </div>
      </div>
    </>
  );
}
