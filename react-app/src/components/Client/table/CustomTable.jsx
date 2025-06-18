import { capitalizeAllWords } from "../../../utils";

export const STICKY_TABLE_HEADER_CLASS = "sticky-top c-table-top bg-white shadow-sm";

/**
 * DONT FORGET TO ADD `<colgroup>` TO TABLE
 * @param {React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode, tabletitle: string }} props
 */
export function Table({ children, className = "bg-white", ...props }) {
  return (
    <div {...props} className={className}>
      {props.tabletitle && (
        <div className="p-1 fw-semibold rounded-top-3 rounded-top border text-center bg-light">
          {capitalizeAllWords(props.tabletitle)}
        </div>
      )}

      <table className="table c-table table-sm table-responsive table-bordered">
        {children ? (
          children
        ) : (
          // Showcase of a table with a header, body, footer, and actions
          <>
            <colgroup>
              <col style={{ width: "1%" }} />
              <col style={{ width: "1%" }} />
              <col />
              <col style={{ width: "1%" }} />
              <col style={{ width: "1%" }} />
            </colgroup>

            <thead className={STICKY_TABLE_HEADER_CLASS}>
              <tr>
                <th />
                <th>header 1</th>
                <th>header 2</th>
                <th>header 3</th>
                <th>header 4</th>
              </tr>
            </thead>

            <tbody>
              {new Array(50).fill(0).map((_, index) => (
                <tr key={index}>
                  <td>
                    <RemoveRowButtonTemplate />
                  </td>
                  <td>data 1</td>
                  <td>data 2</td>
                  <td>data 3</td>
                  <td>
                    <ActionButtonsContainer>
                      <ActionButtonTemplate icon="close" variant="danger">
                        close
                      </ActionButtonTemplate>
                      <ActionButtonTemplate icon="save">save</ActionButtonTemplate>
                      <ActionButtonTemplate icon="refresh" variant="secondary">
                        reset
                      </ActionButtonTemplate>
                    </ActionButtonsContainer>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={4}>
                  <AddRowButtonTemplate label="add row" />
                </td>
              </tr>
            </tbody>

            <tfoot className="text-nowrap">
              <tr>
                <td>footer 1</td>
                <td>footer 2</td>
                <td>footer 3</td>
                <td>footer 4</td>
              </tr>
            </tfoot>
          </>
        )}
      </table>
    </div>
  );
}

/**
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement> & {label?: string}} props
 */
export function AddRowButtonTemplate({ label = "Add", ...props }) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      className="btn btn-sm btn-light border border-dark text-capitalize rounded-pill py-1 px-2"
    >
      {label}
      <i className="material-icons trailing-icon">add</i>
    </button>
  );
}

/**
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement> & {icon?: string}} props
 */
export function RemoveRowButtonTemplate(props) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      className="btn btn-sm btn-light border border-dark btn-icon"
    >
      <i className="material-icons">{props.icon || "close"}</i>
    </button>
  );
}

/**
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement> & {
 *   children: React.ReactNode;
 *   icon?: string;
 *   variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info";
 * }} props
 */
export function ActionButtonTemplate(props) {
  const { children, icon, variant = "info" } = props;

  return (
    <button
      {...props}
      type={props.type || "button"}
      className={`btn btn-${variant} text-white btn-sm text-capitalize rounded-pill text-nowrap py-1 px-2`}
    >
      {children}
      {icon ? <i className="material-icons trailing-icon">{icon}</i> : ""}
    </button>
  );
}

/**
 * default className is "d-flex align-items-center gap-2"
 * @param {React.HTMLAttributes<HTMLDivElement> & { children: React.ReactNode }} props
 */
export function ActionButtonsContainer({
  className = "d-flex align-items-center gap-2",
  ...props
}) {
  return (
    <div className={className} {...props}>
      {props.children}
    </div>
  );
}
