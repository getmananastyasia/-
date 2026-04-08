import { useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle, GraduationCap, ArrowRight, Coins } from "lucide-react";

interface WorkbookTestScreenProps {
  onBack: () => void;
  onSuccess?: () => void; // Добавили проп для выдачи награды
}

export function WorkbookTestScreen({ onBack, onSuccess }: WorkbookTestScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [rewardGiven, setRewardGiven] = useState(false);

  const questions = [
    {
      question: "Кто такой страховщик в договоре страхования?",
      options: [
        "Любой человек, у которого есть деньги",
        "Организация, имеющая лицензию на осуществление страхования",
        "Государственный банк",
      ],
      correctAnswer: 1,
      explanation: "Страховщик — это всегда юридическое лицо (компания), у которого есть специальная лицензия от государства."
    },
    {
      question: "Что такое страховая премия?",
      options: [
        "Сумма, которую страховая компания выплачивает при ущербе",
        "Бонус за отсутствие аварий в течение года",
        "Плата за страхование, которую клиент вносит страховщику",
      ],
      correctAnswer: 2,
      explanation: "Страховая премия — это ваш регулярный взнос за полис (цена самой страховки)."
    },
    {
      question: "Что из перечисленного является главным признаком страхового риска?",
      options: [
        "Событие обязательно произойдет завтра",
        "Событие обладает признаками вероятности и случайности",
        "Событие было спланировано заранее",
      ],
      correctAnswer: 1,
      explanation: "Страховой риск — это предполагаемое событие. Никто не знает, случится оно или нет, но вероятность существует."
    }
  ];

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      // Если ответил на все вопросы правильно — выдаем 500 монет!
      if (score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0) === questions.length) {
        if (onSuccess && !rewardGiven) {
          onSuccess();
          setRewardGiven(true);
        }
      }
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 flex flex-col items-center justify-center relative overflow-hidden bg-zinc-950">
      <div className="max-w-3xl w-full space-y-8 relative z-10">
        {!showResult && (
          <button onClick={onBack} className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Сбежать с экзамена
          </button>
        )}

        {showResult ? (
          <div className={`bg-zinc-900/80 border rounded-3xl p-10 text-center space-y-8 shadow-2xl backdrop-blur-md ${score === questions.length ? 'border-emerald-500/50' : 'border-red-500/50'}`}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner ${score === questions.length ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              <GraduationCap className={`w-12 h-12 ${score === questions.length ? 'text-emerald-500' : 'text-red-500'}`} />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">Экзамен завершен!</h2>
              <p className="text-xl text-zinc-400">
                Твой результат: <span className="text-white font-bold">{score} из {questions.length}</span>
              </p>
            </div>

            {score === questions.length ? (
              <div className="inline-flex flex-col items-center gap-2 bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 animate-in zoom-in duration-500">
                <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">Идеально! Награда получена</span>
                <div className="text-4xl font-black text-emerald-500 flex items-center gap-3">
                  +500 <Coins className="w-8 h-8" />
                </div>
              </div>
            ) : (
              <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-6">
                <p className="text-red-400 font-medium">Эх, были ошибки. Награда выдается только за 100% правильных ответов. Возвращайся к миссиям!</p>
              </div>
            )}
            
            <button onClick={onBack} className="mt-8 px-8 py-4 bg-white text-black font-bold rounded-2xl transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-3 mx-auto">
              Вернуться к миссиям <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
               <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(currentQuestion / questions.length) * 100}%` }} />
            </div>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-emerald-500 font-bold tracking-widest text-sm uppercase">
                  Вопрос {currentQuestion + 1} из {questions.length}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => {
                  const isCorrect = index === questions[currentQuestion].correctAnswer;
                  const isSelected = selectedAnswer === index;
                  let buttonClass = "bg-zinc-800/50 border-white/5 text-zinc-300 hover:bg-zinc-800 hover:border-white/20";
                  
                  if (isAnswered) {
                    if (isCorrect) buttonClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-400";
                    else if (isSelected && !isCorrect) buttonClass = "bg-red-500/20 border-red-500/50 text-red-400";
                    else buttonClass = "bg-zinc-800/30 border-white/5 text-zinc-600 opacity-50";
                  }

                  return (
                    <button key={index} onClick={() => handleAnswerClick(index)} disabled={isAnswered} className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${buttonClass}`}>
                      <span className="text-lg font-medium">{option}</span>
                      {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="pt-6 border-t border-white/10 animate-in fade-in duration-500 space-y-6">
                  <div className="bg-black/40 p-6 rounded-xl border border-white/5">
                    <p className="text-zinc-300">
                      <span className="text-emerald-500 font-bold mr-2">Объяснение:</span>
                      {questions[currentQuestion].explanation}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleNextQuestion} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2">
                      {currentQuestion + 1 === questions.length ? "Показать результат" : "Следующий вопрос"}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}