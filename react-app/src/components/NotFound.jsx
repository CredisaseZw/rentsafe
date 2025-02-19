export function NotFound({
  handleShow,
  handleCloseModal,
  userType,
  searchValue,
}) {
  return (
    <div className="border border-3 border-info c-w-fit p-4 custom-rounded-1">
      <p className="m-0 custom-w-3 text-center">
        No search results found for <b>{searchValue}</b>. Please add this{' '}
        {userType} details by pressing
        <br />
        <button
          type="button"
          className="btn btn-info mt-3 text-white"
          onClick={() => {
            handleShow();
            handleCloseModal();
          }}
        >
          Ok
        </button>
      </p>
    </div>
  );
}
