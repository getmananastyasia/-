import { useState, useEffect } from "react";
import { Shield, Sparkles, Gamepad2, Wallet, Target, User, LogIn } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
  user: any;
}

export function WelcomeScreen({ onStart, onLoginClick, onProfileClick, user }: WelcomeScreenProps) {
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

  const features = [
    { icon: Gamepad2, title: "Теория без скуки", desc: "Погружайся в финансы без перегруза — всё просто и по делу." },
    { icon: Wallet, title: "Твои решения", desc: "Каждый выбор влияет на сюжет и твой кошелек. Не уйди в минус!" },
    { icon: Target, title: "Реальная польза", desc: "Узнай, как эти знания спасут твой смартфон, ПК и путешествия." }
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center px-6 py-12 selection:bg-zinc-700/50">
      
      {/* 📱 ВЕРХНЯЯ ПАНЕЛЬ */}
      <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 py-4 pointer-events-none">
        <nav className="w-full max-w-6xl flex items-center justify-between px-6 py-3 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-auto">
          
          <div className="flex items-center gap-3 shrink-0">
            <div className="p-1.5 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
              <Shield className="w-5 h-5 text-zinc-400" />
            </div>
            <span className="text-zinc-500 font-bold tracking-widest text-xs uppercase hidden sm:block">
              SecureGuide
            </span>
          </div>
          
          <div className="flex items-center gap-4 shrink-0 ml-auto">
            {!user ? (
              <button 
                onClick={onLoginClick}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-all duration-300 text-sm font-semibold px-2 py-1"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden xs:block">Войти</span>
              </button>
            ) : (
              <span className="text-zinc-300 text-sm font-bold px-2">
                {user.displayName}
              </span>
            )}
            
            <div className="h-4 w-[1px] bg-white/5 mx-1"></div>
            
            <button 
              onClick={onProfileClick}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-white transition-all duration-300 text-sm font-bold shadow-lg"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Профиль</span>
            </button>
          </div>
        </nav>
      </header>

      {/*ФОН С ЭФФЕКТОМ ПЕРЕЛИВОВ */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 30px) scale(1.05); }
        }
        @keyframes purple-shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        .animate-float { animation: float-slow 14s ease-in-out infinite; }
        .animate-shimmer { animation: purple-shimmer 8s ease-in-out infinite; }
      `}</style>

      <div className="fixed inset-0 pointer-events-none">
        {/* Верхнее пятно (фиолетовый на тон светлее: 900 → 800) */}
        <div
          className="absolute top-[-25%] left-[-10%] w-[85vw] h-[75vh] bg-gradient-to-br from-zinc-950/60 via-purple-800/20 to-black/20 rounded-full blur-[150px] transition-transform duration-1000 ease-out animate-float animate-shimmer"
          style={{ transform: `translate(${mouse.x * 1.5}px, ${mouse.y * 1.5}px)` }}
        />
        {/* Нижнее пятно (фиолетовый на тон светлее: 800 → 700) */}
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[70vh] bg-gradient-to-tl from-zinc-950/50 via-purple-700/15 to-black/20 rounded-full blur-[140px] transition-transform duration-1000 ease-out animate-float animate-shimmer"
          style={{ animationDelay: '3s', transform: `translate(${-mouse.x * 1.5}px, ${-mouse.y * 1.5}px)` }}
        />
        {/* Центральное свечение (фиолетовый на тон светлее: 950 → 900) */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-gradient-to-tr from-purple-900/10 via-transparent to-zinc-900/20 rounded-full blur-[120px] animate-shimmer"
          style={{ animationDelay: '1.5s' }}
        />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center space-y-14 mt-16">
        
        {/*ГЕРОЙ-СЕКЦИЯ */}
        <div className="space-y-8">
          <div className="relative inline-flex items-center justify-center group">
            <div className="absolute inset-0 bg-zinc-800/20 blur-3xl rounded-full group-hover:bg-zinc-700/30 transition-all duration-700" />
            <div className="relative w-24 h-24 bg-zinc-900/50 backdrop-blur-2xl border border-zinc-700/50 rounded-full flex items-center justify-center group-hover:scale-105 transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
              <Shield className="w-11 h-11 text-zinc-400" />
            </div>
          </div>

          <div className="space-y-5">
            <h1 className="text-4xl md:text-6xl font-light tracking-tight leading-tight">
              <span className="block text-zinc-300/80 backdrop-blur-sm">
                Интерактивный гайд
              </span>
              <span className="block mt-2 text-zinc-600">
                по страхованию
              </span>
            </h1>
            
            <div className="inline-block px-8 py-4 bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl mt-2">
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                Тренажер нового поколения. Изучай теорию без скучных лекций.
              </p>
            </div>
          </div>

          {/* 🚀 КНОПКА "НАЧАТЬ ИСТОРИЮ" */}
          <div className="pt-2">
            <button
              onClick={onStart}
              className="group relative px-16 py-5 bg-zinc-800/30 backdrop-blur-2xl border border-zinc-700/50 text-zinc-200 font-bold text-lg rounded-full hover:bg-zinc-700/40 hover:border-zinc-600/60 hover:text-white transition-all duration-500 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                Начать историю
              </span>
            </button>
          </div>
        </div>

        {/* 🃏 ПРЕИМУЩЕСТВА */}
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {features.map((feat, i) => (
            <div 
              key={i} 
              className="group p-8 bg-zinc-900/20 backdrop-blur-2xl border border-zinc-800/40 rounded-[2.5rem] hover:border-zinc-600/50 hover:bg-zinc-900/40 hover:scale-[1.02] transition-all duration-500"
            >
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/30 border border-zinc-700/30 flex items-center justify-center group-hover:rotate-3 transition-all duration-500">
                  <feat.icon className="w-8 h-8 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-zinc-200 tracking-tight">{feat.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}