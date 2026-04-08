import { useState } from "react";
import { 
  ArrowLeft, 
  Shield, 
  Building, 
  HeartPulse, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown 
} from "lucide-react";

interface GameProps {
  balance: number;
  setBalance: (val: number | ((prev: number) => number)) => void;
  onBack: () => void;
}

type Phase = "planning" | "results" | "gameover" | "victory";
type PolicyType = "property" | "health" | "liability";

type LogItem = {
  text: string;
  type: "income" | "expense" | "disaster" | "saved";
};

const MONTHLY_INCOME = 1000;
const MAX_MONTHS = 12;

const POLICIES = {
  property: { id: "property", name: "Имущество", cost: 200, icon: <Building className="size-5" />, desc: "Покрывает разрушение базы" },
  health: { id: "health", name: "Здоровье", cost: 150, icon: <HeartPulse className="size-5" />, desc: "Оплачивает лечение героев" },
  liability: { id: "liability", name: "Ответственность", cost: 250, icon: <Scale className="size-5" />, desc: "Защита от судебных исков" },
};

const DISASTERS = [
  { text: "Халк в ярости разнес тренировочный зал", cost: 900, type: "property" },
  { text: "Тор случайно пробил крышу Мьёльниром", cost: 600, type: "property" },
  { text: "База атакована дронами Альтрона", cost: 1200, type: "property" },
  { text: "Человек-паук сильно отравился шаурмой", cost: 400, type: "health" },
  { text: "Тони Старк получил ожоги при испытании брони", cost: 800, type: "health" },
  { text: "Мэрия Нью-Йорка подала иск за разрушенный мост", cost: 1500, type: "liability" },
  { text: "Граждане требуют компенсацию за моральный ущерб", cost: 700, type: "liability" },
];

