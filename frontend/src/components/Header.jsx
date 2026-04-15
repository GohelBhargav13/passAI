import { FileText } from "lucide-react";

export default function Header() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl shadow-lg shadow-violet-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent leading-tight">
                PassAI
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 leading-tight">
                Analyze your GTU papers with ease
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <a href="/" className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition">
              Home
            </a>
            <button className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition">
              History
            </button>
          </div>

        </div>
      </div>
    </nav>
    )
}