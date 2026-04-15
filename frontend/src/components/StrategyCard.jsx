import { Target } from "lucide-react";

export default function StrategyCard({ strategy }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-violet-600" />
        <h2 className="text-xl font-bold text-gray-800">Pass Strategy</h2>
      </div>
      <p className="text-gray-700 leading-7">{strategy}</p>
    </div>
  );
}