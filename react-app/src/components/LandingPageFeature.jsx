export default function LandingPageFeature({ title, children, image, reversed }) {
  return (
    <>
      <div
        className={`row ${reversed ? "flex-row-reverse" : ""} align-items-center justify-content-around mb-5`}
        style={{ minHeight: "80vh" }}
      >
        <div className="col col-12 col-md-4 order-3 order-md-1">
          <div className="">
            <h2 className="fs-4 fw-bold">{title}</h2>
            <div className="bg-dark custom-rounded-1 p-3 text-light">{children}</div>
          </div>
        </div>

        <div className="col connector order-2 bg-dark" />

        <div className="col col-12 col-md-7  order-1 order-md-3">
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
