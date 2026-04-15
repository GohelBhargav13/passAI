export default function QuestionCard({ item }) {
  const difficultyStyles = {
    EASY: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    MEDIUM: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    HARD: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  };

  return (
    // 'flex flex-col' ensures the card fills the row height set by 'auto-rows-fr'
    <article className="flex flex-col h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-violet-200">
      
      {/* Header Section */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-sm font-bold text-violet-700">
            {item.id}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Question</p>
            <p className="text-sm font-semibold text-slate-900">{item.marks} marks</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${difficultyStyles[item.difficulty] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200"}`}>
          {item.difficulty}
        </span>
      </div>

      {/* Content Section: flex-grow ensures it takes available space */}
      <div className="flex-grow">
        <h3 className="text-xl font-semibold leading-8 text-slate-900 mb-3">
          {item.question}
        </h3>
        <p className="text-sm leading-6 text-slate-500">
          {item.reason}
        </p>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-slate-200" />

      {/* Footer Info */}
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">Brief Answer</h4>
          <p className="text-sm leading-7 text-slate-600">{item.brief_answer}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-1">Preparation Tip</h4>
          <p className="text-sm leading-7 text-slate-600">{item.prep_tip}</p>
        </div>
      </div>
    </article>
  );
}