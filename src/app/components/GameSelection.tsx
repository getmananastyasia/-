import { useState, useEffect } from "react";
import { ArrowLeft, Coins, GraduationCap, Layers, MessageCircle, Search, ShieldAlert } from "lucide-react";

interface GameSelectionProps {
  balance: number;
  onSelectGame: (gameId: string) => void;
  onBack: () => void;
  onStartTheoryTest: () => void;
}

export function GameSelection({ balance, onSelectGame, onBack, onStartTheoryTest }: GameSelectionProps) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const games = [
    { id: "swipe", title: "Риск-Свайп", desc: "Принимай быстрые решения в стиле Tinder. Влево или вправо?", icon: Layers, color: "text-pink-500", bg: "bg-pink-500/10", border: "hover:border-pink-500/50" },
    { id: "chat", title: "Чат Мстителей", desc: "Герои пишут тебе в личку. Дай правильный финансовый совет.", icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "hover:border-blue-500/50" },
    { id: "detective", title: "Страховой Детектив", desc: "Ищи мошенников и одобряй выплаты. Почувствуй себя агентом.", icon: Search, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "hover:border-yellow-500/50" },
    { id: "simulator", title: "Защита Базы", desc: "Управляй бюджетом Мстителей. Покупай полисы и жди катастроф.", icon: ShieldAlert, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "hover:border-emerald-500/50" }
  ];

  return (
    <div className="relative min-h-screen px-6 py-12 max-w-6xl mx-auto space-y-12 bg-black overflow-hidden selection:bg-zinc-700/50">
      
      {/* === ФОН (единый стиль) === */}
      <style>{`
        @keyframes float-slow { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-20px, 30px) scale(1.05); } }
        @keyframes purple-shimmer { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.85; } }
        .animate-float { animation: float-slow 14s ease-in-out infinite; }
        .animate-shimmer { animation: purple-shimmer 8s ease-in-out infinite; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-25%] left-[-10%] w-[85vw] h-[75vh] bg-gradient-to-br from-zinc-950/60 via-purple-800/20 to-black/20 rounded-full blur-[150px] transition-transform duration-1000 ease-out animate-float animate-shimmer" style={{ transform: `translate(${mouse.x * 1.5}px, ${mouse.y * 1.5}px)` }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[70vh] bg-gradient-to-tl from-zinc-950/50 via-purple-700/15 to-black/20 rounded-full blur-[140px] transition-transform duration-1000 ease-out animate-float animate-shimmer" style={{ animationDelay: '3s', transform: `translate(${-mouse.x * 1.5}px, ${-mouse.y * 1.5}px)` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-gradient-to-tr from-purple-900/10 via-transparent to-zinc-900/20 rounded-full blur-[120px] animate-shimmer" style={{ animationDelay: '1.5s' }} />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 space-y-12">
        {/* Хедер */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>
            <h1 className="text-4xl font-bold text-white">Выбери режим</h1>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
            <Coins className="w-8 h-8 text-yellow-500" />
            <div>
              <div className="text-zinc-500 text-xs font-bold uppercase">Твой бюджет</div>
              <div className="text-2xl font-black text-white">{balance} 💰</div>
            </div>
          </div>
        </div>

        {/* Блок экзамена */}
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-zinc-900/30 backdrop-blur-xl p-8 flex justify-between items-center hover:bg-zinc-900/40 transition-colors">
          <div className="flex items-center gap-4">
            <GraduationCap className="w-10 h-10 text-emerald-500" />
            <div>
              <h2 className="text-xl font-bold text-white">Экзамен по теории</h2>
              <p className="text-zinc-400 text-sm">Сдай тест и получи +500 💰 стартового капитала.</p>
            </div>
          </div>
          <button onClick={onStartTheoryTest} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl transition-all text-white shadow-lg hover:shadow-emerald-500/20">Сдать тест</button>
        </div>

        {/* Карточки игр — ТЕПЕРЬ ПРОЗРАЧНЫЕ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map(game => (
            <button 
              key={game.id} 
              onClick={() => onSelectGame(game.id)} 
              className={`group relative bg-zinc-900/20 backdrop-blur-md border border-white/5 rounded-3xl p-8 transition-all text-left flex flex-col h-full ${game.border} hover:-translate-y-1 hover:bg-zinc-900/30 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
            >
              {/* Мягкое свечение при наведении */}
              <div className={`absolute inset-0 ${game.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`} />
              
              <div className={`relative w-16 h-16 rounded-2xl ${game.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-white/5`}>
                <game.icon className={`w-8 h-8 ${game.color}`} />
              </div>
              <h3 className="relative text-2xl font-bold mb-2 text-white">{game.title}</h3>
              <p className="relative text-zinc-400">{game.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}