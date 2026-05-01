import { Target } from "lucide-react";

export default function StrategyCard({ strategy,theme }) {
  return (
    <div className={`rounded-2xl shadow-sm border border-gray-200 p-6 h-full ${theme === "dark" ? "bg-linear-to-br from-fuchsia-500/50 via-black/85 to-violet-800/50 text-white/80" : "bg-white"}`}>
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-violet-600" />
        <h2 className="text-xl font-bold">Pass Strategy</h2>
      </div>
      <p className="leading-7">{strategy}</p>
    </div>
  );
}