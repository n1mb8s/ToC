import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Brand from "./pages/brand";
import Navbar from "./components/NavBar";
import Banner from "./components/Banner";

function App() {
  return (
    <div className="min-h-screen bg-[#0D1017]">
      <Navbar />
      <Banner/>

      {/* Route outlet */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/brands" element={<Brand />} />

        {/* 404 -> redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
