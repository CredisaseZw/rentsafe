import React, { useState } from "react";
import ContentModal from "./ContentModal.jsx";

export default function ClientSidebarNavItemModal({
  modalProps: { size, title, navlinkTitle, children, titleOverideContent },
  id,
  className,
  makeActive,
  beforeOpenningModal,
}) {
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState(0);

  return (
    <React.Fragment key={key}>
      <a
        className={className}
        onClick={() => {
          beforeOpenningModal();
          makeActive(id);
          setShowModal(true);
        }}
      >
        {navlinkTitle || title}
      </a>

      <ContentModal
        title={title}
        show={showModal}
        handleClose={() => {
          makeActive("use-last-last");
          setShowModal(false);
          setKey((prev) => prev + 1);
        }}
        size={size}
        titleOverideContent={titleOverideContent}
      >
        {children}
      </ContentModal>
    </React.Fragment>
  );
}
