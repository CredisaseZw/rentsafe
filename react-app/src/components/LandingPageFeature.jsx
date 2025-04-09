export default function LandingPageFeature({ title, children, image, reversed }) {
  return (
    <>
      <div
        className={`row ${reversed ? "flex-row-reverse" : ""} align-items-center justify-content-around gap-3 mb-5`}
        style={{ minHeight: "50vh" }}
      >
        <div className="col col-12 col-md-4 order-2 order-md-1">
          <h2 className="fs-5 px-2">{title}</h2>
          <div className="c-feature-text p-3">
            <p className="m-0">{children}</p>
          </div>
        </div>

        <div className="col col-12 col-md-5  order-1 order-md-2">
          <div className="">
            <img
              src={image}
              alt={title}
              className="w-100 d-block custom-rounded-1"
              style={{
                objectFit: "cover",
                aspectRatio: "16/9",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
