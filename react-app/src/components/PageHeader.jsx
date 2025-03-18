import React from "react";

const PageHeader = ({ title }) => {
  return (
    <header className="bg-info">
      <div className="container-xl px-5">
        <h1 className="text-white py-3 mb-0 display-6">{title}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
