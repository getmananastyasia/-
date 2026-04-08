import { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { AuthModal } from "./components/ui/AuthModal";
import { Shop } from "./components/ui/Shop";
import { Profile } from './components/ui/Profile';
import { User, Coins, LogOut, ShoppingCart, Award, ArrowRight } from "lucide-react";

import { WelcomeScreen } from "./components/WelcomeScreen";
import { TheoryScreen } from "./components/TheoryScreen";
import { GameSelection } from "./components/GameSelection";
import { WorkbookTestScreen } from "./components/WorkbookTestScreen";
import { SwipeGame } from "./components/SwipeGame";
import { ChatGame } from "./components/ChatGame";
import { DetectiveGame } from "./components/DetectiveGame";
import { SimulatorGame } from "./components/SimulatorGame";

export type Screen = "welcome" | "theory" | "games" | "workbook-test" | "swipe" | "chat" | "detective" | "simulator" | "shop" | "profile";

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const { user, logout, updateUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const currentBalance = user ? user.coins : 1000;

  const addCoins = (amount: number) => {
    if (user) {
      updateUser({ coins: user.coins + amount });
    }
  };

  const isWelcome = currentScreen === "welcome";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-zinc-950 via-purple-950/10 to-zinc-950 text-white">
      {/* Фоновые декоративные элементы */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>
      
      {/* === ГЛОБАЛЬНАЯ ПАНЕЛЬ (Полупрозрачная "Капля") === */}
      {user && !isWelcome && (
        <div className="fixed top-4 left-0 right-0 z-50 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden">
              
              {/* Блик сверху (эффект стекла) */}
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-60" />

              <div className="flex items-center justify-between px-4 py-2.5 relative z-10">
                
                {/* Левая часть - Профиль и статистика */}
                <button 
                  onClick={() => setCurrentScreen("profile")}
                  className="flex items-center gap-3 group -ml-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  {/* Имя пользователя */}
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors hidden sm:inline">
                      {user.displayName}
                    </span>
                  </div>

                  {/* Монеты (СИЯНИЕ) */}
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl hover:bg-yellow-500/15 transition-all relative overflow-hidden">
                    {/* Внутренний блеск */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent translate-x-[-150%] animate-[shimmer_2s_infinite]" />
                    <Coins className="w-4 h-4 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)] animate-pulse" />
                    <span className="text-sm font-bold text-yellow-400 drop-shadow-sm">
                      {currentBalance}
                    </span>
                  </div>

                  {/* Достижения */}
                  <div className="flex items-center gap-2.5 px-3 py-1.5 bg-purple-500/5 border border-purple-500/20 rounded-xl hover:bg-purple-500/15 transition-all">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-purple-400">
                      {user.achievements?.length || 0}
                    </span>
                  </div>
                </button>

                {/* Правая часть - Кнопки */}
                <div className="flex items-center gap-3">
                  {/* Магазин - Полупрозрачный */}
                  <button 
                    onClick={() => setCurrentScreen("shop")}
                    className="group relative flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-200 hover:text-white font-medium rounded-xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                  >
                     {/* Анимация блика при наведении */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <ShoppingCart className="w-4 h-4 transition-colors relative z-10" /> 
                    <span className="text-sm relative z-10">Магазин</span>
                  </button>

                  {/* Выйти */}
                  <button 
                    onClick={logout}
                    className="group p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-xl transition-all duration-300"
                    title="Выйти"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === КНОПКА "Войти / Регистрация" === */}
      {!user && !isWelcome && (
        <div className="fixed top-4 right-4 z-50">
           <button
            onClick={() => setShowAuthModal(true)}
            className="group px-5 py-2.5 bg-zinc-900/50 backdrop-blur-xl border border-white/15 hover:border-white/30 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative z-10">Войти / Регистрация</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
          </button>
        </div>
      )}

      {/* Основной контент */}
      <div className={`relative z-10 h-full ${user && !isWelcome ? 'pt-24' : ''}`}>
        {currentScreen === "shop" && <Shop onBack={() => setCurrentScreen("games")} />}
        {currentScreen === "profile" && <Profile onBack={() => setCurrentScreen("games")} />}
        {currentScreen === "welcome" && (
          <WelcomeScreen 
            onStart={() => setCurrentScreen("theory")} 
            onLoginClick={() => setShowAuthModal(true)}
            onProfileClick={() => setCurrentScreen("profile")}
            user={user}
          />
        )}
        {currentScreen === "theory" && <TheoryScreen onComplete={() => setCurrentScreen("games")} />}
        {currentScreen === "workbook-test" && (
          <WorkbookTestScreen onBack={() => setCurrentScreen("games")} onSuccess={() => addCoins(500)} />
        )}
        {currentScreen === "games" && (
          <GameSelection 
            balance={currentBalance} 
            onSelectGame={(gameId) => setCurrentScreen(gameId as Screen)}
            onBack={() => setCurrentScreen("welcome")}
            onStartTheoryTest={() => setCurrentScreen("workbook-test")}
          />
        )}
        {currentScreen === "swipe" && <SwipeGame balance={currentBalance} setBalance={() => {}} onBack={() => setCurrentScreen("games")} />}
        {currentScreen === "chat" && <ChatGame balance={currentBalance} setBalance={() => {}} onBack={() => setCurrentScreen("games")} />}
        {currentScreen === "detective" && <DetectiveGame balance={currentBalance} setBalance={() => {}} onBack={() => setCurrentScreen("games")} />}
        {currentScreen === "simulator" && <SimulatorGame balance={currentBalance} setBalance={() => {}} onBack={() => setCurrentScreen("games")} />}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;