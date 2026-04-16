import { Notebook, User } from "lucide-react";

export default function UserPrompt({ userprompt }) {
    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full">
            <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-bold text-gray-800">User Prompt</h2>
        </div>
        <p className="text-gray-700 leading-7">{userprompt?.prompt}</p>
         <div className="flex items-center gap-2 mb-4">
            <Notebook className="w-5 h-5 text-violet-600" />
            <h2 className="text-xl font-bold text-gray-800">Prompt Analysis</h2>
        </div>
        <p className="text-gray-700 leading-7">{userprompt?.prompt_analysis}</p>
        </div>
        </>
    )
}