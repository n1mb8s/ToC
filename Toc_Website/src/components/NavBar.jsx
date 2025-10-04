import React, { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SearchAll from "./SearchAll";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const resultsRef = useRef(null);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  const handleDownload = async (retryCount = 0) => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);

      const exportResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/export/all`
      );

      if (!exportResponse.ok) {
        if (exportResponse.status === 500) {
          console.warn("Export API returned 500, trying direct download...");
          await downloadDirectly();
          return;
        }
        throw new Error(`Export API error! status: ${exportResponse.status}`);
      }

      const exportData = await exportResponse.json();
      console.log("Export API response:", exportData);

      if (exportData.status !== "success") {
        throw new Error(exportData.message || "Export failed");
      }

      const downloadEndpoint = exportData.download_endpoints?.combined;
      if (!downloadEndpoint) {
        throw new Error("Download endpoint not found in response");
      }

      const downloadResponse = await fetch(
        `${import.meta.env.VITE_BASE_URL}${downloadEndpoint}`
      );

      if (!downloadResponse.ok) {
        if (downloadResponse.status === 500 && retryCount === 0) {
          console.warn("Download endpoint returned 500, trying direct download...");
          await downloadDirectly();
          return;
        }
        throw new Error(`Download error! status: ${downloadResponse.status}`);
      }

      const blob = await downloadResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "car_data_combined.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      console.log("File downloaded successfully");
    } catch (err) {
      console.error("Download error:", err);

      if (retryCount === 0) {
        console.log("Retrying with direct download...");
        try {
          await downloadDirectly();
          return;
        } catch (directErr) {
          console.error("Direct download also failed:", directErr);
        }
      }

      alert(`Download failed: ${err.message}. Please try again later.`);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadDirectly = async () => {
    const downloadResponse = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/download/csv/combined`
    );

    if (!downloadResponse.ok) {
      throw new Error(`Direct download error! status: ${downloadResponse.status}`);
    }

    const blob = await downloadResponse.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "car_data_combined.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    console.log("File downloaded successfully via direct download");
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
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="./logo.svg"
            alt="CarChanom Logo"
            className="w-12 h-8 md:w-14 md:h-9"
          />
          <div className="text-white text-xl md:text-2xl font-bold font-[Cuprum]">
            CarChanom
          </div>
        </div>

        {/* Desktop: SearchBar */}
        <div
          className="hidden md:flex flex-1 justify-center px-6"
          ref={desktopSearchRef}
        >
          <SearchAll onResults={handleResults} showResultsInline={false} />
        </div>

        <div className="flex space-x-2">
          {/* Source Code button */}
          <a
            href="https://github.com/n1mb8s/Car-Scraping"
            className="hidden md:flex items-center gap-2 px-4 py-2"
          >
            <span className="text-[#006EFA] text-sm md:text-base font-medium font-['IBM Plex Sans Thai']">
              SourceCode
            </span>
          </a>
          {/* Download button */}
          <button
            className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full ${isDownloading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-[#006EFA] cursor-pointer hover:bg-[#0056CC]'
              } transition-colors`}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <img src="/download.svg" alt="Download" className="w-5 h-5" />
            )}
            <span className="text-white text-sm md:text-base font-medium font-['IBM Plex Sans Thai']">
              {isDownloading ? 'Downloading...' : 'Download'}
            </span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <img src="/close.svg" alt="Close menu" className="w-7 h-7 invert" />
          ) : (
            <img src="/menu.svg" alt="Open menu" className="w-7 h-7 invert" />
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 h-32">
          <div ref={mobileSearchRef}>
            <SearchAll onResults={handleResults} showResultsInline={false} />
          </div>

          <div className="flex flex-col w-full items-center">
            <a
              href="https://github.com/n1mb8s/Car-Scraping"
              className="max-w-lg flex items-center gap-2 px-4 py-2 "
            >
              <span className="text-[#006EFA] text-sm font-medium font-['IBM Plex Sans Thai']">
                SourceCode
              </span>
            </a>
            <button
              className={`max-w-lg flex items-center gap-2 px-4 py-2 rounded-full ${isDownloading
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-[#006EFA] cursor-pointer hover:bg-[#0056CC]'
                } transition-colors`}
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img src="/download.svg" alt="Download" className="w-5 h-5" />
              )}
              <span className="text-white text-sm font-medium font-['IBM Plex Sans Thai']">
                {isDownloading ? 'Downloading...' : 'Download'}
              </span>
            </button>
          </div>
        </div>
      )}
      {/* Below-nav results panel */}
      {searchResults.length > 0 && (
        <div
          className="px-3 py-3 bg-[#0D1017] border-b border-white/10"
          ref={resultsRef}
        >
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
                    const brandSlug = (item.brand_name || "").replace(
                      /\s+/g,
                      "-"
                    );
                    const modelSlug = (item.name || "").replace(
                      `${brandSlug} `,
                      ""
                    );
                    navigate(`/brands/${brandSlug}/${modelSlug}`);
                    setSearchResults([]);
                    setIsOpen(false);
                  }
                }}
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
