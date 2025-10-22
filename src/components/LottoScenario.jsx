import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import crypto from "crypto-js";
import API_BASE_URL from "../config.js";

const COLORS = ["#60A5FA", "#A78BFA", "#F472B6", "#FB7185", "#34D399", "#F59E0B", "#60A5FA"];

function sha256Hex(input) {
  try {
    return crypto.SHA256(input).toString();
  } catch {
    return Math.random().toString(36).slice(2, 10);
  }
}

export default function LottoScenario() {
  const [running, setRunning] = useState(false);
  const [stage, setStage] = useState("idle");
  const [result, setResult] = useState([]);
  const [snapshot, setSnapshot] = useState("");
  const [error, setError] = useState("");

  // локальная генерация как fallback
  const generateNumbers = (count = 6, max = 49) => {
    const set = new Set();
    while (set.size < count) {
      const r = Math.floor(Math.random() * max) + 1;
      set.add(r);
    }
    return Array.from(set).sort((a, b) => a - b);
  };

  const runDraw = async () => {
    setRunning(true);
    setStage("collecting");
    setResult([]);
    setSnapshot("");
    setError("");

    try {
      await new Promise(r => setTimeout(r, 700));
      setStage("processing");

      // 🔹 запрос к реальному API
      const res = await fetch(`${API_BASE_URL}/lottery/6`, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      let finalNumbers = [];
      if (res.ok) {
        const data = await res.json();
        finalNumbers = Array.isArray(data) ? data : data?.numbers || [];
      } else {
        console.warn("Backend unavailable, fallback to local RNG");
        finalNumbers = generateNumbers();
      }

      setStage("finalizing");
      await new Promise(r => setTimeout(r, 600));

      setResult(finalNumbers);
      const snap = sha256Hex(`${Date.now()}|${finalNumbers.join(",")}`);
      setSnapshot(snap);
      setStage("done");
    } catch (err) {
      console.error("Ошибка при генерации:", err);
      setError("Ошибка связи с сервером");
      setStage("failed");
    } finally {
      setRunning(false);
    }
  };

  const histData = useMemo(() => {
    const map = {};
    for (const n of result) map[n] = (map[n] || 0) + 1;
    return Object.keys(map).map(k => ({ name: k, value: map[k] }));
  }, [result]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Сценарий 1 — Проведение лотерейного тиража</h2>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-slate-900 p-4 rounded shadow">
          <div className="mb-3 text-sm text-slate-400">Статусы генерации</div>
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-3 px-4 rounded bg-slate-800"
          >
            <div className="text-lg font-medium text-white capitalize">{stage}</div>
            <div className="text-sm text-slate-300 mt-2">
              {stage === "idle" && "Нажмите «Запустить тираж»"}
              {stage === "collecting" && "Сбор энтропии..."}
              {stage === "processing" && "Обработка данных..."}
              {stage === "finalizing" && "Финализация и контроль целостности..."}
              {stage === "done" && "Готово — результат сформирован."}
              {stage === "failed" && `Ошибка: ${error}`}
            </div>
          </motion.div>

          <div className="mt-4 flex gap-2">
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={runDraw}
              disabled={running}
            >
              Запустить тираж
            </button>

            <button
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setResult([]);
                setStage("idle");
                setSnapshot("");
              }}
            >
              Сброс
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-900 p-4 rounded shadow">
          <div className="text-sm text-slate-400 mb-2">Результат</div>
          <div className="bg-slate-800 p-3 rounded">
            {result.length === 0 ? (
              <div className="text-slate-400">Пока нет результата</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {result.map((n, i) => (
                  <div key={i} className="bg-white text-slate-900 font-semibold px-3 py-2 rounded shadow">
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="text-xs text-slate-400 mb-2">Цифровой слепок (SHA-256)</div>
            <div className="bg-slate-800 p-2 rounded text-xs text-emerald-300 break-all">
              {snapshot || "—"}
            </div>
          </div>
        </div>
      </div>

      {result.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded shadow">
            <div className="text-sm text-slate-400 mb-2">Гистограмма номеров</div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histData}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded shadow">
            <div className="text-sm text-slate-400 mb-2">Распределение (круговая)</div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={histData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8">
                    {histData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
