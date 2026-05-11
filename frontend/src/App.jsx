import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home";
import Dashboard from "./Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 首页 */}
        <Route path="/" element={<Home />} />

        {/* home 页面 */}
        <Route path="/home" element={<Home />} />

        {/* 后台 */}
        <Route path="/admin" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}