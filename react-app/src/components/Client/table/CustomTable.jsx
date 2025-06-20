import { capitalizeAllWords } from "../../../utils";

export const STICKY_TABLE_HEADER_CLASS = "sticky-top c-table-top bg-white shadow-sm";

/**
 * DONT FORGET TO USE `ColGroup`
 * @param {React.HTMLAttributes<HTMLDivElement> & {
 * children: React.ReactNode,
 * tabletitle: string,
 * size?: "lg"
 * tabletitleBg?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light"
 * tabletitleColor?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "white" | ""
 * }} props
 */
export function Table({
  size,
  children,
  className = "bg-white",
  tabletitleBg = "light",
  tabletitleColor = "",
  ...props
}) {
  return (
    <div {...props} className={className}>
      {props.tabletitle && (
        <div
          className={`p-1 fw-semibold rounded-top-3 rounded-top border text-center bg-${tabletitleBg} text-${tabletitleColor}`}
        >
          {capitalizeAllWords(props.tabletitle)}
        </div>
      )}

      <table
        className={`table c-table table-sm table-responsive table-bordered ${size ? "c-table-" + size : ""}`}
      >
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
      className="btn btn-sm btn-light border border-dark text-capitalize py-1 px-2"
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
 *   size?: "lg";
 *   variant?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark";
 * }} props
 */
export function ActionButtonTemplate(props) {
  const { children, icon, variant = "info" } = props;

  return (
    <button
      {...props}
      type={props.type || "button"}
      className={
        `btn btn-${variant} text-white btn-sm text-capitalize text-nowrap ${props.size == "lg" ? "c-fs-09" : ""} py-1 px-2` +
        (props.className || "")
      }
    >
      {children}
      {icon ? <i className={`material-icons ${children ? "trailing-icon" : ""}`}>{icon}</i> : ""}
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

/**
 * @param {{ colSpan: number }} props
 */
export function NothingToShow({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="text-center text-muted p-4">
          <p className="m-0">Nothing to show</p>
        </div>
      </td>
    </tr>
  );
}

/**
 * @param {{ colSpan: number }} props
 */
export function LoadingIndicator({ colSpan }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="p-4 text-center">
          <div className="spinner-border spinner-border-sm text-muted" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </td>
    </tr>
  );
}

/**
 * @param {{ ratios?: (1 | null)[] }} props
 */
export function ColGroup({ ratios = [] }) {
  return (
    <colgroup>
      {ratios.map((ratio, index) => (
        <col key={index} style={ratio ? { width: "1%" } : undefined} />
      ))}
    </colgroup>
  );
}

export function DevOnlyTallRow() {
  return (
    <tr>
      <td>
        <div className="h100" />
      </td>
    </tr>
  );
}

export default {
  Table,
  ColGroup,
  NothingToShow,
  DevOnlyTallRow,
  LoadingIndicator,
  ActionButtonTemplate,
  AddRowButtonTemplate,
  ActionButtonsContainer,
  RemoveRowButtonTemplate,
  STICKY_TABLE_HEADER_CLASS,
};
