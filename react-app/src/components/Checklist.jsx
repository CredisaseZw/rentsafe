import React from "react";

export default function Checklist({ category }) {
  return (
    <div
      style={{
        gridColumn: category.subCategories ? "span 2" : "span 1",
        gridRow: "auto",
      }}
      className="p-3"
    >
      <div className="border shadow-sm">
        <table className="table bg-white mb-0 table-sm table-responsive table-bordered">
          <thead className="text-center text-info text-capitalize">
            {category.subCategories ? (
              <>
                <tr>
                  <th className="c-bg-light text-body text-start">{category.category}</th>
                  {category.subCategories.map((sub) => (
                    <th colSpan={3} key={sub}>
                      {sub}
                    </th>
                  ))}
                </tr>

                <tr>
                  <th></th>
                  {category.subCategories.map((sub) => (
                    <React.Fragment key={sub}>
                      <th style={{ width: "3.5rem" }}>Good</th>
                      <th style={{ width: "3.5rem" }}>Ok</th>
                      <th style={{ width: "3.5rem" }}>Bad</th>
                    </React.Fragment>
                  ))}
                </tr>
              </>
            ) : (
              <tr>
                <th className="c-bg-light text-body text-start">{category.category}</th>
                <th style={{ width: "3.5rem" }}>Good</th>
                <th style={{ width: "3.5rem" }}>Ok</th>
                <th style={{ width: "3.5rem" }}>Bad</th>
              </tr>
            )}
          </thead>

          <tbody className="text-capitalize">
            {category.items.map((item) => (
              <tr key={item}>
                <td>{item}</td>
                {category.subCategories ? (
                  category.subCategories.map((sub) => (
                    <React.Fragment key={sub}>
                      <td>
                        <div className="form-check d-flex align-items-center justify-content-center">
                          <input
                            className="form-check-input p-2"
                            type="radio"
                            value="good"
                            name={`${category.category}-${item}-${sub}`}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="form-check d-flex align-items-center justify-content-center">
                          <input
                            className="form-check-input p-2"
                            type="radio"
                            value="ok"
                            name={`${category.category}-${item}-${sub}`}
                          />
                        </div>
                      </td>

                      <td>
                        <div className="form-check d-flex align-items-center justify-content-center">
                          <input
                            className="form-check-input p-2"
                            type="radio"
                            value="bad"
                            name={`${category.category}-${item}-${sub}`}
                          />
                        </div>
                      </td>
                    </React.Fragment>
                  ))
                ) : (
                  <>
                    <td>
                      <div className="form-check d-flex align-items-center justify-content-center">
                        <input
                          className="form-check-input p-2"
                          type="radio"
                          value="good"
                          name={`${category.category}-${item}`}
                        />
                      </div>
                    </td>

                    <td>
                      <div className="form-check d-flex align-items-center justify-content-center">
                        <input
                          className="form-check-input p-2"
                          type="radio"
                          value="ok"
                          name={`${category.category}-${item}`}
                        />
                      </div>
                    </td>

                    <td>
                      <div className="form-check d-flex align-items-center justify-content-center">
                        <input
                          className="form-check-input p-2"
                          type="radio"
                          value="bad"
                          name={`${category.category}-${item}`}
                        />
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="c-bg-light p-2 rounded-bottom rounded-bottom-5">{category.description}</div>

        <div>
          <textarea
            className="form-control border-0 rounded rounded-5"
            name={category.category + "_notes"}
            id={category.category + "_notes"}
            placeholder="Notes..."
            rows={3}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
