import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { saveAs } from "file-saver";
import API_BASE_URL from "../config.js";

export default function AuditScenario() {
  const [numbers, setNumbers] = useState([]);
  const [stats, setStats] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const parseFile = async (file) => {
    const text = await file.text();
    const tokens = text
      .split(/[\s,;]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    const nums = tokens.map((t) => parseFloat(t)).filter((n) => !isNaN(n));
    setNumbers(nums);
    computeStats(nums);
  };

  const computeStats = (arr) => {
    if (!arr?.length) {
      setStats(null);
      return;
    }
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b, 0) / n;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const stdev = Math.sqrt(variance);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const bins = {};
    arr.forEach((x) => {
      const key = Math.round(x);
      bins[key] = (bins[key] || 0) + 1;
    });
    const binData = Object.keys(bins).map((k) => ({ name: k, value: bins[k] }));
    setStats({ n, mean, stdev, min, max, binData });
  };

  const runStatisticalTests = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/run-statistical-tests`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numbers }),
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
    const blob = new Blob(
      [JSON.stringify({ numbers, stats, testResult }, null, 2)],
      { type: "application/json" }
    );
    saveAs(blob, "audit-report.json");
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="card">
        <h2 className="text-3xl font-semibold mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#f6e7b0] via-[#e7c45b] to-[#b98728] drop-shadow-[0_0_12px_rgba(240,200,100,0.25)] tracking-wide">
          ⚙️ Сценарий 2 — Аудит внешнего генератора
        </h2>

        {/* Загрузка и кнопки */}
        <div className="bg-[#0d0d0d]/80 p-5 rounded-xl border border-[#d4a64f1f] backdrop-blur-sm">
          <div className="mb-3 text-sm text-[#e0c887]/90">
            Загрузите файл с числами <span className="opacity-70">(txt, csv)</span>
          </div>

          <input
            type="file"
            accept=".txt,.csv"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) parseFile(f);
            }}
            className="w-full text-sm bg-[#141414] border border-[#3a2f18] rounded-lg p-2 text-[#d9c98a] focus:ring-1 focus:ring-[#d4a64f] mb-4"
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={runStatisticalTests}
              disabled={loading || !numbers.length}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                loading || !numbers.length
                  ? "bg-[#2a2a2a] text-[#8b814e] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#e7c45b] to-[#b98728] text-black hover:brightness-110"
              }`}
            >
              {loading ? "Тестирование..." : "Запустить NIST-тесты"}
            </button>

            <button
              onClick={downloadReport}
              disabled={!stats}
              className={`px-4 py-2 rounded-lg border border-[#d4a64f33] text-[#e0c887] hover:bg-[#1e1e1e] transition-all ${
                !stats ? "opacity-40 cursor-not-allowed" : ""
              }`}
            >
              Скачать отчёт
            </button>

            <button
              className="px-4 py-2 rounded-lg bg-[#171717] text-[#e0c887] hover:bg-[#242424] transition-all"
              onClick={() => {
                setNumbers([]);
                setStats(null);
                setTestResult(null);
              }}
            >
              Сброс
            </button>
          </div>
        </div>
      </div>

      {/* Основные статистики и гистограмма */}
      {stats && (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card">
            <div className="text-sm text-[#d6c68d] mb-3 border-b border-[#3a2f18] pb-2">
              📊 Основные статистики
            </div>
            <div className="text-sm text-[#f0e6c2] space-y-1">
              <div>Количество: <span className="text-[#f6e7b0]">{stats.n}</span></div>
              <div>Среднее: <span className="text-[#f6e7b0]">{stats.mean.toFixed(3)}</span></div>
              <div>Ст. отклонение: <span className="text-[#f6e7b0]">{stats.stdev.toFixed(3)}</span></div>
              <div>Мин: <span className="text-[#f6e7b0]">{stats.min}</span></div>
              <div>Макс: <span className="text-[#f6e7b0]">{stats.max}</span></div>
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-[#d6c68d] mb-3 border-b border-[#3a2f18] pb-2">
              📈 Гистограмма распределения
            </div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.binData}>
                  <XAxis dataKey="name" stroke="#c9b57b" />
                  <YAxis stroke="#c9b57b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #d4a64f33",
                      color: "#f0e6c2",
                    }}
                  />
                  <Bar dataKey="value" fill="#d4a64f" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Результаты тестов */}
      {testResult && (
        <div className="card">
          <div className="text-sm text-[#d6c68d] mb-3 border-b border-[#3a2f18] pb-2">
            🧠 Результаты NIST-тестов
          </div>
          <pre className="text-xs text-[#bfe8b4] bg-[#0b0b0b] border border-[#d4a64f26] p-3 rounded-lg overflow-auto max-h-72 shadow-inner">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
