import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import LottoScenario from "./components/LottoScenario";
import AuditScenario from "./components/AuditScenario";
import DemoScenario from "./components/DemoScenario";

export default function App(){
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <Header />
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/lotto" replace />} />
            <Route path="/lotto" element={<LottoScenario />} />
            <Route path="/audit" element={<AuditScenario />} />
            <Route path="/demo" element={<DemoScenario />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
