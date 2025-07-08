import { SearchBarStyles } from "../constants";
import useSearchBar from "../hooks/component-hooks/useSearchBar";

export default function SearchBar({ searchBy, placeholder }) {
  const { defaultValue, handleSearch, clear, formRef } = useSearchBar(searchBy);

  return (
    <form onSubmit={handleSearch} ref={formRef}>
      <div className={SearchBarStyles.containerClassname}>
        <button type="button" className={SearchBarStyles.leftButtonClassname} onClick={clear}>
          <i className="material-icons">close</i>
        </button>
        <input
          name={searchBy}
          defaultValue={defaultValue}
          placeholder={placeholder || `Search by ${searchBy}`}
          className={SearchBarStyles.inputClassname}
        />
        <button type="submit" className={SearchBarStyles.rightButtonClassname}>
          <i className="material-icons">search</i>
        </button>
      </div>
    </form>
  );
}
