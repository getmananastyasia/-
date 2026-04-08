import { useState } from "react";
import { ArrowLeft, ShoppingCart, Star, Zap, Shield } from "lucide-react";

interface ShopProps {
  onBack: () => void;
}

export function Shop({ onBack }: ShopProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const items = [
    { id: 1, name: "Премиум аккаунт", price: 1000, icon: Star, color: "from-yellow-400 to-orange-500", desc: "Уникальный бейдж в профиле" },
    { id: 2, name: "Двойной опыт", price: 500, icon: Zap, color: "from-cyan-400 to-blue-500", desc: "x2 XP на 24 часа" },
    { id: 3, name: "Щит защиты", price: 300, icon: Shield, color: "from-emerald-400 to-green-600", desc: "Защита от потери монет 1 раз" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 relative overflow-hidden">
      {/* Фоновые пятна для усиления эффекта стекла */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Кнопка назад */}
        <button 
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <div className="p-2 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Назад в меню</span>
        </button>

        {/* === ГЛАВНАЯ "КАПЛЯ" МАГАЗИНА === */}
        <div className="relative bg-zinc-900/30 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Блик сверху (эффект стекла) */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-yellow-400" />
              Магазин
            </h1>
            <p className="text-zinc-400 mb-8">Потрать монеты на улучшения и косметик</p>

            {/* Сетка товаров */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    {/* Внутренний блик карточки */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent rounded-t-3xl pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-zinc-400 mb-4 h-8">{item.desc}</p>
                      
                      <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 group-active:scale-95">
                        <span>Купить</span>
                        <span className="bg-black/20 px-2 py-0.5 rounded-md text-sm">{item.price} 💰</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}