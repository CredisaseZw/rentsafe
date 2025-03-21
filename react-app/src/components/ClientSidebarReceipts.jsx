import Receipt from "./features/leases/Receipt.jsx";
import React, { useState } from "react";

export default function ClientSidebarReceipts({ className, id, makeActive, beforeOpenningModal }) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <React.Fragment key={key}>
      <a
        className={className}
        onClick={() => {
          beforeOpenningModal();
          makeActive(id);
          setShowReceipt(true);
        }}
      >
        Receipts
      </a>

      <Receipt
        show={showReceipt}
        handleClose={async (message) => {
          makeActive("use-last-last");
          console.log(message);
          setShowReceipt(false);
          setKey((prev) => prev + 1);
        }}
        myKey=""
      />
    </React.Fragment>
  );
}
