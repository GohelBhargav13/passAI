export default function PaperOverviewCard({ difficulty }) {
  return (
    <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-5">Paper Difficulty</h2>

      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-linear-to-r from-violet-600 to-fuchsia-500"
          style={{ width: difficulty || "0%" }}
        />
      </div>

      <p className="mt-4 text-base leading-7 text-slate-700">
        {difficulty || "N/A"} difficult
      </p>
    </div>
  );
}