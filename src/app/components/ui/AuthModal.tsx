import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Shield, Lock, Mail, User, Eye, EyeOff, X, ArrowRight, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, displayName);
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      {/* Контейнер модального окна */}
      <div className="relative w-full max-w-md bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden">
        
        {/* Эффекты стекла (блики и градиенты) */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Кнопка закрытия */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Заголовок */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-purple-500/30 mb-4 shadow-lg shadow-purple-500/15">
            <Shield className="w-7 h-7 text-purple-300" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {isLogin ? 'Введите данные для входа' : 'Заполните форму для регистрации'}
          </p>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center gap-2 relative z-10">
            <span className="font-medium">⚠️</span> {error}
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-300 transition-colors" />
              <input
                type="text"
                placeholder="Имя пользователя"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-300 transition-colors" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-300 transition-colors" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-400/60 focus:bg-white/10 focus:ring-2 focus:ring-purple-500/20 transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-purple-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* === ИСПРАВЛЕННАЯ КНОПКА === */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white/5 border border-purple-500/20 hover:bg-purple-500/15 hover:border-purple-400/40 text-purple-200 hover:text-white font-medium rounded-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative z-10 backdrop-blur-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Загрузка...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Войти' : 'Зарегистрироваться'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Переключатель Вход/Регистрация */}
        <div className="mt-6 text-center relative z-10">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-400 hover:text-purple-300 text-sm transition-colors hover:underline underline-offset-4"
          >
            {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Вход'}
          </button>
        </div>
      </div>
    </div>
  );
}