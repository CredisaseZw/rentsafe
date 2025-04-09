export default function LandingPageFeature({ title, children, image, reversed }) {
  return (
    <>
      <div
        className={`row ${reversed ? "flex-row-reverse" : ""} align-items-center justify-content-around gap-3 mb-5`}
        style={{ minHeight: "30vh" }}
      >
        <div className="col col-4">
          <h2 className="fs-5 px-2">{title}</h2>
          <div className="c-feature-text p-3">
            <p className="m-0">{children}</p>
          </div>
        </div>

        <div className="col col-5">
          <div className="">
            <img
              src={image}
              alt={title}
              //   className="w-100 d-block p-2 c-bg-light"
              className="w-100 d-block p-2 "
              style={{
                aspectRatio: "16/9",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
