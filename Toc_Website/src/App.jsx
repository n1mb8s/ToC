// import { useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Brand from "./pages/brand";

function App() {
  return (
    <div className="min-h-screen bg-[#0D1017]">
      <nav className="px-6 py-4 flex gap-3 border-b border-white/10">
        MOCK UP NAV
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-md text-sm ${isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/brands"
          className={({ isActive }) =>
            `px-3 py-1.5 rounded-md text-sm ${isActive ? "bg-white text-black" : "text-white hover:bg-white/10"
            }`
          }
        >
          Brands
        </NavLink>
      </nav>

      {/* Route outlet */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brands" element={<Brand />} />
        <Route path="/brands/:brandName" element={<Brand />} />

        {/* 404 -> redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
