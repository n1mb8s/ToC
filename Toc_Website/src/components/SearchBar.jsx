import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-between px-5 py-2 rounded-full border border-[#BFBFBF] w-full max-w-md"
    >
      {/* input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search"
        className="flex-1 bg-transparent text-[#BFBFBF] placeholder-[#BFBFBF] text-base font-medium font-['IBM Plex Sans Thai'] focus:outline-none"
      />

      {/* search icon */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={handleSubmit}>
        <img
            src="/src/assets/search.svg"
            className="w-6 h-6"
        />
      </div>
    </form>
  );
};

export default SearchBar;