export function SimulatorGame({ balance, setBalance, onBack }: GameProps) {
  const [phase, setPhase] = useState<Phase>("planning");
  const [month, setMonth] = useState(1);
  const [activePolicies, setActivePolicies] = useState<Record<PolicyType, boolean>>({
    property: false,
    health: false,
    liability: false,
  });
  const [monthlyLog, setMonthlyLog] = useState<LogItem[]>([]);

  const togglePolicy = (type: PolicyType) => {
    setActivePolicies((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const totalInsuranceCost = Object.entries(activePolicies).reduce(
    (acc, [key, isActive]) => acc + (isActive ? POLICIES[key as PolicyType].cost : 0),
    0
  );

  const startMonth = () => {
    const logs: LogItem[] = [];
    let currentBalance = balance;

    // 1. Начисление дохода
    currentBalance += MONTHLY_INCOME;
    logs.push({ text: `Базовый доход: +${MONTHLY_INCOME} 💰`, type: "income" });

    // 2. Оплата страховок
    if (totalInsuranceCost > 0) {
      currentBalance -= totalInsuranceCost;
      logs.push({ text: `Оплата страховых полисов: -${totalInsuranceCost} 💰`, type: "expense" });
    }

    // 3. Генерация событий (от 0 до 2 событий в месяц)
    const eventCount = Math.floor(Math.random() * 3); 
    
    // Перемешиваем массив катастроф, чтобы брать случайные
    const shuffledDisasters = [...DISASTERS].sort(() => 0.5 - Math.random());
    const eventsThisMonth = shuffledDisasters.slice(0, eventCount);

    if (eventsThisMonth.length === 0) {
      logs.push({ text: "Месяц прошел спокойно. Никаких происшествий!", type: "saved" });
    }

    eventsThisMonth.forEach((event) => {
      if (activePolicies[event.type as PolicyType]) {
        // Ущерб покрыт страховкой
        logs.push({
          text: `⚡ ${event.text}. Ущерб ${event.cost} 💰 ПОЛНОСТЬЮ ПОКРЫТ СТРАХОВКОЙ ✅`,
          type: "saved",
        });
      } else {
        // Страховки нет, платим из кармана
        currentBalance -= event.cost;
        logs.push({
          text: `🔥 ${event.text}. У ВАС НЕТ СТРАХОВКИ! Потери: -${event.cost} 💰`,
          type: "disaster",
        });
      }
    });

    setBalance(currentBalance);
    setMonthlyLog(logs);

    // 4. Проверка условий победы/поражения
    if (currentBalance <= 0) {
      setPhase("gameover");
    } else if (month >= MAX_MONTHS) {
      setPhase("victory");
    } else {
      setPhase("results");
    }
  };

  const nextMonth = () => {
    setMonth((m) => m + 1);
    setPhase("planning");
  };

  const resetGame = () => {
    setBalance(2000); // Возвращаем стартовый баланс (настрой под себя)
    setMonth(1);
    setActivePolicies({ property: false, health: false, liability: false });
    setPhase("planning");
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 flex justify-center font-sans text-zinc-100">
      <div className="w-full max-w-3xl flex flex-col gap-8">
        
        {/* HEADER */}
        <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-2xl border border-zinc-800 shadow-lg">
          <button onClick={onBack} className="text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="size-5" /> Выйти
          </button>
          
          <div className="flex gap-6 items-center">
            <div className="flex flex-col items-end">
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Месяц</span>
              <span className="text-xl font-bold text-white">{month} / {MAX_MONTHS}</span>
            </div>
            <div className="w-px h-8 bg-zinc-800" />
            <div className="flex flex-col items-end">
              <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Бюджет</span>
              <span className={`text-xl font-bold ${balance > 1000 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {balance} 💰
              </span>
            </div>
          </div>
        </div>

        {/* PHASE: УПРАВЛЕНИЕ РИСКАМИ */}
        {phase === "planning" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Управление рисками</h2>
              <p className="text-zinc-400">Выберите страховые полисы на этот месяц. Если произойдет катастрофа без страховки, вы оплатите ущерб из своего кармана.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {(Object.keys(POLICIES) as PolicyType[]).map((key) => {
                const policy = POLICIES[key];
                const isActive = activePolicies[key];
                return (
                  <button
                    key={key}
                    onClick={() => togglePolicy(key)}
                    className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col gap-3
                      ${isActive 
                        ? "bg-zinc-800/80 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]" 
                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                      }`}
                  >
                    {isActive && (
                      <div className="absolute top-4 right-4 text-blue-500">
                        <CheckCircle2 className="size-5" />
                      </div>
                    )}
                    <div className={`p-3 w-fit rounded-xl ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {policy.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white">{policy.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1 h-8">{policy.desc}</p>
                    </div>
                    <div className="mt-auto pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                      <span className="text-sm font-medium text-zinc-300">Стоимость:</span>
                      <span className="font-bold text-yellow-500">{policy.cost} 💰</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-zinc-400 text-sm">Прогнозируемый чистый доход:</p>
                <p className="text-2xl font-bold text-emerald-400">
                  +{MONTHLY_INCOME - totalInsuranceCost} 💰
                </p>
              </div>
              <button
                onClick={startMonth}
                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors active:scale-95"
              >
                Начать месяц ▶
              </button>
            </div>
          </div>
        )}

        {/* PHASE: РЕЗУЛЬТАТЫ МЕСЯЦА */}
        {phase === "results" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-3xl font-black text-white">Сводка за месяц</h2>
            
            <div className="space-y-3 bg-zinc-900 p-2 rounded-2xl border border-zinc-800">
              {monthlyLog.map((log, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl flex gap-4 items-start
                    ${log.type === "income" ? "bg-emerald-500/10 text-emerald-300" : ""}
                    ${log.type === "expense" ? "bg-zinc-800 text-zinc-300" : ""}
                    ${log.type === "disaster" ? "bg-red-500/10 text-red-400 border border-red-500/20" : ""}
                    ${log.type === "saved" ? "bg-blue-500/10 text-blue-300 border border-blue-500/20" : ""}
                  `}
                >
                  {log.type === "income" && <TrendingUp className="shrink-0" />}
                  {log.type === "expense" && <TrendingDown className="shrink-0" />}
                  {log.type === "disaster" && <AlertTriangle className="shrink-0" />}
                  {log.type === "saved" && <Shield className="shrink-0" />}
                  <span className="font-medium leading-tight">{log.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={nextMonth}
              className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors active:scale-95"
            >
              Перейти к следующему месяцу ➡
            </button>
          </div>
        )}

        {/* GAME OVER */}
        {phase === "gameover" && (
          <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center p-6 bg-red-500/20 text-red-500 rounded-full mb-4">
              <AlertTriangle className="size-16" />
            </div>
            <h2 className="text-4xl font-black text-white">Банкротство!</h2>
            <p className="text-zinc-400 max-w-md mx-auto text-lg">
              Вы не смогли покрыть убытки, и ваша организация признана банкротом на {month} месяце. Экономия на страховке вышла боком.
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-4 mt-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* VICTORY */}
        {phase === "victory" && (
          <div className="text-center py-20 space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center p-6 bg-emerald-500/20 text-emerald-400 rounded-full mb-4">
              <Shield className="size-16" />
            </div>
            <h2 className="text-4xl font-black text-white">Выживание успешно!</h2>
            <p className="text-zinc-400 max-w-md mx-auto text-lg">
              Поздравляем! Вы успешно управляли рисками целый год и сохранили капитал. <br/>
              Ваш итоговый счет: <span className="text-yellow-400 font-bold">{balance} 💰</span>
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-4 mt-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors"
            >
              Играть заново
            </button>
          </div>
        )}

      </div>
    </div>
  );
}