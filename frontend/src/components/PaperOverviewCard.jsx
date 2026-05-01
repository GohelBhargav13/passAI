export default function PaperOverviewCard({ difficulty,theme }) {
  return (
    <div className={`h-full rounded-2xl border border-slate-200 ${theme === "dark" ? "bg-linear-to-br from-fuchsia-500/50 via-black/85 to-violet-800/50 text-white/80" : "bg-white"} p-6 shadow-sm`}>
      <h2 className="text-2xl font-bold mb-5">Paper Difficulty</h2>
    
      <div className={`h-3 w-full overflow-hidden rounded-full bg-slate-100 hover:scale-105 transition-transform cursor-pointer ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        <div
          className="h-full rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500"
          style={{ width: difficulty + "%" || "0%" }}
        />
      </div>

      <p className={`mt-4 text-base leading-7 hover:scale-105 hover:ml-1 transition-transform ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
        { difficulty ? difficulty + "%" : "N/A" } difficult
      </p>

    </div>
  );
}