import useSearchBar from '../hooks/component-hooks/useSearchBar';

export default function SearchBar({ searchBy, placeholder }) {
  const { defaultValue, handleSearch, clear, formRef } = useSearchBar(searchBy);

  return (
    <form onSubmit={handleSearch} ref={formRef}>
      <div className="input-group">
        <button
          type="button"
          className="btn border bg-white border-2 custom-z-0"
          onClick={clear}
        >
          <i className="material-icons small">close</i>
        </button>
        <input
          name={searchBy}
          defaultValue={defaultValue}
          placeholder={placeholder || `Search by ${searchBy}`}
          onBlur={() => formRef.current.requestSubmit()}
          className="form-control"
        />
        <button type="submit" className="btn btn-primary custom-z-0">
          Search
        </button>
      </div>
    </form>
  );
}
