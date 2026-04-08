import { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, Check, X, ShieldAlert, TrendingUp, TrendingDown, 
  ArrowRight, Coins, BookOpen, RotateCcw, Play, BrainCircuit,
  Plus, Trash2, Save, XCircle
} from "lucide-react";

interface GameProps {
  balance: number;
  setBalance: (val: number) => void;
  onBack: () => void;
}

interface CardData {
  title: string;
  text: string;
  costYes: number;
  costNo: number;
  resultYes: string;
  resultNo: string;
  isYesCorrect: boolean;
}

interface TermData {
  term: string;
  definition: string;
  example: string;
  emoji: string;
  isCustom?: boolean;
}

export function SwipeGame({ balance, setBalance, onBack }: GameProps) {
  const [mode, setMode] = useState<'situations' | 'terms' | 'editor'>('situations');
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string, delta: number, isCorrect: boolean } | null>(null);
  const [completedTerms, setCompletedTerms] = useState<number[]>([]);
  const [showTermDetails, setShowTermDetails] = useState(false);
  
  // 🖱️ Свайп-логика
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // ✏️ Редактор терминов
  const [newTerm, setNewTerm] = useState<TermData>({ term: '', definition: '', example: '', emoji: '📝' });
  const [customTerms, setCustomTerms] = useState<TermData[]>([]);
  const [showEditor, setShowEditor] = useState(false);

  // 🎮 Ситуации (свайп)
  const situationCards: CardData[] = [
    { 
      title: "Паучье чутье",
      text: "Тот самый Питер Паркер хочет застраховать свои веб-шутеры перед боем. Полис стоит 100 💰. Покупаем?", 
      costYes: -100, 
      costNo: -1000, 
      resultYes: "Умный ход! Шутеры сгорели, но страховая покрыла 1000 💰 на новые.", 
      resultNo: "Сэкономил 100 💰. Но враг разбил шутеры, ремонт — 1000 💰 из своего кармана.",
      isYesCorrect: true
    },
    { 
      title: "Страховка на болоте",
      text: "Шрек сомневается: стоит ли покупать полис ответственности на случай, если Осёл устроит погром? Полис — 150 💰.", 
      costYes: -150, 
      costNo: -2000, 
      resultYes: "Отдал 150 💰. Осёл разнес витрину, страховая выплатила 2000 💰. Болото спасено!", 
      resultNo: "Зажал 150 💰. Осёл разнес полгорода. Счет Фаркуада — 2000 💰!",
      isYesCorrect: true
    },
    { 
      title: "Хитрость лиса",
      text: "Ник Уайлд предлагает Джуди сэкономить и отказаться от ДМС перед рейдом. Экономим 200 💰?", 
      costYes: 200,
      costNo: -200,
      resultYes: "Сэкономил 200 💰. Но Джуди подвернула лапку, лечение — 800 💰!", 
      resultNo: "Купили полис за 200 💰. Джуди поранилась, страховая покрыла лечение полностью!",
      isYesCorrect: false
    },
    { 
      title: "Реальная жизнь",
      text: "Купил новый ноутбук. Менеджер предлагает страховку от залития за 300 💰. Согласиться?", 
      costYes: -300, 
      costNo: -1500, 
      resultYes: "Минус 300 💰. Кот перевернул кофе — замена платы покрыта!", 
      resultNo: "Сэкономил 300 💰. Но пролил чай — ремонт 1500 💰!",
      isYesCorrect: true
    },
    { 
      title: "Управление рисками",
      text: "Застраховать старый кнопочный телефон (цена 50 💰) от кражи за 40 💰. Берем?", 
      costYes: -40, 
      costNo: 0, 
      resultYes: "Потратил 40 💰 на страховку хлама. Невыгодно! Мелкие риски лучше принимать.", 
      resultNo: "Отказался. Правильно! Страховать дешевую вещь почти по её стоимости нет смысла.",
      isYesCorrect: false
    }
  ];

  // 📚 Термины (встроенные + пользовательские)
  const builtInTerms: TermData[] = [
    {
      term: "Страховщик",
      definition: "Официальная компания с гос. лицензией, которая продаёт страховки и выплачивает деньги при наступлении страхового случая.",
      example: "🏢 «АльфаСтрахование», «Ингосстрах», «Росгосстрах»",
      emoji: "🏢"
    },
    {
      term: "Страхователь",
      definition: "Клиент (человек или компания), который покупает полис и платит страховую премию.",
      example: "👤 Ты, твоя семья, твоя фирма — все можете быть страхователями",
      emoji: "👤"
    },
    {
      term: "Страховой полис",
      definition: "Официальный документ, подтверждающий договор страхования. В нём прописано: от чего защита, на какую сумму и на какой срок.",
      example: "📄 Бумажный или электронный (e-polis) — одинаковая сила",
      emoji: "📄"
    },
    {
      term: "Страховая премия",
      definition: "Сумма, которую ты платишь компании за полис. Именно из таких платежей формируется фонд для выплат.",
      example: "💰 Платишь 500₽/мес — получаешь защиту на 50 000₽",
      emoji: "💰"
    },
    {
      term: "Страховая сумма",
      definition: "Максимальный лимит выплаты по полису. Выплата не может быть больше этой суммы.",
      example: "🔝 Застраховал телефон на 30 000₽ — больше не выплатят, даже если ремонт дороже",
      emoji: "🔝"
    },
    {
      term: "Франшиза",
      definition: "Часть ущерба, которую ты оплачиваешь сам. Страховая платит только сумму сверх франшизы.",
      example: "✂️ Франшиза 3 000₽, ущерб 15 000₽ → страховая платит 12 000₽",
      emoji: "✂️"
    },
    {
      term: "ОСАГО",
      definition: "Обязательная страховка для всех водителей. Покрывает ущерб, который ты причинил ЧУЖОЙ машине, если виноват в ДТП.",
      example: "🔴 Виноват в аварии → ОСАГО чинит машину пострадавшего, а твою — ты сам",
      emoji: "🔴"
    },
    {
      term: "КАСКО",
      definition: "Добровольная страховка твоего собственного авто. Покрывает ремонт твоей машины даже если виноват ты.",
      example: "🟢 Въехал в столб? Упало дерево? КАСКО оплатит ремонт твоей тачки",
      emoji: "🟢"
    }
  ];

  const allTerms = [...builtInTerms, ...customTerms];
  const currentCards = mode === 'situations' ? situationCards : allTerms;
  const total = currentCards.length;

  // 🖱️ Логика свайпа мышью
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragStart && mode === 'situations' && !feedback) {
        const deltaX = e.clientX - dragStart.x;
        setDragOffset(deltaX);
      }
    };

    const handleMouseUp = () => {
      if (dragStart && mode === 'situations' && !feedback) {
        if (Math.abs(dragOffset) > 100) {
          handleSwipe(dragOffset > 0);
        }
        setDragStart(null);
        setDragOffset(0);
      }
    };

    if (dragStart) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStart, dragOffset, mode, feedback]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'situations' && !feedback) {
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleSwipe = (isYes: boolean) => {
    if (mode !== 'situations') return;
    
    const card = situationCards[index];
    const isCorrectDecision = isYes === card.isYesCorrect;
    
    let finalDelta = 0;
    if (isYes) {
      finalDelta = isCorrectDecision ? card.costYes : (card.costYes - 500);
    } else {
      finalDelta = isCorrectDecision ? card.costNo : (card.costNo - 800);
    }

    setBalance(balance + finalDelta);
    
    setFeedback({
      message: isYes ? card.resultYes : card.resultNo,
      delta: finalDelta,
      isCorrect: isCorrectDecision
    });
  };

  const handleTermComplete = () => {
    if (!completedTerms.includes(index)) {
      setCompletedTerms([...completedTerms, index]);
    }
    setShowTermDetails(false);
    nextCard();
  };

  const nextCard = () => {
    setFeedback(null);
    setShowTermDetails(false);
    setDragOffset(0);
    setDragStart(null);
    
    // 🔁 ФИЧА: если ситуации закончились — начинаем сначала
    if (mode === 'situations') {
      if (index + 1 >= situationCards.length) {
        setIndex(0);
        return;
      }
    }
    
    // Для терминов: обычная логика с завершением
    if (index + 1 < currentCards.length) {
      setIndex(index + 1);
    }
  };

  const prevCard = () => {
    setFeedback(null);
    setShowTermDetails(false);
    setDragOffset(0);
    setDragStart(null);
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const restartMode = () => {
    setIndex(0);
    setFeedback(null);
    setShowTermDetails(false);
    setDragOffset(0);
    setDragStart(null);
    if (mode === 'terms') {
      setCompletedTerms([]);
    }
  };

  const handleAddTerm = () => {
    if (newTerm.term && newTerm.definition) {
      setCustomTerms([...customTerms, { ...newTerm, isCustom: true }]);
      setNewTerm({ term: '', definition: '', example: '', emoji: '📝' });
      setShowEditor(false);
    }
  };

  const handleDeleteCustomTerm = (termIndex: number) => {
    if (termIndex >= builtInTerms.length) {
      const customIndex = termIndex - builtInTerms.length;
      setCustomTerms(customTerms.filter((_, i) => i !== customIndex));
    }
  };

  // 🏁 Экран завершения — ТОЛЬКО для режима терминов
  if (index >= currentCards.length && mode === 'terms' && mode !== 'editor') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 relative">
        <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors z-20">
          <ArrowLeft className="w-5 h-5"/> Выйти в меню
        </button>
        
        <div className="text-center space-y-8 max-w-md">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
            <Check className="w-12 h-12 text-white" />
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white mb-2">
              {mode === 'situations' ? 'Ситуации пройдены!' : 'Термины изучены!'}
            </h2>
            <p className="text-zinc-400">
              Ты освоил {total} {total === 1 ? 'карточку' : total < 5 ? 'карточки' : 'карточек'} 🎉
            </p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Прогресс</span>
              <span className="text-emerald-400 font-bold">{total}/{total} ✅</span>
            </div>
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-full" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={restartMode}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Повторить {mode === 'situations' ? 'ситуации' : 'термины'}
            </button>
            
            {mode === 'situations' && (
              <button 
                onClick={() => { setMode('terms'); setIndex(0); }}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" /> Перейти к терминам
              </button>
            )}
            
            {mode === 'terms' && (
              <button 
                onClick={() => { setMode('situations'); setIndex(0); }}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" /> Вернуться к ситуациям
              </button>
            )}
            
            <button 
              onClick={onBack}
              className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" /> В главное меню
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✏️ Режим редактора терминов
  if (mode === 'editor' || showEditor) {
    return (
      <div className="min-h-screen bg-zinc-950 relative overflow-y-auto">
        <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => { setShowEditor(false); setMode('terms'); }}
              className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5"/> Назад
            </button>
            <h2 className="text-white font-bold">Добавить термин</h2>
            <div className="w-20" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6 space-y-8">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2">Эмодзи</label>
              <input
                type="text"
                value={newTerm.emoji}
                onChange={(e) => setNewTerm({ ...newTerm, emoji: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="📝"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2">Термин *</label>
              <input
                type="text"
                value={newTerm.term}
                onChange={(e) => setNewTerm({ ...newTerm, term: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Например: Дедукция"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2">Определение *</label>
              <textarea
                value={newTerm.definition}
                onChange={(e) => setNewTerm({ ...newTerm, definition: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors min-h-[100px]"
                placeholder="Что это значит простыми словами?"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-sm font-bold mb-2">Пример (необязательно)</label>
              <textarea
                value={newTerm.example}
                onChange={(e) => setNewTerm({ ...newTerm, example: e.target.value })}
                className="w-full px-4 py-3 bg-zinc-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors min-h-[80px]"
                placeholder="💡 Пример из жизни..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => { setShowEditor(false); setMode('terms'); }}
                className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-5 h-5" /> Отмена
              </button>
              <button
                onClick={handleAddTerm}
                disabled={!newTerm.term || !newTerm.definition}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Сохранить
              </button>
            </div>
          </div>

          {customTerms.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-lg">Твои термины ({customTerms.length})</h3>
              {customTerms.map((term, i) => (
                <div key={i} className="bg-zinc-900/30 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{term.emoji}</span>
                    <div>
                      <p className="text-white font-bold">{term.term}</p>
                      <p className="text-zinc-500 text-sm line-clamp-1">{term.definition}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCustomTerm(builtInTerms.length + i)}
                    className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 🎮 Основной интерфейс
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-y-auto">
      {/* Декоративный фон */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
      </div>

      {/* 🔝 Хедер */}
      <div className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/80 hover:bg-zinc-800 text-white text-sm font-bold rounded-xl transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4"/> Выйти
          </button>
          
          <div className="flex bg-zinc-900/80 backdrop-blur-sm rounded-xl p-1 border border-white/10">
            <button
              onClick={() => { setMode('situations'); setIndex(0); setFeedback(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'situations' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🎮 Ситуации
            </button>
            <button
              onClick={() => { setMode('terms'); setIndex(0); setShowTermDetails(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                mode === 'terms' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📚 Термины
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {mode === 'terms' && (
              <button
                onClick={() => setShowEditor(true)}
                className="p-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-xl transition-all border border-purple-500/30"
                title="Добавить термин"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 bg-zinc-900/80 px-4 py-2 rounded-xl border border-white/10">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-black text-white">{balance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Прогресс-бар */}
      <div className="px-6 py-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-zinc-400">
              {mode === 'situations' ? 'Ситуация' : 'Термин'} {index + 1} из {total}
            </span>
            <span className={mode === 'terms' && completedTerms.includes(index) ? 'text-emerald-400' : 'text-zinc-500'}>
              {mode === 'terms' && completedTerms.includes(index) && '✅ Изучено'}
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                mode === 'situations' 
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500'
              }`}
              style={{ width: `${((index + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* 🃏 Контейнер карточки — БОЛЬШЕ ДЛЯ СИТУАЦИЙ */}
      <div className="px-6 pb-32">
        <div className={`mx-auto ${mode === 'situations' ? 'max-w-2xl' : 'max-w-sm'}`}>
          
          {/* 🎮 Карточка ситуации (свайп) — УВЕЛИЧЕНА */}
          {mode === 'situations' && (
            <div
              ref={cardRef}
              onMouseDown={handleMouseDown}
              className={`relative bg-gradient-to-b from-zinc-800 to-zinc-900 border border-white/10 rounded-3xl p-10 md:p-12 flex flex-col justify-center text-center shadow-2xl cursor-grab active:cursor-grabbing select-none transition-transform duration-200 min-h-[400px] ${
                feedback ? 'scale-95 opacity-40 blur-sm pointer-events-none' : ''
              }`}
              style={{ 
                transform: dragOffset ? `translateX(${dragOffset}px) rotate(${dragOffset * 0.1}deg)` : undefined,
                opacity: dragOffset ? Math.max(0.7, 1 - Math.abs(dragOffset) / 500) : 1
              }}
            >
              <div className="absolute top-6 left-0 right-0 flex justify-center">
                <span className="bg-zinc-950/50 text-zinc-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/5">
                  Ситуация {index + 1}/{total}
                </span>
              </div>
              <h3 className="text-emerald-400/80 text-sm font-bold uppercase tracking-widest mb-6">{situationCards[index].title}</h3>
              <h2 className="text-2xl md:text-3xl font-bold leading-relaxed text-white">
                {situationCards[index].text}
              </h2>
              
              {/* Индикаторы свайпа */}
              {dragOffset > 50 && (
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-xl font-bold border border-emerald-500/30 animate-pulse shadow-lg">
                  ✅ ДА
                </div>
              )}
              {dragOffset < -50 && (
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-red-500/20 text-red-400 px-5 py-2.5 rounded-xl font-bold border border-red-500/30 animate-pulse shadow-lg">
                  ❌ НЕТ
                </div>
              )}
            </div>
          )}

          {/* 📚 Карточка термина (компактная) */}
          {mode === 'terms' && (
            <div className="relative bg-gradient-to-b from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-8 flex flex-col shadow-2xl backdrop-blur-xl">
              <div className="absolute top-6 left-0 right-0 flex justify-center">
                <span className="bg-blue-950/50 text-blue-300 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-blue-500/20 flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3" /> Термин {index + 1}/{total}
                  {completedTerms.includes(index) && <Check className="w-3 h-3 text-emerald-400" />}
                  {allTerms[index].isCustom && <span className="text-purple-400">• Твой</span>}
                </span>
              </div>
              
              <div className="text-6xl mb-4">{allTerms[index].emoji}</div>
              <h3 className="text-2xl font-black text-white mb-4 text-center">
                {allTerms[index].term}
              </h3>
              
              {!showTermDetails ? (
                <button
                  onClick={() => setShowTermDetails(true)}
                  className="flex-1 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group min-h-[200px]"
                >
                  <BookOpen className="w-10 h-10 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <p className="text-zinc-300 font-medium">Нажми, чтобы увидеть определение</p>
                  <p className="text-zinc-500 text-sm mt-2">👆</p>
                </button>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Определение
                    </p>
                    <p className="text-white leading-relaxed">
                      {allTerms[index].definition}
                    </p>
                  </div>
                  
                  {allTerms[index].example && (
                    <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-4">
                      <p className="text-purple-200 text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        💡 Пример
                      </p>
                      <p className="text-zinc-200 leading-relaxed">
                        {allTerms[index].example}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={prevCard}
                  disabled={index === 0}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Назад
                </button>
                
                <button
                  onClick={handleTermComplete}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {completedTerms.includes(index) ? (
                    <><Check className="w-4 h-4" /> Повторить</>
                  ) : (
                    <><Check className="w-4 h-4" /> Запомнил!</>
                  )}
                </button>
                
                <button
                  onClick={nextCard}
                  disabled={index >= total - 1}
                  className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  Далее <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 🎁 Фидбек после свайпа */}
          {mode === 'situations' && feedback && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className={`w-full max-w-lg p-10 rounded-3xl shadow-2xl border backdrop-blur-xl flex flex-col items-center text-center ${
                feedback.isCorrect 
                  ? 'bg-emerald-950/90 border-emerald-500/30' 
                  : 'bg-red-950/90 border-red-500/30'
              }`}>
                
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
                  feedback.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {feedback.isCorrect ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
                </div>

                <h3 className={`text-3xl font-black mb-4 ${feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                  {feedback.isCorrect ? 'Грамотное решение!' : 'Финансовая ошибка!'}
                </h3>
                
                <p className="text-zinc-200 text-xl leading-relaxed mb-8">
                  {feedback.message}
                </p>

                <div className="bg-zinc-950/50 px-8 py-4 rounded-2xl flex items-center gap-4 mb-8 border border-white/5">
                  <span className="text-zinc-400 font-medium">Баланс:</span>
                  <span className={`font-black text-2xl ${feedback.delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {feedback.delta > 0 ? '+' : ''}{feedback.delta} 💰
                  </span>
                </div>

                <button 
                  onClick={nextCard}
                  className="w-full py-5 rounded-xl font-bold text-zinc-950 bg-white hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  {index + 1 < total ? 'Следующая ситуация' : 'Завершить'} <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🎮 Кнопки свайпа (резервные) */}
      {mode === 'situations' && !feedback && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-8 px-6 pointer-events-none">
          <button 
            onClick={() => handleSwipe(false)} 
            className="pointer-events-auto w-16 h-16 bg-red-500/10 border-2 border-red-500/50 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
          >
            <X className="w-8 h-8" />
          </button>
          <button 
            onClick={() => handleSwipe(true)} 
            className="pointer-events-auto w-16 h-16 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
          >
            <Check className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}