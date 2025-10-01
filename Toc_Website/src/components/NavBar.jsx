import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <nav className="w-full px-6 md:px-32 py-4 bg-[#36446433] backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
      <div className="flex justify-between items-center">
        
        {/* Logo + Name */}
        <div className="flex items-center gap-2">
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
        <div className="hidden md:flex flex-1 justify-center px-6">
          <SearchBar />
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
                <img src="/src/assets/close.svg" alt="Close menu" className="w-7 h-7 invert" />
            ) : (
                <img src="/src/assets/menu.svg" alt="Open menu" className="w-7 h-7 invert" />
            )}
            </button>

      </div>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          <SearchBar />
          {/* <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/brands"
            className={({ isActive }) =>
              `px-3 py-2 rounded-md text-sm ${
                isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Brands
          </NavLink> */}
          <button className="flex items-center gap-2 px-4 py-2 bg-[#006EFA] rounded-full">
            <img src="/src/assets/download.svg" alt="Download" className="w-5 h-5" />
            <span className="text-white text-sm font-medium font-['IBM Plex Sans Thai']">
              Download
            </span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
