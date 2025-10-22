import React from "react";
import { Link } from "react-router-dom";

export default function Header(){
  return (
    <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold">RandomTrust</div>
        <nav className="ml-6 space-x-4 hidden md:block">
          <Link to="/lotto" className="text-slate-300 hover:text-white">Тираж</Link>
          <Link to="/audit" className="text-slate-300 hover:text-white">Аудит</Link>
          <Link to="/demo" className="text-slate-300 hover:text-white">Демо</Link>
        </nav>
      </div>

      <div className="text-sm text-slate-400 hidden sm:block">Демонстрационный фронтенд — без бэка</div>
    </header>
  );
}
