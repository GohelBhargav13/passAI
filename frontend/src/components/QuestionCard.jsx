export default function QuestionCard({ item, theme }) {
  const difficultyStyles = {
    EASY: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    MEDIUM: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    HARD: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };

  return (
    // 'flex flex-col' ensures the card fills the row height set by 'auto-rows-fr'
    <article className={`flex flex-col h-full rounded-2xl border border-slate-200 p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-violet-200 ${theme === "dark" ? "bg-linear-to-br from-fuchsia-500/50 via-black/85 to-violet-800/50 text-white/80" : "bg-white text-gray-950"}`}>
      
      {/* Header Section */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${theme === "dark" ? "bg-linear-to-br from-violet-500 via-black to-violet-800" : "bg-slate-500 text-violet-600"} text-sm font-bold text-white/80`}>
            {item.id}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide">Question</p>
            <p className="text-sm font-semibold">{item.marks} marks</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyles[item.difficulty] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200"} hover:scale-105 transition-transform`}>
          {item.difficulty}
        </span>
      </div>

      {/* Content Section: flex-grow ensures it takes available space */}
      <div className="grow mb-5">
        <h3 className="text-xl font-semibold leading-8 mb-3">
          {item.question}
        </h3>
        <p className="text-sm leading-6">
          {item.reason}
        </p>
      </div>

      {/* Divider */}
      <div className="my-5 h-px" />

      {/* Footer Info */}
      <div className="space-y-4">
        <div>
          <h4 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-violet-500/50" : "text-gray-700"}`}>Brief Answer</h4>
          <p className="text-md leading-7">{item.brief_answer}</p>
        </div>
        <div>
          <h4 className={`text-sm font-semibold mb-1 ${theme === "dark" ? "text-violet-500/50" : "text-gray-700"}`}>Preparation Tip</h4>
          <p className="text-sm leading-7 font-bold">{item.prep_tip}</p>
        </div>
      </div>
    </article>
  );
}