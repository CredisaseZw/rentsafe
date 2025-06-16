import useSearchBar from "../hooks/component-hooks/useSearchBar";

export default function SearchBar({ searchBy, placeholder }) {
  const { defaultValue, handleSearch, clear, formRef } = useSearchBar(searchBy);

  return (
    <form onSubmit={handleSearch} ref={formRef}>
      <div className="input-group">
        <button
          type="button"
          className="btn btn-light border border-2 custom-z-0 c-rounded-s-pill"
          onClick={clear}
        >
          <i className="material-icons small">close</i>
        </button>
        <input
          name={searchBy}
          defaultValue={defaultValue}
          placeholder={placeholder || `Search by ${searchBy}`}
          className="form-control py-1 custom-mx-w-3 border border-2"
        />
        <button type="submit" className="btn btn-sm btn-primary custom-z-0 c-rounded-e-pill">
          <i className="material-icons">search</i>
        </button>
      </div>
    </form>
  );
}
