import { useEffect } from "react";
import { CheckCircle2, Shield, RotateCcw, Sparkles, Coins, AlertTriangle } from "lucide-react";
import { Scenario } from "../App";

interface ResultScreenProps {
  scenario: Scenario;
  selectedAnswer: string;
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onRestart: () => void;
  onBackToWelcome: () => void;
}

export function ResultScreen({
  scenario,
  selectedAnswer,
  balance,
  onUpdateBalance,
  onRestart,
}: ResultScreenProps) {
  const selectedOption = scenario.options.find((opt) => opt.id === selectedAnswer);
  
  if (!selectedOption) return null;

  const points = selectedOption.points;
  const isGood = selectedOption.isGoodEnding;

  // Обновляем баланс при появлении экрана
  useEffect(() => {
    onUpdateBalance(balance + points);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen px-6 py-12 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        
        {/* Карточка Концовки */}
        <div className={`relative bg-zinc-900/90 backdrop-blur-xl border-2 rounded-[3rem] p-10 md:p-14 shadow-2xl overflow-hidden ${isGood ? "border-emerald-500/40" : "border-red-500/40"}`}>
          {/* Свечение на фоне */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 blur-[100px] opacity-30 ${isGood ? "bg-emerald-500" : "bg-red-500"}`} />
          
          <div className="relative z-10 text-center space-y-8">
            
            {/* Иконка */}
            <div className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center shadow-inner border-4 ${isGood ? "bg-emerald-500/20 border-emerald-500/50" : "bg-red-500/20 border-red-500/50"}`}>
              {isGood ? <CheckCircle2 className="w-12 h-12 text-emerald-500" /> : <AlertTriangle className="w-12 h-12 text-red-500" />}
            </div>

            {/* Название концовки */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                {selectedOption.endingTitle}
              </h1>
              <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-medium">
                {selectedOption.endingText}
              </p>
            </div>

            {/* Блок с балансом (Профит или Убыток) */}
            <div className="flex justify-center pt-4">
              <div className="inline-flex flex-col items-center gap-2 bg-black/40 border border-white/10 rounded-3xl p-6 shadow-inner min-w-[200px]">
                <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Итог миссии</span>
                <div className={`text-4xl font-black flex items-center gap-3 ${points >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {points > 0 ? "+" : ""}{points} <Coins className="w-8 h-8" />
                </div>
                <div className="text-zinc-400 mt-1">Твой баланс: <span className="text-white font-bold">{balance + points}</span></div>
              </div>
            </div>

            {/* Финансовый урок (Теория) */}
            <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-5 mt-8">
              <Sparkles className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-yellow-500 font-bold uppercase tracking-wider text-sm mb-2">Объяснение эксперта</h3>
                <p className="text-zinc-300 text-lg leading-relaxed">
                  {selectedOption.insuranceRule}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Кнопка "Дальше" */}
        <div className="flex justify-center pt-4">
          <button
            onClick={onRestart}
            className="group px-12 py-5 bg-white text-black font-bold text-xl rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 flex items-center gap-3"
          >
            <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
            Выбрать следующую миссию
          </button>
        </div>

      </div>
    </div>
  );
}