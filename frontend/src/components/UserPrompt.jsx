import { Notebook, User } from "lucide-react";

export default function UserPrompt({ userprompt,theme }) {
    return (
        <>
            <div className={`rounded-2xl shadow-sm border border-gray-200 p-6 h-full ${theme === "dark" ? "bg-linear-to-br from-fuchsia-500/50 via-black/85 to-violet-800/50 text-white/80" : "bg-white text-gray-700"}`}>
            <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-bold">User Prompt</h2>
        </div>
        <p className="leading-7">{userprompt?.prompt}</p>
         <div className="flex items-center gap-2 mb-4">
            <Notebook className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-bold">Prompt Analysis</h2>
        </div>
        <p className="leading-7">{userprompt?.prompt_analysis}</p>
        </div>
        </>
    )
}