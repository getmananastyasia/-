import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send, CheckCheck } from "lucide-react";

interface Hero {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

interface Message {
  id: number;
  sender: Hero;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface Question {
  id: number;
  hero: Hero;
  question: string;
  options: {
    text: string;
    correct: boolean;
    successReply: string;
    failReply: string;
  }[];
  reward: number;
  penalty: number;
}

interface GameProps {
  balance: number;
  setBalance: (val: number) => void;
  onBack: () => void;
}

export function ChatGame({ balance, setBalance, onBack }: GameProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [answered, setAnswered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Герои Мстителей
  const heroes: Hero[] = [
    { id: 'ironman', name: 'Тони Старк', avatar: '🤖', color: '#FF3B30' },
    { id: 'cap', name: 'Стив Роджерс', avatar: '🛡️', color: '#007AFF' },
    { id: 'thor', name: 'Тор', avatar: '⚡', color: '#5856D6' },
    { id: 'spidey', name: 'Питер Паркер', avatar: '🕷️', color: '#FF2D55' },
    { id: 'hulk', name: 'Брюс Бэннер', avatar: '💚', color: '#34C759' },
    { id: 'natasha', name: 'Наташа Романофф', avatar: '🔴', color: '#AF52DE' },
    { id: 'clint', name: 'Клинт Бартон', avatar: '🏹', color: '#FF9500' },
  ];

  // Вопросы от героев
  const questions: Question[] = [
    {
      id: 1,
      hero: heroes[0], // Тони
      question: "Ребята, Кэп въехал в мой Ламборгини. У меня ОСАГО — страховая мне заплатит за ремонт?",
      options: [
        {
          text: "Да, ОСАГО покроет ремонт твоей машины!",
          correct: false,
          successReply: "",
          failReply: "🤦 Тони: Нет, бро! ОСАГО страхует МОЮ ответственность перед другими. Чтобы чинили МОЮ тачку — нужно КАСКО. -200 💰"
        },
        {
          text: "Нет, ОСАГО Кэпа покроет твой ущерб, если он виноват.",
          correct: true,
          successReply: "🎯 Тони: Точно! Вытряс с его страховой. Лови +300 💰 за помощь!",
          failReply: ""
        }
      ],
      reward: 300,
      penalty: 200
    },
    {
      id: 2,
      hero: heroes[3], // Питер
      question: "Привет всем! Я разбил телефон, когда ловил преступника. Страховка имущества сработает?",
      options: [
        {
          text: "Да, страховка имущества покрывает любые поломки!",
          correct: false,
          successReply: "",
          failReply: "🕷️ Питер: Не-а, в полисе 'исключение: профессиональный риск'. Геройская деятельность не покрывается. -150 💰"
        },
        {
          text: "Проверь условия: героическая деятельность может быть исключением.",
          correct: true,
          successReply: "✨ Питер: Точно! Нашёл пункт. В следующий раз возьму спец.страховку для героев. +200 💰!",
          failReply: ""
        }
      ],
      reward: 200,
      penalty: 150
    },
    {
      id: 3,
      hero: heroes[2], // Тор
      question: "Друзья, мой молот Мьёльнир украли! У меня страховка от кражи — что делать?",
      options: [
        {
          text: "Сразу пиши в страховую, молот вернут!",
          correct: false,
          successReply: "",
          failReply: "⚡ Тор: Страховая требует протокол полиции и оценку! Без документов — отказ. -250 💰"
        },
        {
          text: "Сначала заявление в полицию, потом документы в страховую.",
          correct: true,
          successReply: "🔨 Тор: Мудро! С документами всё выплатили. Держи +350 💰!",
          failReply: ""
        }
      ],
      reward: 350,
      penalty: 250
    },
    {
      id: 4,
      hero: heroes[1], // Стив
      question: "Команда, мой щит поцарапался на тренировке. Это страховой случай?",
      options: [
        {
          text: "Да, любые повреждения — страховой случай!",
          correct: false,
          successReply: "",
          failReply: "🛡️ Стив: В полисе франшиза 5000₽. Царапина = 2000₽ — страховая не платит. Сам починил. -100 💰"
        },
        {
          text: "Проверь франшизу: если ущерб меньше — страховая не платит.",
          correct: true,
          successReply: "✅ Стив: Верно! Франшиза 5к, ремонт 2к — сам справился. Но совет ценный, +150 💰!",
          failReply: ""
        }
      ],
      reward: 150,
      penalty: 100
    },
    {
      id: 5,
      hero: heroes[4], // Брюс
      question: "Ребята, Халк случайно разрушил лабораторию. Страховка ответственности поможет?",
      options: [
        {
          text: "Нет, умышленный ущерб не покрывается!",
          correct: false,
          successReply: "",
          failReply: "💚 Брюс: Это был несчастный случай! После экспертизы страховая выплатила. Ты ошибся. -200 💰"
        },
        {
          text: "Да, если это несчастный случай — страховка ответственности сработает.",
          correct: true,
          successReply: "🧪 Брюс: Экспертиза подтвердила: неумышленно. Всё покрыли. Спасибо, +250 💰!",
          failReply: ""
        }
      ],
      reward: 250,
      penalty: 200
    },
    {
      id: 6,
      hero: heroes[5], // Наташа
      question: "Всем привет! Меня укусила радиоактивная паука... это покрывает личная страховка?",
      options: [
        {
          text: "Да, личная страховка покрывает любые травмы!",
          correct: false,
          successReply: "",
          failReply: "🔴 Наташа: В договоре исключение: 'супергеройские инциденты'. Нужна спец.страховка. -180 💰"
        },
        {
          text: "Проверь исключения: супергеройские случаи могут не покрываться.",
          correct: true,
          successReply: "🎯 Наташа: Точно! Нашла пункт. Оформлю доп.покрытие. +220 💰 за совет!",
          failReply: ""
        }
      ],
      reward: 220,
      penalty: 180
    },
    {
      id: 7,
      hero: heroes[6], // Клинт
      question: "Ребят, моя стрела пробила окно соседа. Страховка ответственности сработает?",
      options: [
        {
          text: "Нет, это умышленный ущерб — не покрывается!",
          correct: false,
          successReply: "",
          failReply: "🏹 Клинт: Я же не специально! Это несчастный случай на тренировке. Страховая выплатила. -120 💰"
        },
        {
          text: "Да, если это несчастный случай — страховка ответственности покроет.",
          correct: true,
          successReply: "✅ Клинт: Точно! Всё оплатили. Спасибо, консультант! +180 💰",
          failReply: ""
        }
      ],
      reward: 180,
      penalty: 120
    }
  ];

  // Прокрутка вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showOptions]);

  // Добавляем первое сообщение при загрузке
  useEffect(() => {
    if (questions.length > 0 && messages.length === 0) {
      addHeroMessage(questions[0]);
    }
  }, []);

  const addHeroMessage = (question: Question) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: question.hero,
      text: question.question,
      isUser: false,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }]);
    setShowOptions(true);
    setAnswered(false);
  };

  const handleAnswer = (optionIndex: number) => {
    if (answered) return;
    
    const question = questions[currentQuestionIndex];
    const option = question.options[optionIndex];
    const isCorrect = option.correct;
    
    // Добавляем ответ пользователя
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: { id: 'me', name: 'Вы', avatar: '👤', color: '#007AFF' },
      text: option.text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    }]);
    
    setShowOptions(false);
    setAnswered(true);
    
    // Имитация "печатает..."
    setTimeout(() => {
      const reply = isCorrect ? option.successReply : option.failReply;
      
      setMessages(prev => [...prev, {
        id: Date.now() + 2,
        sender: question.hero,
        text: reply,
        isUser: false,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      }]);
      
      // Обновляем баланс
      setBalance(prev => prev + (isCorrect ? question.reward : -question.penalty));
      
      // Следующий вопрос или завершение
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setTimeout(() => addHeroMessage(questions[currentQuestionIndex + 1]), 800);
        } else {
          // Финальное сообщение
          setMessages(prev => [...prev, {
            id: Date.now() + 3,
            sender: { id: 'system', name: 'Система', avatar: '🏆', color: '#FFD600' },
            text: `🎉 Сессия завершена! Все вопросы обработаны. Возврат в меню...`,
            isUser: false,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
          }]);
          setTimeout(onBack, 2500);
        }
      }, 1500);
    }, 1000);
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto font-sans relative">
      
      {/* Статус-бар iPhone */}
      <div className="bg-white px-4 py-2 flex items-center justify-between text-black text-xs sticky top-0 z-20">
        <span className="font-semibold">{formatTime()}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs">📶</span>
          <span className="text-xs">🔋 100%</span>
        </div>
      </div>

      {/* Хедер группового чата */}
      <div className="bg-white/95 backdrop-blur-sm px-3 py-2.5 flex items-center gap-3 sticky top-8 z-10 border-b border-gray-200">
        <button onClick={onBack} className="text-blue-500 hover:text-blue-600 transition-colors -ml-1">
          <ArrowLeft className="w-6 h-6"/>
        </button>
        
        {/* Аватарки группы */}
        <div className="flex -space-x-2">
          {heroes.slice(0, 4).map(hero => (
            <div 
              key={hero.id}
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-sm shadow-sm"
              style={{ backgroundColor: hero.color + '20' }}
              title={hero.name}
            >
              {hero.avatar}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 shadow-sm">
            +3
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-black truncate">Мстители: Чат</p>
          <p className="text-xs text-gray-500">7 участников • онлайн</p>
        </div>
        
        {/* Баланс */}
        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
          <span className="text-amber-500 text-sm font-bold">{balance}</span>
          <span className="text-xs">💰</span>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-white">
        {/* Дата */}
        <div className="flex justify-center my-3">
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
            Сегодня
          </span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.isUser;
          const isSystem = msg.sender.id === 'system';
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
            >
              {/* Аватарка для входящих */}
              {!isUser && !isSystem && (
                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 shadow-sm"
                  style={{ backgroundColor: msg.sender.color + '25' }}
                  title={msg.sender.name}
                >
                  {msg.sender.avatar}
                </div>
              )}
              
              {/* Пузырь сообщения */}
              <div className={`max-w-[78%] ${isUser ? 'order-1' : ''}`}>
                {/* Имя отправителя для группового чата */}
                {!isUser && !isSystem && (
                  <p className="text-xs font-semibold text-gray-700 ml-1 mb-0.5">
                    {msg.sender.name}
                  </p>
                )}
                
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isUser 
                    ? 'bg-blue-500 text-white rounded-br-md' 
                    : isSystem
                      ? 'bg-amber-100 text-amber-900 rounded-bl-md border border-amber-200'
                      : 'bg-[#4CD964] text-white rounded-bl-md'
                }`}>
                  {msg.text}
                </div>
                
                {/* Время и статус */}
                <div className={`text-[10px] text-gray-400 mt-1 flex items-center gap-1 ${isUser ? 'justify-end mr-1' : 'ml-1'}`}>
                  {msg.timestamp}
                  {isUser && <CheckCheck className="w-3 h-3 text-blue-200"/>}
                </div>
              </div>
              
              {/* Пустое место для аватара исходящих */}
              {isUser && <div className="w-9"/>}
            </div>
          );
        })}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Панель ответов */}
      {showOptions && !answered && (
        <div className="bg-gray-50 border-t border-gray-200 p-3 pb-5 sticky bottom-0 z-10">
          <p className="text-xs text-gray-500 mb-2.5 px-1 font-medium">Выберите ответ:</p>
          <div className="space-y-2">
            {questions[currentQuestionIndex]?.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full text-left p-3.5 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900 rounded-xl transition-all border border-gray-200 text-sm leading-relaxed shadow-sm active:scale-[0.99]"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Декоративное поле ввода */}
      {(!showOptions || answered) && (
        <div className="bg-gray-50 border-t border-gray-200 p-3 pb-5 sticky bottom-0 z-10">
          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2.5 shadow-sm border border-gray-200">
            <input 
              type="text" 
              disabled 
              placeholder="Напишите сообщение..." 
              className="flex-1 bg-transparent text-sm text-gray-400 placeholder-gray-400 outline-none"
            />
            <button className="text-blue-500 opacity-40">
              <Send className="w-5 h-5"/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}