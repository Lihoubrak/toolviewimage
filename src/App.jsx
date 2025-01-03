import React, { useState, useEffect } from "react";
<<<<<<< HEAD
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
=======
import HomePage from "./pages/HomePage";


const App = () => {
  return (
    <div>
      <HomePage/>
    </div>
>>>>>>> 353e47ef74212702c2d31859bab3480c86cbe154
  );
};

export default App;
