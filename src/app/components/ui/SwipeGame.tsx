import { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";

export function SwipeGame({ balance, setBalance, onBack }: any) {
  const [index, setIndex] = useState(0);
  
  const cards = [
    { text: "Питер Паркер предлагает сэкономить и НЕ страховать новый костюм. Экономим 50 💰?", costYes: 50, costNo: -500, resultYes: "Ты сэкономил 50 монет, но завтра Доктор Октавиус порвал костюм. Ремонт: -500 💰", resultNo: "Ты заставил его купить полис. Минус 50 монет, но страховая оплатила ремонт!" },
    { text: "Застраховать кваджоптер Сокола от столкновения со зданиями за 100 💰?", costYes: -100, costNo: -300, resultYes: "Дрон разбился о башню Старка. Страховая возместила всё! (Потрачено только 100 на полис)", resultNo: "Дрон разбит. Пришлось покупать новый за свои деньги. Минус 300 💰." }
  ];

  const handleSwipe = (isYes: boolean) => {
    const card = cards[index];
    setBalance(balance + (isYes ? card.costYes : card.costNo));
    alert(isYes ? card.resultYes : card.resultNo);
    if (index + 1 < cards.length) setIndex(index + 1);
    else onBack();
  };

  if (index >= cards.length) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950">
      <button onClick={onBack} className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500"><ArrowLeft className="w-5 h-5"/> Выход</button>
      <div className="absolute top-8 right-8 text-2xl font-black text-yellow-500">{balance} 💰</div>
      
      <div className="w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl p-8 aspect-[3/4] flex flex-col justify-center text-center shadow-2xl relative">
        <div className="text-zinc-500 mb-4 text-sm font-bold tracking-widest">КАРТА {index + 1}/{cards.length}</div>
        <h2 className="text-2xl font-bold leading-relaxed">{cards[index].text}</h2>
      </div>

      <div className="flex gap-8 mt-12">
        <button onClick={() => handleSwipe(false)} className="w-20 h-20 bg-red-500/10 border border-red-500 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all hover:scale-110">
          <X className="w-10 h-10" />
        </button>
        <button onClick={() => handleSwipe(true)} className="w-20 h-20 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all hover:scale-110">
          <Check className="w-10 h-10" />
        </button>
      </div>
    </div>
  );
}