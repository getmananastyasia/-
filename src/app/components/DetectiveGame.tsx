import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, Shield, AlertTriangle, Sparkles, Flame } from "lucide-react";

interface Case {
  id: number;
  title: string;
  claimant: string;
  amount: number;
  description: string;
  clue: { source: string; text: string; icon: string };
  isFraud: boolean;
  reward: number;
  penalty: number;
  difficulty: "легко" | "средне" | "сложно";
  hint?: string;
}

interface GameProps {
  balance: number;
  setBalance: (val: number) => void;
  onBack: () => void;
}

export function DetectiveGame({ balance, setBalance, onBack }: GameProps) {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const [solvedCases, setSolvedCases] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error'; bonus?: number } | null>(null);
  const [cases, setCases] = useState<Case[]>([]);

  const allCases: Case[] = [
    {
      id: 1, title: "Сгоревший Плащ", claimant: "Стивен Стрэндж", amount: 1_000_000,
      description: "Заявитель утверждает, что Плащ Левитации случайно сгорел во время приготовления ужина.",
      clue: { source: "TikTok @SpiderMan", text: "Видео: Стрэндж использует магию огня прямо на плаще со словами 'Смотри, сейчас обновлю гардероб за счет страховой!'", icon: "🎬" },
      isFraud: true, reward: 400, penalty: 500, difficulty: "легко",
      hint: "Подумай: если человек сам поджёг вещь — это страховой случай?"
    },
    {
      id: 2, title: "Пропавший Молот", claimant: "Тор Одиссон", amount: 5_000_000,
      description: "Заявитель сообщает о краже молота Мьёльнир из своего дома в Нью-Мексико.",
      clue: { source: "Камеры наблюдения", text: "На записи видно, как Тор сам улетает с молотом, говоря: 'Мне нужно на другую планету, тут скучно'.", icon: "📹" },
      isFraud: true, reward: 800, penalty: 1000, difficulty: "средне",
      hint: "Если владелец сам забрал вещь — кражи не было."
    },
    {
      id: 3, title: "Затопленная Башня", claimant: "Тони Старк", amount: 15_000_000,
      description: "Заявитель требует компенсацию за ущерб от затопления башни Старк из-за прорыва трубы.",
      clue: { source: "Отчёт инженеров", text: "Экспертиза подтвердила: труба лопнула из-за коррозии. Система автоматического отключения воды не сработала из-за сбоя в ИИ.", icon: "🔧" },
      isFraud: false, reward: 600, penalty: 800, difficulty: "средне",
      hint: "Если ущерб реальный и не по вине заявителя — это страховой случай."
    },
    {
      id: 4, title: "Разбитый Щит", claimant: "Стив Роджерс", amount: 3_000_000,
      description: "Заявитель сообщает, что вибраниумный щит был разбит во время тренировки с новобранцами.",
      clue: { source: "Свидетельские показания", text: "Новобранцы подтверждают: щит упал с высоты 3 этажа после того, как Роджерс попытался поймать его одной рукой.", icon: "🗣️" },
      isFraud: false, reward: 500, penalty: 700, difficulty: "легко",
      hint: "Несчастный случай на тренировке — это покрываемый риск."
    },
    {
      id: 5, title: "Украденный Костюм", claimant: "Питер Паркер", amount: 800_000,
      description: "Заявитель утверждает, что его высокотехнологичный костюм был украден во время патрулирования.",
      clue: { source: "Данные с костюма", text: "GPS-трекер показывает, что костюм последние 3 часа находится в квартире самого Питера. 'Я тестировал невидимость?'", icon: "📍" },
      isFraud: true, reward: 600, penalty: 900, difficulty: "сложно",
      hint: "Если вещь на самом деле у заявителя — кражи не было."
    },
    {
      id: 6, title: "Повреждённый Транспорт", claimant: "Ник Фьюри", amount: 12_000_000,
      description: "Заявитель требует компенсацию за повреждение летающего авианосца Щ.И.Т.а во время 'учебных манёвров'.",
      clue: { source: "Секретный отчёт", text: "Анализ показывает: повреждения нанесены оружием, которое есть только у агентов Щ.И.Т.а. Манёвры не были запланированы.", icon: "🔐" },
      isFraud: true, reward: 1000, penalty: 1500, difficulty: "сложно",
      hint: "Если повреждения нанесены своими же — это не страховой случай."
    },
    {
      id: 7, title: "Утраченный Артефакт", claimant: "Доктор Баннер", amount: 2_500_000,
      description: "Заявитель сообщает о потере редкого научного оборудования во время 'непреднамеренной трансформации'.",
      clue: { source: "Лабораторный журнал", text: "Записи показывают: оборудование было исправно до инцидента. Свидетели подтверждают внезапную трансформацию и разрушения.", icon: "📓" },
      isFraud: false, reward: 700, penalty: 900, difficulty: "средне",
      hint: "Непреднамеренный ущерб по вине страхователя может покрываться, если это не умышленно."
    },
    {
      id: 8, title: "Сгоревший Гараж", claimant: "Рокки Бальбоа", amount: 400_000,
      description: "Заявитель утверждает, что его гараж с тренировочным оборудованием сгорел из-за неисправной проводки.",
      clue: { source: "Пожарная экспертиза", text: "Эксперты обнаружили следы ускорителя горения. При этом Рокки недавно проиграл крупную ставку и имел финансовые трудности.", icon: "🔥" },
      isFraud: true, reward: 500, penalty: 700, difficulty: "средне",
      hint: "Следы ускорителя горения = поджог. Финансовый мотив усиливает подозрения."
    }
  ];

  useEffect(() => {
    const shuffled = [...allCases].sort(() => Math.random() - 0.5);
    setCases(shuffled.slice(0, 5));
  }, []);

  const currentCase = cases[currentCaseIndex];

  const handleDecision = (isFraud: boolean) => {
    if (!currentCase) return;
    const isCorrect = isFraud === currentCase.isFraud;
    
    if (isCorrect) {
      const bonus = streak >= 2 ? Math.round(currentCase.reward * 0.2) : 0;
      const totalReward = currentCase.reward + bonus;
      setBalance(balance + totalReward);
      setFeedback({
        type: 'success',
        message: `Верно! Это ${currentCase.isFraud ? 'мошенничество' : 'легитимный случай'}. Премия: +${currentCase.reward} 💰${bonus > 0 ? ` | Бонус за серию: +${bonus} ⚡` : ''}`,
        bonus: bonus > 0 ? bonus : undefined
      });
      setStreak(prev => prev + 1);
    } else {
      setBalance(balance - currentCase.penalty);
      setFeedback({
        type: 'error',
        message: `Ошибка! Правильный ответ: ${currentCase.isFraud ? 'Это мошенничество' : 'Легитимный случай'}. Штраф: -${currentCase.penalty} 💰`
      });
      setStreak(0);
    }
    setSolvedCases(prev => [...prev, currentCase.id]);
    setSolved(true);
  };

  const nextCase = () => {
    setFeedback(null);
    if (currentCaseIndex < cases.length - 1) {
      setCurrentCaseIndex(prev => prev + 1);
      setSolved(false);
      setShowHint(false);
    } else {
      const totalEarned = solvedCases.reduce((sum, id) => {
        const c = cases.find(x => x.id === id);
        return sum + (c?.reward || 0);
      }, 0);
      setFeedback({
        type: 'success',
        message: `🏆 Расследование завершено! Решено: ${solvedCases.length}/${cases.length} | Заработано: +${totalEarned} 💰`
      });
      setTimeout(onBack, 2500);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'легко': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'средне': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'сложно': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-zinc-400';
    }
  };

  if (!currentCase) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center">
      <p className="text-zinc-500">Загрузка дел...</p>
      <button onClick={onBack} className="mt-6 text-zinc-500 hover:text-white flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Вернуться</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Хедер */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5"/> В меню
          </button>
          <div className="flex items-center gap-4">
            {streak >= 2 && (
              <span className="flex items-center gap-1 text-orange-400 text-sm bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                <Flame className="w-4 h-4" /> {streak}
              </span>
            )}
            <span className="text-zinc-400 text-sm font-medium">Дело {currentCaseIndex + 1} / {cases.length}</span>
          </div>
        </div>
        
        {/* Карточка дела */}
        <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/20 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          {/* === ПЛАШКА ОБРАТНОЙ СВЯЗИ === */}
          {feedback && (
            <div className={`relative z-20 mb-6 p-4 rounded-xl border flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${
              feedback.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                : 'bg-red-500/10 border-red-500/30 text-red-200'
            }`}>
              <div className={`p-2 rounded-lg ${feedback.type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {feedback.type === 'success' 
                  ? <CheckCircle className="w-5 h-5 text-emerald-400" /> 
                  : <XCircle className="w-5 h-5 text-red-400" />
                }
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm mb-0.5">{feedback.type === 'success' ? '✅ Верно!' : '❌ Ошибка!'}</p>
                <p className="text-sm opacity-90 leading-relaxed">{feedback.message}</p>
                {feedback.bonus && (
                  <p className="text-xs text-orange-300 mt-1 flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Бонус за серию активен!
                  </p>
                )}
              </div>
              <button onClick={() => setFeedback(null)} className="p-1 hover:bg-white/10 rounded transition-colors">
                <XCircle className="w-4 h-4 opacity-60 hover:opacity-100" />
              </button>
            </div>
          )}
          {/* === КОНЕЦ ПЛАШКИ === */}

          {/* Шапка дела */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8 pb-6 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Досье #{currentCase.id}</p>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{currentCase.title}</h2>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border mt-2 ${getDifficultyColor(currentCase.difficulty)}`}>
                {currentCase.difficulty.toUpperCase()}
              </span>
            </div>
            <div className="md:text-right">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Сумма требования</p>
              <p className="text-3xl font-black text-white tracking-tight">{currentCase.amount.toLocaleString('ru-RU')} ₽</p>
            </div>
          </div>

          {/* Основная информация */}
          <div className="relative z-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Заявитель</p>
                <p className="text-white font-semibold">{currentCase.claimant}</p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Статус</p>
                <p className={`font-semibold ${solvedCases.includes(currentCase.id) ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {solvedCases.includes(currentCase.id) ? '✅ Закрыто' : '⏳ В работе'}
                </p>
              </div>
              <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Риск</p>
                <p className="text-zinc-300 text-sm">{currentCase.isFraud ? 'Высокий (мошенничество)' : 'Стандартный (покрытие)'}</p>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5">
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Описание случая</p>
              <p className="text-zinc-200 leading-relaxed">{currentCase.description}</p>
            </div>

            {/* Улика */}
            <div className="relative bg-zinc-900/80 border border-red-500/20 rounded-xl p-5 overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500/60" />
              <div className="flex items-center gap-2 mb-3 pl-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <h3 className="text-red-400 font-bold text-sm uppercase tracking-wider">Ключевая улика</h3>
                <span className="text-zinc-600 text-xs ml-auto">({currentCase.clue.source})</span>
              </div>
              <p className="text-zinc-100 leading-relaxed pl-2 border-l-2 border-zinc-700 italic">
                {currentCase.clue.icon} {currentCase.clue.text}
              </p>
            </div>

            {/* Подсказка */}
            {!solved && (
              <button onClick={() => setShowHint(!showHint)} className="text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2 mt-2">
                <Sparkles className="w-3 h-3" /> {showHint ? 'Скрыть подсказку' : 'Нужна подсказка?'}
              </button>
            )}
            {showHint && !solved && currentCase.hint && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3 text-indigo-200 text-sm leading-relaxed mt-2">
                💡 {currentCase.hint}
              </div>
            )}
          </div>

          {/* Кнопки решения */}
          {!solved ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 relative z-10">
              <button onClick={() => handleDecision(true)} className="group bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-400/60 text-red-300 hover:text-white p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 font-bold">
                <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="text-sm">ОТКЛОНИТЬ</div>
                  <div className="text-[10px] text-red-400/70 font-normal">Обнаружено мошенничество</div>
                </div>
              </button>
              <button onClick={() => handleDecision(false)} className="group bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-300 hover:text-white p-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 font-bold">
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-center">
                  <div className="text-sm">ОДОБРИТЬ</div>
                  <div className="text-[10px] text-emerald-400/70 font-normal">Выплатить компенсацию</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="mt-8 space-y-4 relative z-10">
              <button onClick={nextCase} className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold p-4 rounded-xl transition-all flex items-center justify-center gap-2">
                {currentCaseIndex < cases.length - 1 ? 'Следующее дело →' : 'Завершить расследование'}
              </button>
            </div>
          )}
        </div>

        {/* Прогресс-точки */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {cases.map((_, idx) => (
            <div key={idx} className={`w-2 h-2 rounded-full transition-all ${
              idx < currentCaseIndex ? 'bg-emerald-500' : idx === currentCaseIndex ? 'bg-yellow-500 scale-125' : 'bg-zinc-700'
            }`} />
          ))}
        </div>
      </div>
    </div>
  );
}