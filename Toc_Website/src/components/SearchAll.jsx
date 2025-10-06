import { useState } from "react";
import { useNavigate } from "react-router-dom";

// A self-contained search component that calls /api/search?query=<q>
// Props:
// - onResults?: (items) => void  // optional callback with raw results from API
// - showResultsInline?: boolean  // default true. When false, component won't render results grid (parent can render below nav)
const SearchAll = ({ onResults, showResultsInline = true }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = (query || "").trim();
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/search?query=${encodeURIComponent(q)}`
      );
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const data = await resp.json();
      const items = data?.results ?? [];
      setResults(items);
      onResults?.(items);
    } catch (err) {
      setError(err?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    if (item?.type === "brand") {
      const brandName = (item.name || "").replace(/\s+/g, "-");
      navigate(`/brands/${brandName}`);
    } else if (item?.type === "model") {
      const brandSlug = (item.brand_name || "").replace(/\s+/g, "-");
      const modelSlug = (item.name || "").replace(/\s+/g, "-");
      navigate(`/brands/${brandSlug}/${modelSlug}`);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-between self-center px-5 py-2 rounded-full border border-[#BFBFBF] w-full max-w-md"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 bg-transparent text-[#BFBFBF] placeholder-[#BFBFBF] text-base font-medium font-['IBM Plex Sans Thai'] focus:outline-none"
        />
        {loading ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />) : 
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleSubmit}>
          <img src="@/../public/search.svg" className="w-6 h-6" />
        </div>
        }
      </form>

      {/* Status & Results */}
      {/* {loading && (
        <div className="flex items-center gap-2 text-white mt-4">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Searching...
        </div>
      )} */}
      {error && (
        <div className="text-red-400 mt-3">{error}</div>
      )}
      {showResultsInline && !loading && !error && results.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-scroll">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-lg bg-white cursor-pointer hover:shadow"
              onClick={() => handleItemClick(item)}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-sm text-gray-500">{item.type}</div>
                <div className="text-base font-semibold text-gray-900 truncate">
                  {item.type === "model" && item.brand_name
                    ? `${item.name}`
                    : item.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchAll;
