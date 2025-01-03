import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import KpiPage from "./pages/KpiPage";
import ViewImagePage from "./pages/ViewImagePage";

const App = () => {
  return (
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<ViewImagePage />} />
        <Route path="/kpi" element={<KpiPage />} />
      </Routes>
    </div>
  </Router>
  );
};

export default App;
