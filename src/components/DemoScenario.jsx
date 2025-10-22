import React, { useState } from "react";
import { motion } from "framer-motion";

export default function DemoScenario() {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Сбор энтропии", text: "Система собирает шум из движений мыши, системных задержек и фоновых процессов." },
    { title: "Обработка", text: "Данные нормализуются, применяется хеширование, смешивание и whitening для равномерности." },
    { title: "Генерация", text: "На основе финального семени формируется криптографически стойкая последовательность." },
    { title: "Верификация", text: "Применяются базовые статистические тесты NIST, формируется отчёт и контрольная сумма." },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="card">
        <h2 className="text-3xl font-semibold mb-5 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#f6e7b0] via-[#e7c45b] to-[#b98728] drop-shadow-[0_0_12px_rgba(240,200,100,0.25)] tracking-wide">
          Сценарий 3 — Демонстрация работы системы
        </h2>

        {/* Основной контейнер */}
        <div className="bg-[#0d0d0d]/80 p-6 rounded-xl border border-[#d4a64f1f] backdrop-blur-sm space-y-5">
          {/* Заголовок текущего этапа */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[#d6c68d]/80">Текущий этап</div>
              <div className="text-xl font-semibold text-[#f7e9b3]">
                {steps[step].title}
              </div>
            </div>

            {/* Кнопки управления */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  step === 0
                    ? "bg-[#2a2a2a] text-[#8b814e] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#c4a858] to-[#a37a28] text-black hover:brightness-110"
                }`}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                ← Назад
              </button>

              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  step === steps.length - 1
                    ? "bg-[#2a2a2a] text-[#8b814e] cursor-not-allowed"
                    : "bg-gradient-to-r from-[#e7c45b] to-[#b98728] text-black hover:brightness-110"
                }`}
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                disabled={step === steps.length - 1}
              >
                Вперёд →
              </button>
            </div>
          </div>

          {/* Описание этапа */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#0b0b0b] p-4 rounded-lg border border-[#d4a64f1a] shadow-inner"
          >
            <p className="text-[#d9c98a] leading-relaxed">{steps[step].text}</p>
          </motion.div>

          {/* Индикатор шагов */}
          <div className="flex flex-wrap gap-2 justify-center">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  idx === step
                    ? "bg-gradient-to-r from-[#e7c45b] to-[#b98728] text-black shadow-md"
                    : "bg-[#1a1a1a] text-[#c9b57b] border border-[#d4a64f26] hover:bg-[#222]"
                }`}
              >
                {s.title}
              </div>
            ))}
          </div>

          {/* Имитация отчёта */}
          <div>
            <div className="text-sm text-[#d6c68d]/80 mb-1">Краткий отчёт (имитация)</div>
            <div className="bg-[#0b0b0b] p-3 rounded-lg border border-[#d4a64f1a] text-xs text-[#cfe4b4] font-mono space-y-1">
              <ul className="list-disc pl-4 space-y-1">
                <li>Собрано событий энтропии: <span className="text-[#f5e4a0]">420</span></li>
                <li>Сформировано семя: <span className="text-[#f5e4a0]">SHA256: abcdef... (имитация)</span></li>
                <li>Тесты пройдены: <span className="text-[#bfe8b4]">Frequency, Runs, Block Frequency</span></li>
                <li>Время демонстрации: <span className="text-[#f5e4a0]">~12s</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
