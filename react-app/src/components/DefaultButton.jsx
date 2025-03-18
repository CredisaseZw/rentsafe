import React from "react";

const DefaultButton = ({ type, title }) => {
  return (
    <button className="btn btn-raised-info text-white" type={type}>
      {title}
    </button>
  );
};

export default DefaultButton;
