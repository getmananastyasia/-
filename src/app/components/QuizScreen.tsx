export function QuizScreen({ scenario, onAnswerSelect }: any) {
  return (
    <div className="h-screen w-full relative text-white">
      
      {/* ФОН */}
      <img
        src={scenario.imageUrl}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ТЕМНЫЙ ОВЕРЛЕЙ */}
      <div className="absolute inset-0 bg-black/60" />

      {/* ИМЯ ПЕРСОНАЖА */}
      <div className="absolute top-6 left-6 text-xl font-bold tracking-widest">
        {scenario.hero}
      </div>

      {/* ТЕКСТ (как диалог) */}
      <div className="absolute bottom-40 left-0 right-0 px-6">
        <div className="bg-black/70 p-5 rounded-2xl backdrop-blur-md text-lg leading-relaxed">
          {scenario.storyText}
        </div>
      </div>

      {/* ВЫБОРЫ */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        {scenario.options.map((opt: any) => (
          <button
            key={opt.id}
            onClick={() => onAnswerSelect(opt.id)}
            className="w-full bg-white/10 hover:bg-white/20 transition p-4 rounded-xl text-left"
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}