import { useState, useEffect } from "react";
import { 
  Shield, DollarSign, AlertTriangle, ArrowRight, BrainCircuit, CheckCircle2,
  HelpCircle, XCircle, Zap, Users, FileText, ShieldAlert, Wallet,
  Scissors, LockKeyhole, Unlock, Trophy, Award, Star, Car, Sparkles,
  BookOpen, Lightbulb, Flame, Target, ChevronRight, RefreshCw, Sparkle,
  ShoppingBag, User, Coins
} from "lucide-react";
import { useAuth } from '../hooks/useAuth';

interface TheoryScreenProps {
  onComplete: () => void;
  onOpenShop?: () => void;
  onOpenProfile?: () => void;
}

export function TheoryScreen({ onComplete, onOpenShop, onOpenProfile }: TheoryScreenProps) {
  const { user, updateUser } = useAuth();
  
  const [openCard, setOpenCard] = useState<number | null>(null);
  const [completedCards, setCompletedCards] = useState<number[]>([]);
  const [quizActiveFor, setQuizActiveFor] = useState<number | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<{message: string, isError: boolean} | null>(null);
  
  // Геймификация
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [lastAnswerTime, setLastAnswerTime] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hintUsed, setHintUsed] = useState<{[key: string]: boolean}>({});
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const HINT_COST = 50;

  // Отслеживание мыши для параллакс-эффекта фона
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

  // Загрузка прогресса из Firebase
  useEffect(() => {
    if (user?.progress?.completedCards) {
      setCompletedCards(user.progress.completedCards);
    }
    if (user?.xp !== undefined) setXp(user.xp);
    if (user?.coins !== undefined) setCoins(user.coins);
    if (user?.achievements) setAchievements(user.achievements);
  }, [user]);

  const MIN_BLOCKS_TO_UNLOCK = 3;
  const canProceed = completedCards.length >= MIN_BLOCKS_TO_UNLOCK;

  const getLevel = (currentXp: number) => {
    if (currentXp < 100) return { title: "Новичок 👶", nextAt: 100, color: "from-blue-400/80 to-cyan-500/80", level: 1 };
    if (currentXp < 300) return { title: "Продвинутый 🤓", nextAt: 300, color: "from-blue-500/80 to-blue-600/80", level: 2 };
    if (currentXp < 600) return { title: "Эксперт 🕵️‍♂️", nextAt: 600, color: "from-indigo-400/80 to-indigo-500/80", level: 3 };
    return { title: "Легенда 🦸‍♂️", nextAt: 1000, color: "from-cyan-400/80 to-teal-500/80", level: 4 };
  };

  const currentLevel = getLevel(xp);
  const xpToNext = currentLevel.nextAt - xp;
  const xpProgress = Math.min(100, (xp / currentLevel.nextAt) * 100);

  useEffect(() => {
    const now = Date.now();
    if (now - lastAnswerTime < 5000) {
      setStreak(prev => Math.min(prev + 1, 5));
    } else {
      setStreak(0);
    }
    setLastAnswerTime(now);
  }, [currentScore, lastAnswerTime]);

  useEffect(() => {
    if (xp >= currentLevel.nextAt && xp - 20 < currentLevel.nextAt) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [xp, currentLevel.nextAt]);

  const handleCardClick = (index: number) => {
    if (openCard === index) {
      setOpenCard(null); 
      setQuizActiveFor(null);
      setQuizFeedback(null);
    } else {
      setOpenCard(index); 
      setQuizActiveFor(null);
      setQuizFeedback(null);
      const newHintUsed = { ...hintUsed };
      Object.keys(newHintUsed).forEach(key => {
        if (key.startsWith(`${index}:`)) delete newHintUsed[key];
      });
      setHintUsed(newHintUsed);
    }
  };

  const startQuiz = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQuizActiveFor(index);
    setCurrentQIndex(0);
    setCurrentScore(0);
    setQuizFeedback(null);
    const newHintUsed = { ...hintUsed };
    Object.keys(newHintUsed).forEach(key => {
      if (key.startsWith(`${index}:`)) delete newHintUsed[key];
    });
    setHintUsed(newHintUsed);
  };

  const handleAnswer = (isCorrect: boolean, theoryIndex: number) => {
    const newScore = currentScore + (isCorrect ? 1 : 0);
    setCurrentScore(newScore);
    const totalQuestions = theories[theoryIndex].quiz.length;

    const xpBonus = isCorrect ? 20 + (streak * 2) : 0;
    const coinBonus = isCorrect ? 10 : 0;
    
    if (isCorrect && user) {
      const newXP = user.xp + xpBonus;
      const newCoins = (user.coins || 0) + coinBonus;
      const newAchievements = [...(user.achievements || [])];
      
      if (newXP >= 100 && !newAchievements.includes('Опытный боец ⚔️')) newAchievements.push('Опытный боец ⚔️');
      if (newXP >= 500 && !newAchievements.includes('Мастер финансов 💎')) newAchievements.push('Мастер финансов 💎');
      if (newXP >= 1000 && !newAchievements.includes('Волк с Уолл-Стрит 🐺')) newAchievements.push('Волк с Уолл-Стрит 🐺');
      
      updateUser({ xp: newXP, coins: newCoins, achievements: newAchievements });
      setCoins(newCoins);
    }

    if (currentQIndex + 1 < totalQuestions) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      if (newScore >= Math.ceil(totalQuestions / 2)) { 
        if (!completedCards.includes(theoryIndex) && user) {
          const newCompleted = [...completedCards, theoryIndex];
          const newAchievements = [...(user.achievements || [])];
          
          if (!newAchievements.includes("Первый шаг 🏁")) newAchievements.push("Первый шаг 🏁");
          if (newScore === totalQuestions && !newAchievements.includes("Идеально! 🎯")) newAchievements.push("Идеально! 🎯");
          if (newCompleted.length === 3 && !newAchievements.includes("Три мушкетёра ⚔️")) {
            newAchievements.push("Три мушкетёра ⚔️");
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
          }
          
          const completionBonus = 50 + (newScore === totalQuestions ? 25 : 0);
          
          updateUser({
            progress: { ...user.progress, completedCards: newCompleted },
            achievements: newAchievements,
            xp: user.xp + completionBonus,
            coins: (user.coins || 0) + 25
          });
        }
        
        setQuizActiveFor(null);
        setQuizFeedback({ 
          message: `Тест сдан! ${newScore}/${totalQuestions}. Блок освоен! ✅`, 
          isError: false 
        });
      } else {
        setQuizActiveFor(null);
        setQuizFeedback({ 
          message: `Нужно ещё чуть-чуть! (${newScore}/${totalQuestions}). Минимум ${Math.ceil(totalQuestions / 2)} верных. Перечитай теорию!`, 
          isError: true 
        });
      }
    }
  };

  const getHintKey = (cardIndex: number, questionIndex: number) => `${cardIndex}:${questionIndex}`;

  const theories = [
    {
      icon: Users,
      title: "Страховщик и Страхователь",
      subtitle: "УЧАСТНИКИ",
      description: "Страховщик — это всегда официальная компания (юридическое лицо), у которой есть специальная государственная лицензия на продажу страховок. Просто богатый сосед или банк без лицензии не могут быть страховщиками. Страхователь — это клиент, который покупает полис. Им может быть как обычный человек (физлицо), так и целая компания.",
      example: "Apple покупает страховку для своих новых заводов у компании «АльфаСтрахование». В этом случае Apple — это страхователь (клиент-юрлицо), а «АльфаСтрахование» — лицензированный страховщик.",
      association: "🕷️ Как в Марвел: Страховщик = Щ.И.Т. 🛡️ (официальная организация с лицензией), Страхователь = Тони Старк 💼 (покупает защиту для своей брони). Без лицензии Щ.И.Т.а — никакой супергеройской защиты не будет!",
      color: "yellow",
      miniCheatSheet: [
        "🏢 Страховщик = только компания с гос. лицензией",
        "👤 Страхователь = ты или твоя фирма",
        "📄 Полис = ваш официальный договор",
        "❌ Богатый сосед ≠ страховщик (нет лицензии)"
      ],
      quiz: [
        { q: "Кто такой страховщик в мире финансов?", options: ["Любой человек с деньгами", "Организация с лицензией", "Государственный банк"], correct: 1, hint: "Подумай: кто выдаёт суперсилы в Марвел? Только Щ.И.Т. с лицензией! 🛡️" },
        { q: "Кем является клиент, который пришел покупать полис?", options: ["Страхователем", "Страховщиком", "Бенефициаром"], correct: 0, hint: "Тони Старк покупает защиту — он кто? Страхователь! 💼" },
        { q: "Может ли твой богатый сосед стать страховщиком для тебя?", options: ["Да, если у него много денег", "Нет, у него нет гос. лицензии", "Да, если мы подпишем расписку"], correct: 1, hint: "Даже если у него денег как у Таноса — без лицензии он не страховщик! 💰❌" },
        { q: "Может ли компания (юридическое лицо) быть клиентом (страхователем)?", options: ["Да, конечно", "Нет, только обычные люди", "Только иностранные фирмы"], correct: 0, hint: "Apple, Google, Stark Industries — все могут быть страхователями! 🏢✅" },
        { q: "Какой официальный документ подтверждает, что вы договорились?", options: ["Паспорт", "Страховой полис", "Чек об оплате"], correct: 1, hint: "Как контракт у супергероев — только полис! 📄✨" }
      ]
    },
    {
      icon: Shield,
      title: "Виды страхования",
      subtitle: "КОГО И ЧТО ЗАЩИЩАЕМ",
      description: "Существует три главных направления защиты. Первое — Имущественное (защита вещей: квартиры, машин, телефонов от поломок или кражи). Второе — Личное (защита твоей жизни и здоровья: ДМС, страховка от травм). Третье — Страхование ответственности (защита твоего кошелька, если ты случайно испортил чужую вещь или здоровье, и должен возместить ущерб).",
      example: "Если ты разбил свой телефон — поможет имущественная страховка. Если сломал руку, катаясь на скейте — личная. А если ты на самокате въехал в чужую припаркованную машину и поцарапал её — спасет страхование ответственности.",
      association: "🐉 Как в Шреке: Имущественное = защита замка 🏰 (вещи), Личное = здоровье Шрека и Фионы ❤️ (жизнь), Ответственность = если Осёл что-то сломал, платит страховая 🫏💰",
      color: "red",
      miniCheatSheet: [
        "🏠 Имущественное = вещи (телефон, машина, дом)",
        "❤️ Личное = твоё здоровье и жизнь",
        "🤝 Ответственность = если ТЫ виноват перед другими",
        "💡 Ответственность защищает ЧУЖОЕ от твоих действий"
      ],
      quiz: [
        { q: "Если ты застраховал свой ноутбук от залития кофе, какой это вид?", options: ["Личное", "Имущественное", "Ответственность"], correct: 1, hint: "Ноутбук = вещь = имущественное! 💻☕" },
        { q: "Ты случайно разбил витрину в магазине. Какая страховка оплатит ущерб магазину за тебя?", options: ["Страхование ответственности", "Имущественное", "Личное"], correct: 0, hint: "Ты виноват перед магазином = ответственность! 🤝💸" },
        { q: "Страховка от несчастного случая (например, перелом ноги) — это...", options: ["Личное страхование", "Имущественное страхование", "Штраф"], correct: 0, hint: "Нога = твоё тело = личное страхование! 🦵❤️" },
        { q: "Что защищает страхование ответственности?", options: ["Твой телефон от кражи", "Твое здоровье", "Чужое имущество/здоровье, если ты виноват"], correct: 2, hint: "Если ТЫ сломал ЧУЖОЕ — платит страховая! 🫠💰" },
        { q: "Можно ли застраховать жизнь и здоровье человека?", options: ["Нет, это незаконно", "Да, это называется личное страхование", "Да, но только для спортсменов"], correct: 1, hint: "Конечно! Как Шрек страхует свою огровую жизнь 🐉✅" }
      ]
    },
    {
      icon: Car,
      title: "Автостраховка (ОСАГО и КАСКО)",
      subtitle: "ГЛАВНЫЕ ПРИМЕРЫ ИЗ ЖИЗНИ",
      description: "ОСАГО — это обязательная страховка для всех водителей. Она страхует твою ответственность. Если ты въехал в чужую машину, ОСАГО оплатит ремонт тому парню, а свою машину ты будешь чинить сам. КАСКО — это добровольная страховка твоего собственного авто. Въехал в столб? Упало дерево? КАСКО оплатит ремонт твоей машины.",
      example: "Бэтмен случайно врезался на Бэтмобиле в машину Джокера. По ОСАГО страховая Бэтмена оплатит ремонт машины Джокера. А ремонт Бэтмобиля Бэтмен оплатит из страховки КАСКО (потому что она защищает именно его тачку).",
      association: "🚗 Как в Тачках: ОСАГО = Молния Маквин платит за чужую царапину 🏎️💨, КАСКО = Молния чинит СЕБЯ после аварии 🛠️✨. Обязательное и добровольное — как пит-стоп!",
      color: "yellow",
      miniCheatSheet: [
        "🔴 ОСАГО = ОБЯЗАТЕЛЬНО для всех водителей",
        "🔴 ОСАГО = чинит ЧУЖУЮ машину, если виноват ТЫ",
        "🟢 КАСКО = ДОБРОВОЛЬНО, для СВОЕЙ машины",
        "🟢 КАСКО = чинит ТЕБЯ даже если сам виноват"
      ],
      quiz: [
        { q: "ОСАГО — это обязательная или добровольная страховка?", options: ["Обязательная для всех водителей", "Добровольная", "Только для новичков"], correct: 0, hint: "Как ремень безопасности — обязательно для всех! 🔴✅" },
        { q: "Ты виноват в ДТП. Чью машину отремонтируют по твоему ОСАГО?", options: ["Твою", "Чужую (пострадавшего)", "Обе"], correct: 1, hint: "ОСАГО = защита для ЧУЖИХ от тебя! 🤝🚗" },
        { q: "Что такое КАСКО?", options: ["Налог на дороги", "Обязательная страховка", "Добровольная страховка твоего авто"], correct: 2, hint: "КАСКО = как апгрейд в игре, только для тачки 🟢🎮" },
        { q: "Какая страховка оплатит ремонт твоей машины, если ты сам врезался в забор?", options: ["ОСАГО", "КАСКО", "ОМС"], correct: 1, hint: "Сам виноват = только КАСКО спасёт! 🟢🔧" },
        { q: "Если на машину упало дерево во дворе, поможет ли ОСАГО?", options: ["Да", "Нет, тут поможет только КАСКО"], correct: 1, hint: "Дерево ≠ ДТП = ОСАГО не работает, только КАСКО! 🌳❌" }
      ]
    },
    {
      icon: FileText,
      title: "Страховой полис",
      subtitle: "ДОГОВОР",
      description: "Полис — это именной документ, который подтверждает факт заключения договора. В нём чётко прописано: от чего тебя защищают, на какую сумму и на какой срок. Сегодня полис не обязательно носить в папке — электронный формат (e-polis) в смартфоне имеет точно такую же юридическую силу. И самое главное: защита обычно включается только после того, как ты оплатишь взнос.",
      example: "Ты купил новый мощный ноут и оформил на него e-polis прямо с телефона. Защита от залития кофе начала работать ровно в ту секунду, когда с твоей карты списались деньги за страховку.",
      association: "🎫 Как билет в Хогвартс: именной ✉️, можно в телефоне 📱, но пока не оплатил — платформа 9¾ не откроется! Оплатил = защита ON ✨🪄",
      color: "red",
      miniCheatSheet: [
        "📄 Полис = официальный договор со страховой",
        "👤 Всегда именной (на твоё имя)",
        "📱 E-polis = такая же сила, как бумажный",
        "💰 Защита начинается ПОСЛЕ оплаты"
      ],
      quiz: [
        { q: "Что такое страховой полис?", options: ["Чек об оплате", "Документ, подтверждающий договор", "Рекламный буклет"], correct: 1, hint: "Как контракт у Гарри Поттера — только полис! 📜✨" },
        { q: "Имеет ли электронный полис (e-polis) такую же силу, как бумажный?", options: ["Да, абсолютно", "Нет, нужен только бумажный", "Только для мелких сумм"], correct: 0, hint: "E-polis = как цифровая палочка, работает так же! 📱🪄" },
        { q: "Что обязательно должно быть прописано в полисе?", options: ["Список рисков и сумма", "Твое фото в профиль", "Список твоих оценок"], correct: 0, hint: "Риски + сумма = главные заклинания в полисе! ⚡💰" },
        { q: "Кому выдается страховой полис?", options: ["Страховщику", "Страхователю (клиенту)", "Полиции"], correct: 1, hint: "Полис получает тот, кто покупает защиту — ты! 🎯👤" },
        { q: "Когда обычно начинает работать защита по полису?", options: ["Сразу после распечатки", "Обычно после оплаты взноса", "На следующий год"], correct: 1, hint: "Как в игре: оплатил подписку = получил бонусы! 💰✅" }
      ]
    },
    {
      icon: ShieldAlert,
      title: "Управление риском",
      subtitle: "КОНТРОЛЬ СИТУАЦИИ",
      description: "В жизни полно рисков, но мы можем с ними работать. Есть 4 пути. Уклонение: просто не делать ничего опасного (боишься летать — езди на поезде). Снижение: уменьшить шанс беды (купить чехол на телефон, поставить антивирус). Принятие: смириться, что платить придется самому. Перенесение: купить страховку, чтобы в случае чего платила компания, а не ты.",
      example: "Если ты решил вообще не покупать электросамокат, чтобы не разбиться — это уклонение. Надеваешь шлем — это снижение. А если покупаешь страховку от травм при езде — это перенесение риска на страховую.",
      association: "🦸 Как у Мстителей: Уклонение = не лезть к Таносу 🏃, Снижение = надеть броню Железного человека 🛡️, Принятие = Капитан принимает удар 💥, Перенесение = вызвать Халка, пусть он разбирается 😤💚",
      color: "yellow",
      miniCheatSheet: [
        "🏃 Уклонение = вообще не делать опасное",
        "🛡️ Снижение = чехол, шлем, антивирус",
        "💸 Принятие = готов платить сам",
        "🤝 Перенесение = страховка платит за тебя"
      ],
      quiz: [
        { q: "Если ты купил страховку, какой это метод управления риском?", options: ["Уклонение от риска", "Перенесение риска", "Принятие риска"], correct: 1, hint: "Страховка = риск переносится на компанию! 🤝✨" },
        { q: "Установка антивируса на ноутбук — это метод...", options: ["Снижения риска", "Перенесения риска", "Полного устранения"], correct: 0, hint: "Антивирус = как щит, снижает шанс проблемы! 🛡️💻" },
        { q: "Что значит «принятие риска»?", options: ["Платить страховщику", "Готовность самому покрыть убытки из своего кошелька", "Попытка обмануть судьбу"], correct: 1, hint: "Принятие = «если что, заплачу сам» 💸🤷" },
        { q: "Отказ от катания на сноуборде из-за страха сломать ногу — это...", options: ["Уклонение", "Страхование", "Снижение"], correct: 0, hint: "Не делаешь = уклоняешься от риска! 🏃❄️" },
        { q: "Можно ли полностью исключить абсолютно все риски в жизни?", options: ["Да", "Нет, это невозможно"], correct: 1, hint: "Даже у Супермена есть криптонит! Полностью — нельзя 🦸❌" }
      ]
    },
    {
      icon: Wallet,
      title: "Страховая премия",
      subtitle: "ТВОЙ ВЗНОС",
      description: "Страховая премия (или взнос) — это сумма, которую ты платишь компании за полис. Именно из таких платежей от тысяч клиентов собирается огромный «общак» (фонд компании), из которого потом выплачивают деньги тем, кому не повезло. Премия всегда намного меньше самой суммы защиты. И да, часто её можно платить не сразу, а в рассрочку.",
      example: "Ты платишь по 500 рублей в месяц за страховку своего крутого велосипеда. Эти 500 рублей — твоя премия. Если ты забудешь её оплатить, полис просто перестанет действовать.",
      association: "💳 Как донаты в Бравл Старс: платишь немного сейчас 💰, чтобы получить защиту потом 🛡️. Не оплатил = скины (и страховка) пропали! ⚠️",
      color: "red",
      miniCheatSheet: [
        "💰 Премия = твой платёж за полис",
        "🏦 Из премий всех клиентов = фонд выплат",
        "📉 Премия ВСЕГДА меньше суммы защиты",
        "❌ Не оплатил = защита не работает"
      ],
      quiz: [
        { q: "Что такое страховая премия?", options: ["Плата клиента за полис", "Бонус за хорошее поведение", "Выплата после ДТП"], correct: 0, hint: "Премия = как донат в игре, платишь за защиту! 💰🎮" },
        { q: "Из чего формируется огромный фонд страховой компании?", options: ["Из налогов государства", "Из премий (взносов) обычных клиентов", "Из штрафов"], correct: 1, hint: "Как копилка: все скидываются, потом помогают тем, кому нужно! 🏦🤝" },
        { q: "Как премия соотносится со страховой суммой (лимитом выплаты)?", options: ["Премия всегда меньше", "Премия всегда больше", "Они равны"], correct: 0, hint: "Платишь 500₽, получить можешь 50 000₽ — премия меньше! 📉💰" },
        { q: "Что произойдет, если ты забудешь оплатить страховую премию?", options: ["Ничего страшного", "Договор не вступит в силу (защиты не будет)", "Страховая сама за тебя заплатит"], correct: 1, hint: "Не оплатил подписку = сервис отключился! ⚠️❌" },
        { q: "Можно ли оплачивать премию частями (в рассрочку)?", options: ["Да, по договоренности сторон", "Нет, только сразу всю сумму", "Только наличными курьеру"], correct: 0, hint: "Как подписка: можно платить помесячно! 💳📅" }
      ]
    },
    {
      icon: Shield,
      title: "Страховая сумма",
      subtitle: "МАКСИМАЛЬНЫЙ ЛИМИТ",
      description: "Это «потолок» выплат по твоему полису. Важное правило экономики: на страховке имущества нельзя заработать. Если твой комп стоит 50 тысяч, ты не можешь застраховать его на миллион. А вот при личном страховании (жизнь и здоровье) сумму вы придумываете вместе с компанией, ведь жизнь бесценна. От этой суммы напрямую зависит, сколько будет стоить сам полис.",
      example: "Если твой телефон застрахован на 30 000 рублей (это его цена в магазине), а ты его разбил в крошку, тебе выплатят ровно 30 000, даже если ремонт в элитном сервисе стоит 40 000. Лимит превысить нельзя.",
      association: "🎮 Как лимит донатов в игре: мама поставила 1000₽ в день — на 1500₽ не купишь, даже если очень хочешь! Потолок есть всегда 🚫📈",
      color: "yellow",
      miniCheatSheet: [
        "🔝 Страховая сумма = МАКСИМУМ выплаты",
        "🚫 На имуществе НЕЛЬЗЯ заработать (только вернуть стоимость)",
        "❤️ На жизни — сумма по договорённости (жизнь бесценна)",
        "📈 Чем выше лимит = тем дороже полис"
      ],
      quiz: [
        { q: "Страховая сумма — это...", options: ["Стоимость самого полиса", "Максимальный лимит возможной выплаты", "Зарплата директора компании"], correct: 1, hint: "Сумма = потолок выплат, выше не прыгнешь! 🔝💰" },
        { q: "Может ли выплата при аварии быть БОЛЬШЕ страховой суммы?", options: ["Да", "Нет, это потолок"], correct: 1, hint: "Потолок = потолок, выше не пролезешь! 🚫📈" },
        { q: "Влияет ли размер страховой суммы на цену самого полиса (премию)?", options: ["Да, чем выше лимит, тем дороже полис", "Нет", "Зависит от настроения менеджера"], correct: 0, hint: "Больше защита = больше платишь, как в игре! 🎮💰" },
        { q: "Может ли страховая сумма имущества превышать его реальную стоимость (чтобы ты заработал)?", options: ["Да, это отличный бизнес", "Нет, закон запрещает наживаться на страховке", "На усмотрение агента"], correct: 1, hint: "Нельзя заработать на чужой беде — закон не даст! ⚖️❌" },
        { q: "Кто определяет страховую сумму при страховании жизни (ведь жизнь бесценна)?", options: ["Страхователь со страховщиком по договоренности", "Полиция", "Государство по тарифу"], correct: 0, hint: "Жизнь бесценна = договариваетесь сами! 🤝❤️" }
      ]
    },
    {
      icon: Scissors,
      title: "Франшиза",
      subtitle: "СКИДКА ЗА МЕЛКИЙ УРОН",
      description: "Франшиза — это та часть убытка, которую компания тебе НЕ возмещает (остается на тебе). Звучит как подстава? На самом деле нет! Благодаря франшизе сам полис стоит в разы дешевле. Это выгодно всем: ты не переплачиваешь за договор, а компания не тратит ресурсы менеджеров ради выплаты тебе ста рублей за мелкую царапину.",
      example: "У тебя франшиза 3 000 рублей на экран телефона. Если ты чуть-чуть поцарапал пленку (ремонт 1 000 руб) — платишь сам. Но если экран разбился вдребезги (ремонт 15 000 руб), страховая вычтет 3к и заплатит тебе 12 000 рублей.",
      association: "🍔 Как в Макдональдсе: мелкий урон (упал бургер) — сам решаешь 🤷, крупный (сломал телефон) — страховая помогает, но минус франшиза! Выгодно = полис дешевле 🎯💰",
      color: "red",
      miniCheatSheet: [
        "✂️ Франшиза = часть ущерба, которую платишь ТЫ",
        "💸 С франшизой полис ЗНАЧИТЕЛЬНО дешевле",
        "🚫 Ущерб < франшизы = выплата 0₽",
        "🤝 Выгодно при частых мелких поломках"
      ],
      quiz: [
        { q: "Что такое франшиза в страховании?", options: ["Право открыть кафе под чужим брендом", "Бонус за стаж", "Часть ущерба, которую клиент оплачивает сам"], correct: 2, hint: "Франшиза = твоя доля в ущербе, как франшиза в Макдональдсе! 🍔✂️" },
        { q: "Главный плюс франшизы для клиента?", options: ["Она делает полис значительно дешевле", "Дает VIP статус", "Позволяет не платить налоги"], correct: 0, hint: "Меньше платишь за полис = больше денег в кармане! 💰✨" },
        { q: "Франшиза 5 000₽, ущерб 3 000₽. Сколько заплатит тебе страховая?", options: ["5 000₽", "3 000₽", "0₽ (ущерб меньше франшизы)"], correct: 2, hint: "Ущерб меньше франшизы = страховая не платит! 🚫💸" },
        { q: "Франшиза 5 000₽, ущерб 50 000₽. Сколько заплатит страховая?", options: ["50 000₽", "45 000₽ (ущерб минус франшиза)", "5 000₽"], correct: 1, hint: "50 000 - 5 000 = 45 000₽, франшиза вычитается! ➖💰" },
        { q: "Кому вообще выгодна франшиза при частых мелких поломках?", options: ["Обоим (клиенту дешевле полис, компании меньше возни)", "Никому", "Только государству"], correct: 0, hint: "Клиент экономит на полисе, компания — на мелких выплатах! 🤝💡" }
      ]
    }
  ];

  const progressPercentage = Math.round((completedCards.length / theories.length) * 100);

  return (
    <div className="min-h-screen px-4 md:px-6 py-6 md:py-12 font-sans relative overflow-hidden bg-black selection:bg-zinc-700/50">
      
      {/* === НОВЫЙ ФОН В СТИЛЕ WELCOME (Purple Glow + Grid) === */}
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
        {/* Верхнее пятно */}
        <div
          className="absolute top-[-25%] left-[-10%] w-[85vw] h-[75vh] bg-gradient-to-br from-zinc-950/60 via-purple-800/20 to-black/20 rounded-full blur-[150px] transition-transform duration-1000 ease-out animate-float animate-shimmer"
          style={{ transform: `translate(${mouse.x * 1.5}px, ${mouse.y * 1.5}px)` }}
        />
        {/* Нижнее пятно */}
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[70vh] bg-gradient-to-tl from-zinc-950/50 via-purple-700/15 to-black/20 rounded-full blur-[140px] transition-transform duration-1000 ease-out animate-float animate-shimmer"
          style={{ animationDelay: '3s', transform: `translate(${-mouse.x * 1.5}px, ${-mouse.y * 1.5}px)` }}
        />
        {/* Центральное свечение */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-gradient-to-tr from-purple-900/10 via-transparent to-zinc-900/20 rounded-full blur-[120px] animate-shimmer"
          style={{ animationDelay: '1.5s' }}
        />
        {/* Сетка */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
      {/* === КОНЕЦ ОБНОВЛЕНИЯ ФОНА === */}

      {/* Конфетти-эффект */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {[...Array(20)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute w-4 h-4 text-yellow-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">

        {/* ХЕДЕР ПРОФИЛЯ (без изменений) */}
        <div className="relative group flex flex-col md:flex-row items-center justify-between gap-8 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 hover:bg-white/[0.07]">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
          
          <div className="flex items-center gap-5 z-10">
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${currentLevel.color} blur-2xl opacity-40 rounded-full animate-pulse`} />
              <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${currentLevel.color} p-[2px] shadow-xl`}>
                <div className="w-full h-full rounded-full bg-zinc-900/80 flex items-center justify-center backdrop-blur-sm">
                  <Trophy className="w-9 h-9 text-white drop-shadow-sm" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-zinc-800/90 border border-white/20 rounded-full text-[10px] font-black text-white shadow-lg backdrop-blur-sm">
                LVL {currentLevel.level}
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.25em] mb-1">Твой ранг</p>
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
                {currentLevel.title}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${currentLevel.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${(xp / currentLevel.nextAt) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] text-white/50 font-medium">{Math.round((xp / currentLevel.nextAt) * 100)}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 max-w-lg w-full z-10">
            <div className="flex justify-between items-end mb-3">
              <span className="text-white flex items-center gap-3 font-bold text-lg">
                <div className="p-1.5 bg-cyan-500/20 rounded-lg border border-cyan-500/30 flex items-center gap-1">
                  <Star className="w-4 h-4 text-cyan-400" /> 
                  <span>{xp} XP</span>
                </div>
                <div className="p-1.5 bg-amber-500/20 rounded-lg border border-amber-500/30 flex items-center gap-1">
                  <Coins className="w-4 h-4 text-amber-400" /> 
                  <span>{coins}</span>
                </div>
                {streak > 1 && (
                  <span className="flex items-center gap-1 text-orange-400 text-sm ml-2 bg-orange-500/10 px-2 py-1 rounded-full border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                    <Flame className="w-4 h-4" /> Серия: {streak}
                  </span>
                )}
              </span>
              <span className="text-white/40 text-sm font-medium tracking-wide">
                Цель: {currentLevel.nextAt}
              </span>
            </div>
            
            <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner backdrop-blur-md">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 relative transition-all duration-1000 ease-out"
                style={{ width: `${xpProgress}%` }}
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-white/30 to-transparent" />
              </div>
            </div>
            {xpToNext > 0 && (
              <p className="text-xs text-white/40 mt-2 text-right font-medium">
                До повышения: <span className="text-cyan-400">{xpToNext} XP</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 min-w-[200px] z-10">
            <span className="text-white/50 text-xs font-black uppercase tracking-[0.2em] text-right">Награды ({achievements.length})</span>
            <div className="flex gap-2 flex-wrap justify-end">
              {achievements.length === 0 ? (
                <span className="text-white/30 text-sm italic px-4 py-2 bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm">Пока пусто</span>
              ) : (
                achievements.map((ach, i) => (
                  <div 
                    key={i} 
                    className="px-3 py-1.5 bg-white/5 backdrop-blur-md border border-white/20 hover:border-cyan-400/50 hover:bg-cyan-900/20 transition-colors rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 cursor-default"
                    title={ach}
                  >
                    <Award className="w-4 h-4 text-cyan-400" /> 
                    <span>{ach}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Заголовок (без изменений) */}
        <div className="text-center space-y-6">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-white/20 via-white/60 to-white/20 bg-[length:250%_100%] text-4xl md:text-6xl font-black tracking-tight leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.08)] animate-[text-shine_4s_linear_infinite]">
            Прокачай свой финансовый IQ
          </h1>
          <style>{`
            @keyframes text-shine {
              0% { background-position: 150% 0; }
              100% { background-position: -150% 0; }
            }
          `}</style>

          <p className="text-zinc-500/50 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Вникай в теорию, читай мини-конспекты и сдавай тесты. За верные ответы ты получаешь <span className="text-cyan-200/60 font-semibold">XP</span> и <span className="text-amber-200/60 font-semibold">монеты</span>. Трать монеты на подсказки!
          </p>
        </div>

        {/* ШКАЛА ПРОГРЕССА (без изменений) */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="text-white/50 text-xs font-black uppercase tracking-[0.2em] block mb-1">Твой прогресс</span>
                <span className="text-white font-bold text-xl block">Освоено тем: {completedCards.length} из {theories.length}</span>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 font-black text-4xl drop-shadow-sm">
                {progressPercentage}%
              </span>
            </div>
            
            <div className="w-full bg-black/40 rounded-full h-4 overflow-hidden border border-white/5 shadow-inner backdrop-blur-md">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-1000 ease-out relative" 
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-white/30 to-transparent" />
              </div>
            </div>
            
            {!canProceed && (
              <div className="mt-4 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-200 py-3 px-4 rounded-xl text-sm font-medium backdrop-blur-md">
                <LockKeyhole className="w-4 h-4 text-red-400" /> 
                <p>
                  Для перехода дальше освой еще <span className="font-bold text-white">{MIN_BLOCKS_TO_UNLOCK - completedCards.length}</span> блока теории
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Интерактивные карточки — БЕЗ ИЗМЕНЕНИЙ */}
        <div className="space-y-6">
          {theories.map((theory, index) => {
            const Icon = theory.icon;
            const isRed = theory.color === "red";
            const isOpen = openCard === index;
            const isCompleted = completedCards.includes(index);
            const isQuizMode = quizActiveFor === index;
            const isHovered = hoveredCard === index;
            
            const colorClasses = isRed 
              ? "from-red-600/10 border-red-500/30 ring-red-500/20 hover:border-red-500/50" 
              : "from-yellow-600/10 border-yellow-500/30 ring-yellow-500/20 hover:border-yellow-500/50";
            const iconColor = isRed ? "text-red-400 bg-red-500/10" : "text-yellow-400 bg-yellow-500/10";

            return (
              <div
                key={index}
                className={`group relative bg-zinc-900/30 backdrop-blur-xl border border-white/10 transition-all duration-300 overflow-hidden rounded-3xl ${
                  isOpen 
                    ? `bg-zinc-900/60 shadow-2xl ring-4 ${colorClasses} my-10` 
                    : `cursor-pointer hover:-translate-y-1 shadow-lg ${isCompleted ? "border-emerald-500/40 bg-zinc-900/50" : "bg-zinc-900/30 border-white/10"} ${isHovered ? "scale-[1.02] shadow-xl" : ""}`
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${isRed ? 'bg-red-500' : 'bg-yellow-500'} opacity-0 transition-opacity ${isHovered && !isOpen ? 'opacity-100' : ''}`} />

                {!isOpen && (
                  <div onClick={() => handleCardClick(index)} className="p-6 md:p-8 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${isCompleted ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400' : 'bg-zinc-800/80 border border-white/10 text-zinc-400'}`}>
                        {isCompleted ? <Unlock className="w-8 h-8" /> : <LockKeyhole className="w-8 h-8" />}
                      </div>
                      <div>
                        <div className="text-zinc-500 tracking-widest uppercase text-sm font-bold mb-1 flex items-center gap-2">
                          Уровень {index + 1} 
                          {isCompleted && <span className="text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20"><CheckCircle2 className="w-3 h-3"/> Пройдено</span>}
                        </div>
                        <h2 className={`text-2xl font-bold transition-colors ${isCompleted ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                          {theory.title}
                        </h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {isCompleted && <div className="hidden md:flex text-emerald-500/50 text-sm font-bold mr-4">+50 XP</div>}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isHovered ? 'bg-white/10' : 'bg-transparent'}`}>
                        <ArrowRight className={`w-6 h-6 transition-colors ${isHovered ? 'text-white' : 'text-zinc-500'}`} />
                      </div>
                    </div>
                  </div>
                )}

                {isOpen && (
                  <div className="p-6 md:p-10 flex flex-col gap-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6 relative">
                      <div className="flex items-center gap-5 relative z-10">
                        <div className={`w-16 h-16 rounded-2xl ${iconColor} flex items-center justify-center shadow-lg border border-white/10`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div>
                          <div className="text-zinc-400 tracking-widest uppercase text-sm font-bold mb-1 flex items-center gap-2">
                            {isQuizMode ? (
                              <><Target className="w-4 h-4 text-cyan-400"/> Испытание</>
                            ) : theory.subtitle}
                          </div>
                          <h2 className="text-white text-2xl md:text-3xl font-bold">{theory.title}</h2>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleCardClick(index); }} className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors z-10">
                        <XCircle className="w-6 h-6 text-zinc-400" />
                      </button>
                    </div>

                    {quizFeedback && !isQuizMode && (
                      <div className={`p-4 rounded-xl border flex items-center gap-4 ${quizFeedback.isError ? 'bg-red-500/10 border-red-500/30 text-red-200' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'}`}>
                        <div className={`p-2 rounded-full ${quizFeedback.isError ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {quizFeedback.isError ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="font-bold text-lg">{quizFeedback.isError ? 'Упс!' : 'Победа!'}</p>
                          <p className="text-sm opacity-90">{quizFeedback.message}</p>
                        </div>
                      </div>
                    )}

                    {isQuizMode ? (
                      <div className="space-y-6 bg-zinc-900/50 p-6 md:p-8 rounded-3xl border border-white/5 shadow-inner">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 font-bold text-sm flex items-center gap-2">
                              <Target className="w-4 h-4" /> Вопрос {currentQIndex + 1} из {theory.quiz.length}
                            </div>
                            {streak > 1 && (
                              <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 font-bold text-sm flex items-center gap-1 animate-pulse">
                                <Flame className="w-4 h-4" /> Серия: {streak}
                              </div>
                            )}
                          </div>
                          <div className="text-zinc-500 font-bold text-sm">
                            Счёт: <span className="text-white">{currentScore}</span>
                          </div>
                        </div>

                        <div className="min-h-[120px] flex flex-col justify-center">
                          <p className="text-2xl md:text-3xl text-white font-bold leading-tight">
                            {theory.quiz[currentQIndex].q}
                          </p>
                        </div>
                        
                        <div className="space-y-3 pt-6">
                          {theory.quiz[currentQIndex].options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswer(optIdx === theory.quiz[currentQIndex].correct, index)}
                              className="w-full text-left p-5 rounded-2xl border border-white/10 bg-zinc-800/80 hover:bg-cyan-900/40 hover:border-cyan-500/50 transition-all text-zinc-200 text-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 flex justify-between items-center group"
                            >
                              <span>{opt}</span>
                              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-8 flex justify-end items-center gap-3">
                          {hintUsed[getHintKey(index, currentQIndex)] ? (
                            <div className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-lg flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" /> 
                              <span>{theory.quiz[currentQIndex].hint}</span>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                if (coins >= HINT_COST) {
                                  setCoins(prev => prev - HINT_COST);
                                  setHintUsed(prev => ({ ...prev, [getHintKey(index, currentQIndex)]: true }));
                                  if (user) {
                                    updateUser({ coins: (user.coins || 0) - HINT_COST });
                                  }
                                }
                              }}
                              disabled={coins < HINT_COST}
                              className={`text-sm font-bold flex items-center gap-2 transition-all ${
                                coins < HINT_COST 
                                  ? 'text-zinc-600 cursor-not-allowed opacity-50' 
                                  : 'text-amber-400 hover:text-amber-300 hover:scale-105'
                              }`}
                            >
                              <Lightbulb className="w-4 h-4" /> 
                              <span>Подсказка</span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                                coins >= HINT_COST ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-700 text-zinc-500'
                              }`}>
                                {HINT_COST} 💰
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          
                          <div className="space-y-6">
                            <div className="prose prose-invert max-w-none">
                              <p className="text-zinc-300 text-lg leading-relaxed bg-zinc-900/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                                {theory.description}
                              </p>
                            </div>
                            
                            <div className="bg-zinc-800/50 border border-white/10 rounded-2xl p-6 shadow-md relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
                              <div className="text-zinc-500 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-cyan-400"/> Пример
                              </div>
                              <p className="text-white text-lg leading-relaxed">{theory.example}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 shadow-lg relative overflow-hidden group">
                              <Sparkles className="absolute top-4 right-4 w-16 h-16 text-indigo-500/20 group-hover:scale-110 transition-transform duration-500" />
                              <div className="relative z-10">
                                <span className="text-indigo-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mb-3">
                                  <BrainCircuit className="w-4 h-4"/> Как легко запомнить
                                </span>
                                <p className="text-indigo-100 text-lg leading-relaxed font-medium">{theory.association}</p>
                              </div>
                            </div>
                            
                            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 relative">
                               <div className="absolute -top-3 left-6 px-3 py-1 bg-cyan-500 text-black text-xs font-black uppercase tracking-wider rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                 Мини-шпаргалка
                               </div>
                               <div className="space-y-3 mt-3">
                                  {theory.miniCheatSheet.map((detail, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                                      <Zap className="w-4 h-4 flex-shrink-0 mt-1 text-cyan-400" />
                                      <p className="text-zinc-300 text-sm leading-relaxed font-medium">{detail}</p>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 flex justify-center">
                          {isCompleted ? (
                             <button
                               onClick={(e) => startQuiz(index, e)}
                               className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center gap-3 text-sm"
                             >
                               <RefreshCw className="w-4 h-4" /> Пройти тест ещё раз
                             </button>
                          ) : (
                            <button
                              onClick={(e) => startQuiz(index, e)}
                              className="group relative px-10 py-5 bg-white text-black font-black text-lg rounded-2xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center gap-3 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                              <Target className="w-6 h-6 text-cyan-600" /> 
                              <span>Начать испытание</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Кнопка перехода (без изменений) */}
        <div className="pt-12 pb-24 flex justify-center">
          {canProceed ? (
            <button 
              onClick={onComplete}
              className="group relative px-12 py-6 bg-zinc-800/40 hover:bg-zinc-700/50 text-white font-black text-xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(82,82,91,0.3)] flex items-center gap-4 overflow-hidden border border-zinc-600/40 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkle className="w-8 h-8 animate-pulse text-zinc-300" />
              Перейти к мини-играм
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform text-zinc-300" />
            </button>
          ) : (
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 text-center max-w-md">
              <LockKeyhole className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 font-medium">
                Пройди минимум {MIN_BLOCKS_TO_UNLOCK} блока теории, чтобы разблокировать доступ к играм.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}