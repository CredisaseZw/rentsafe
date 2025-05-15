import axios from "axios";
import React from "react";
import toast from "react-hot-toast";

export default function useGeneralJournal() {
  const entryTemplate = {
    firstLine: {
      period: "",
      ref: "GJ-00",
      account: "",
      description: "",
      dr: 0,
      cr: 0,
      directContra: "yes",
    },
    additionalLines: [
      {
        period: "",
        ref: "GJ-00",
        account: "",
        description: "",
        dr: 0,
        cr: 0,
      },
    ],
  };

  const [entries, setEntries] = React.useState([{ ...entryTemplate }, { ...entryTemplate }]);
  const [generalLedgerAccounts, setGeneralLedgerAccounts] = React.useState([]);

  function fetchSalesAccounts() {
    axios
      .get("/accounting/sales-accounts/")
      .then((res) => {
        setGeneralLedgerAccounts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  React.useEffect(() => {
    fetchSalesAccounts();
  }, []);

  function postData() {
    // toast error if additional line cr/dr dont equal first line dr/cr respectively
    const isValid = entries.every((entry) => {
      if (entry.firstLine.directContra === "yes") {
        return true;
      }
      const firstLine = entry.firstLine;
      const additionalLines = entry.additionalLines;

      const totalDr = additionalLines.reduce((acc, line) => acc + parseFloat(line.dr), 0);
      const totalCr = additionalLines.reduce((acc, line) => acc + parseFloat(line.cr), 0);

      return (
        (firstLine.dr > 0 || firstLine.dr < 0 ? totalDr === parseFloat(firstLine.dr) : true) &&
        (firstLine.cr > 0 || firstLine.cr < 0 ? totalCr === parseFloat(firstLine.cr) : true)
      );
    });

    if (!isValid) {
      toast.error("Second entry dr/cr columns do not balance with first entry dr/cr columns");
      return;
    } else {
      console.log("posting!", entries);
    }
  }

  function toggleDirectContra(index) {
    setEntries((prev) => {
      const newEntries = [...prev];
      newEntries[index] = {
        ...newEntries[index],
        firstLine: {
          ...newEntries[index].firstLine,
          directContra: newEntries[index].firstLine.directContra === "yes" ? "no" : "yes",
        },
        additionalLines: [
          {
            period:
              newEntries[index].firstLine.directContra === "yes"
                ? ""
                : newEntries[index].firstLine.period,
            ref: "GJ-00",
            account: "",
            description: newEntries[index].firstLine.description,

            dr:
              newEntries[index].firstLine.cr > 0 || newEntries[index].firstLine.cr < 0
                ? newEntries[index].firstLine.cr
                : 0,
            cr:
              newEntries[index].firstLine.dr > 0 || newEntries[index].firstLine.dr < 0
                ? newEntries[index].firstLine.dr
                : 0,
          },
        ],
      };
      return newEntries;
    });
  }

  function handleFirstLineChange(e, entryIndex) {
    setEntries((prevRows) => {
      const newRows = [...prevRows];
      const { name, value } = e.target;
      newRows[entryIndex].firstLine[name] = value;
      newRows[entryIndex].additionalLines.forEach((line) => {
        if (newRows[entryIndex].firstLine.directContra === "yes") {
          line.period = newRows[entryIndex].firstLine.period;
          line.ref = newRows[entryIndex].firstLine.ref;
        }
        line.description = newRows[entryIndex].firstLine.description;
        if (newRows[entryIndex].firstLine.dr > 0 || newRows[entryIndex].firstLine.dr < 0) {
          line.cr = newRows[entryIndex].firstLine.dr;
          line.dr = 0;
        } else {
          line.dr = newRows[entryIndex].firstLine.cr;
          line.cr = 0;
        }
      });
      return newRows;
    });
  }

  function handleAdditionalLineChange(e, entryIndex, lineIndex) {
    setEntries((prevRows) => {
      const newRows = [...prevRows];
      const { name, value } = e.target;
      newRows[entryIndex].additionalLines[lineIndex][name] = value;
      return newRows;
    });
  }

  function removeEntry(index) {
    setEntries((prevRows) => prevRows.filter((_, i) => i !== index));
  }

  function addEntry() {
    setEntries((prev) => [...prev, { ...entryTemplate }]);
  }

  function addAdditionalLine(entryIndex) {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[entryIndex].additionalLines.push({
        period: "",
        ref: "GJ-00",
        account: "",
        description: newEntries[entryIndex].firstLine.description,
        dr: 0,
        cr: 0,
      });
      return newEntries;
    });
  }

  function removeAdditionalLine(entryIndex, lineIndex) {
    setEntries((prevEntries) => {
      const newEntries = [...prevEntries];
      newEntries[entryIndex].additionalLines = newEntries[entryIndex].additionalLines.filter(
        (_, i) => i !== lineIndex
      );
      return newEntries;
    });
  }

  return {
    entries,
    generalLedgerAccounts,
    addEntry,
    postData,
    setEntries,
    removeEntry,
    addAdditionalLine,
    toggleDirectContra,
    removeAdditionalLine,
    handleFirstLineChange,
    handleAdditionalLineChange,
  };
}
