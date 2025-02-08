import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KpiPage from "./pages/KpiPage";
import ViewImagePage from "./pages/ViewImagePage";
import CompareExcel from "./pages/CompareExcel";
import ListWeb from "./pages/listweb";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ViewImagePage />} />
        <Route path="/kpi" element={<KpiPage />} />
        <Route path="/compareexcel" element={<CompareExcel />} />
        <Route path="/listweb" element={<ListWeb />} />
      </Routes>
    </Router>
  );
};

export default App;
