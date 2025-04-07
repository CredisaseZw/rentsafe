import React, { useEffect, useState } from "react";
import ContentModal from "./ContentModal.jsx";

export default function ClientSidebarNavItemModal({
  modalProps: {
    requestCloseFlag,
    centerTitle,
    size,
    title,
    navlinkTitle,
    children,
    titleOverideContent,
    devOnlyDefaultShow,
  },
  id,
  className,
  makeActive,
  beforeOpenningModal,
}) {
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (requestCloseFlag) {
      handleClose();
    }
  }, [requestCloseFlag]);

  const handleClose = () => {
    makeActive("use-last-last");
    setShowModal(false);
    setKey((prev) => prev + 1);
  };

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
        centerTitle={centerTitle}
        show={devOnlyDefaultShow || showModal}
        handleClose={handleClose}
        size={size}
        titleOverideContent={titleOverideContent}
      >
        {children}
      </ContentModal>
    </React.Fragment>
  );
}
