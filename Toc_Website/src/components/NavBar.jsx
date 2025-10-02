import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchAll from "./SearchAll";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const resultsRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  const handleDownload = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/download/csv/combined`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'car_data_combined.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert(err.message);
    }
  };

  const handleResults = (items) => setSearchResults(items || []);

  // Close results on click outside or Escape
  useEffect(() => {
    const handleDocMouseDown = (e) => {
      if (searchResults.length === 0) return;
      const target = e.target;
      if (
        resultsRef.current?.contains(target) ||
        desktopSearchRef.current?.contains(target) ||
        mobileSearchRef.current?.contains(target)
      ) {
        return; // clicked inside results or search inputs
      }
      setSearchResults([]);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && searchResults.length > 0) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleDocMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDocMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchResults.length]);

  return (
    <nav className="w-full px-6 md:px-32 py-4 bg-[#36446433] backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        {/* Logo + Name */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <img
            src="/src/assets/logo.svg"
            alt="CarChanom Logo"
            className="w-12 h-8 md:w-14 md:h-9"
          />
          <div className="text-white text-xl md:text-2xl font-bold font-[Cuprum]">
            CarChanom
          </div>
        </div>

        {/* Desktop: SearchBar */}
        <div className="hidden md:flex flex-1 justify-center px-6" ref={desktopSearchRef}>
          <SearchAll onResults={handleResults} showResultsInline={false} />
        </div>

        {/* Download button */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#006EFA] rounded-full cursor-pointer" onClick={handleDownload}>
          <img src="/src/assets/download.svg" alt="Download" className="w-5 h-5" />
          <span className="text-white text-sm md:text-base font-medium font-['IBM Plex Sans Thai']">
            Download
          </span>
        </button>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <img
              src="/src/assets/close.svg"
              alt="Close menu"
              className="w-7 h-7 invert"
            />
          ) : (
            <img
              src="/src/assets/menu.svg"
              alt="Open menu"
              className="w-7 h-7 invert"
            />
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <div ref={mobileSearchRef}>
            <SearchAll onResults={handleResults} showResultsInline={false} />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#006EFA] rounded-full" onClick={handleDownload}>
            <img src="/src/assets/download.svg" alt="Download" className="w-5 h-5" />
            <span className="text-white text-sm font-medium font-['IBM Plex Sans Thai']">
              Download
            </span>
          </button>
        </div>
      )}
      {/* Below-nav results panel */}
      {searchResults.length > 0 && (
        <div className="px-3 py-3 bg-[#0D1017] border-b border-white/10" ref={resultsRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg bg-white cursor-pointer hover:shadow"
                onClick={() => {
                  if (item?.type === "brand") {
                    const brandName = (item.name || "").replace(/\s+/g, "-");
                    navigate(`/brands/${brandName}`);
                    setSearchResults([]);
                    setIsOpen(false);
                  } else if (item?.type === "model") {
                    const brandSlug = (item.brand_name || "").replace(/\s+/g, "-");
                    const modelSlug = (item.name || "").replace(`${brandSlug} `, "");
                    navigate(`/brands/${brandSlug}/${modelSlug}`);
                    setSearchResults([]);
                    setIsOpen(false);
                  }
                }}
              >
                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">{item.type}</div>
                  <div className="text-base font-semibold text-gray-900 truncate">
                    {item.type === "model" && item.brand_name ? `${item.name}` : item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
