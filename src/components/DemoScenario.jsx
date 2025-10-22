import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DemoScenario() {
  const [step, setStep] = useState(0);
  const steps = [
    { title: "Сбор энтропии", text: "Система собирает шум из мыши и системных источников." },
    { title: "Обработка", text: "Данные нормализуются, применяется хеширование и whitening." },
    { title: "Генерация", text: "На основе смешанного семени формируется выходная последовательность." },
    { title: "Верификация", text: "Применяются базовые статистические тесты, формируется отчёт." }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Сценарий 3 — Демонстрация работы системы</h2>

      <div className="bg-slate-900 p-6 rounded shadow space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">Этап</div>
            <div className="text-lg font-semibold text-white">{steps[step].title}</div>
          </div>

          <div>
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded mr-2"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
            >
              Назад
            </button>

            <button
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded"
              onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
            >
              Вперёд
            </button>
          </div>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800 p-4 rounded"
        >
          <p className="text-slate-300">{steps[step].text}</p>
        </motion.div>

        <div className="flex gap-2">
          {steps.map((s, idx) => (
            <div key={idx} className={`px-3 py-1 rounded ${idx === step ? "bg-indigo-600 text-white" : "bg-slate-700 text-slate-300"}`}>
              {s.title}
            </div>
          ))}
        </div>

        <div className="text-sm text-slate-400">Краткий отчёт (имитация)</div>
        <div className="bg-slate-800 p-3 rounded text-xs">
          <ul className="list-disc pl-5 space-y-1">
            <li>Собрано событий: 420</li>
            <li>Сформировано семя: SHA256: abcdef... (имитация)</li>
            <li>Пара тестов пройдены: Frequency, Runs, Block Frequency</li>
            <li>Время демонстрации: ~12s</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
