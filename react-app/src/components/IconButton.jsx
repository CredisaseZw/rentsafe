import React from "react";

const IconButton = ({ isLoading }) => {
  return (
    <button className="btn btn-raised-info text-white" type="submit" disabled={isLoading}>
      <i className="leading-icon material-icons">search</i>
      {isLoading ? (
        <>
          <span className="spinner-grow spinner-grow-sm"></span>
          <span className="ml-2">processing..</span>
        </>
      ) : (
        "Search"
      )}
    </button>
  );
};

export default IconButton;
