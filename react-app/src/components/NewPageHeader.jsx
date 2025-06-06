/**
 * Renders the new default page header with a custom title and BS5 background color.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.title - The text to display as the header.
 * @param {'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'} [props.color="info"]
 *   The Bootstrap background color class suffix.
 * @param {string} [props.className] - Additional class names to apply.
 * @param {boolean} [props.noMargin] - If true, removes the bottom margin.
 * @returns {JSX.Element} The rendered header element.
 */
export default function NewPageHeader({ title, color = "info", className = "", noMargin = false }) {
  return (
    <h6
      className={`text-capitalize ${noMargin ? "" : "mb-4"} text-center bg-${color} text-white p-2 rounded-3 ${className}`}
    >
      {title}
    </h6>
  );
}
