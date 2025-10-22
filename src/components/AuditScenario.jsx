import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { saveAs } from "file-saver";
import API_BASE_URL from "../config.js";

export default function AuditScenario() {
  const [numbers, setNumbers] = useState([]);
  const [stats, setStats] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseFile = async (file) => {
    const text = await file.text();
    const tokens = text.split(/[\s,;]+/).map(t => t.trim()).filter(Boolean);
    const nums = tokens.map(t => parseFloat(t)).filter(n => !isNaN(n));
    setNumbers(nums);
    computeStats(nums);
  };

  const computeStats = (arr) => {
    if (!arr?.length) { setStats(null); return; }
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const stdev = Math.sqrt(variance);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const bins = {};
    arr.forEach(x => {
      const key = Math.round(x);
      bins[key] = (bins[key] || 0) + 1;
    });
    const binData = Object.keys(bins).map(k => ({ name: k, value: bins[k] }));
    setStats({ n, mean, stdev, min, max, binData });
  };

  const runStatisticalTests = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/run-statistical-tests?dataSize=50000`, {
        method: "POST",
        headers: { "Accept": "application/json" },
      });
      if (!res.ok) throw new Error("Ошибка API");
      const data = await res.json();
      setTestResult(data);
    } catch (err) {
      console.error(err);
      setTestResult({ message: "Не удалось выполнить тесты" });
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([JSON.stringify({ numbers, stats, testResult }, null, 2)], { type: "application/json" });
    saveAs(blob, "audit-report.json");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Сценарий 2 — Аудит внешнего генератора</h2>

      <div className="bg-slate-900 p-4 rounded shadow">
        <div className="mb-2 text-sm text-slate-400">Загрузите файл с числами (txt, csv)</div>
        <input
          type="file"
          accept=".txt,.csv"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) parseFile(f);
          }}
          className="text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={runStatisticalTests}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded"
        >
          {loading ? "Тестирование..." : "Запустить NIST-тесты"}
        </button>
        <button
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded"
          onClick={downloadReport}
          disabled={!stats}
        >
          Скачать отчёт
        </button>
        <button
          className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded"
          onClick={() => { setNumbers([]); setStats(null); setTestResult(null); }}
        >
          Сброс
        </button>
      </div>

      {stats && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded shadow">
            <div className="text-sm text-slate-400 mb-2">Основные статистики</div>
            <div className="text-sm text-slate-200 space-y-1">
              <div>Count: {stats.n}</div>
              <div>Mean: {stats.mean.toFixed(3)}</div>
              <div>StdDev: {stats.stdev.toFixed(3)}</div>
              <div>Min: {stats.min}</div>
              <div>Max: {stats.max}</div>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded shadow">
            <div className="text-sm text-slate-400 mb-2">Гистограмма</div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.binData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#34D399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {testResult && (
        <div className="bg-slate-900 p-4 rounded shadow">
          <div className="text-sm text-slate-400 mb-2">Результаты NIST-тестов</div>
          <pre className="text-xs text-emerald-300 bg-slate-800 p-2 rounded overflow-auto max-h-64">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
