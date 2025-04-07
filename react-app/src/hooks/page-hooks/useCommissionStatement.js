import { usePage } from "@inertiajs/inertia-react";
import { capitalize } from "lodash";
import { friendlyDate } from "../../utils";
import html2pdf from "html2pdf.js";
import { useRef } from "react";

export default function useCommissionStatement(statement) {
  const contentRef = useRef();

  const handlePrintToPdf = () => {
    const element = contentRef.current;
    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: "modal-content.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save();
  };

  console.log({ statement });
  const { url } = usePage();
  const searchParams = new URL(url).searchParams;

  const type = searchParams.get("commission_type", undefined);
  const period_selection = searchParams.get("period_selection", undefined);
  const year = searchParams.get("year", undefined);
  const month = searchParams.get("month", undefined);
  const start_date = searchParams.get("start_date", undefined);
  const end_date = searchParams.get("end_date", undefined);

  let date = "";

  if (period_selection === "month") date = `${capitalize(mapNumberToMonth(month))} ${year}`;
  else date = `${friendlyDate(start_date)} to ${friendlyDate(end_date)}`;

  return { type: capitalize(type), date, contentRef, handlePrintToPdf };
}

function mapNumberToMonth(number) {
  number = Number(number);
  switch (number) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
}
