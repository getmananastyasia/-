import { ArrowLeft, Trophy, Star, Shield, User, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user } = useAuth();

  // Если пользователь не авторизован, показываем заглушку
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Фоновые пятна */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-700" />

        <div className="relative z-10 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900/50 border border-white/10 mb-6 shadow-2xl">
            <User className="w-10 h-10 text-zinc-500" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Требуется вход</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Войдите в аккаунт, чтобы просматривать статистику, достижения и управлять профилем.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onBack}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors"
            >
              Назад
            </button>
            {/* Здесь можно добавить вызов модалки, если передать функцию, или просто вернуть назад */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 relative overflow-hidden flex items-center justify-center">
      {/* Фоновые пятна */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="max-w-4xl w-full relative z-10">
        {/* Кнопка назад */}
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Назад</span>
        </button>

        {/* === ГЛАВНАЯ "КАПЛЯ" ПРОФИЛЯ === */}
        <div className="relative bg-zinc-900/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Блик */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
            
            {/* Левая часть: Аватар и Инфо */}
            <div className="flex flex-col items-center text-center md:text-left w-full md:w-1/3">
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl opacity-50 rounded-full animate-pulse group-hover:opacity-75 transition-opacity" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-white/20 flex items-center justify-center shadow-2xl">
                   <User className="w-14 h-14 text-zinc-400" />
                </div>
                {/* Уровень */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg border border-white/20">
                  LVL {Math.floor((user.xp || 0) / 100) + 1}
                </div>
              </div>
              
              <h2 className="text-3xl font-black text-white mb-1">{user.displayName}</h2>
              <p className="text-zinc-500 text-sm mb-6">{user.email}</p>

              <div className="w-full bg-zinc-800/50 rounded-full h-3 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${((user.xp || 0) % 100)}%` }} 
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">XP: {user.xp || 0}</p>
            </div>

            {/* Правая часть: Статистика */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Карточка монет */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                <div className="p-3 bg-yellow-500/20 rounded-2xl text-yellow-400 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Баланс</p>
                  <p className="text-2xl font-black text-white">{user.coins || 0}</p>
                </div>
              </div>

              {/* Карточка достижений */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex items-center gap-4 hover:bg-white/10 transition-colors group">
                <div className="p-3 bg-purple-500/20 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-zinc-400 text-xs uppercase tracking-wider font-bold">Награды</p>
                  <p className="text-2xl font-black text-white">{user.achievements?.length || 0}</p>
                </div>
              </div>

               {/* Список достижений */}
              <div className="col-span-1 sm:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 mt-2">
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" /> Последние награды
                </h3>
                {user.achievements && user.achievements.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {user.achievements.slice(-3).map((ach, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm text-zinc-300">
                        <Shield className="w-4 h-4 text-cyan-400" />
                        {ach}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-zinc-600 text-sm italic">Пока нет наград...</p>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}