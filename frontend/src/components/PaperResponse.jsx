import { useParams } from "react-router-dom"
import apiClient from "../services/ApiClient"
import { useEffect, useState } from "react"
import PaperOverviewCard from "./PaperOverviewCard"
import StrategyCard from "./StrategyCard"
import UserPrompt from "./UserPrompt"
import QuestionCard from "./QuestionCard"
import { Loader2 } from "lucide-react"

export default function PaperResponse({ theme }) {
    const { hid } = useParams()
    const [apiresponse, setApiResponse] = useState({})

    useEffect(() => {
        async function fetchPaperResponse() {
            const response = await apiClient.findPaperResponseById(hid)
            setApiResponse(JSON.parse(response?.data?.paper_response))
        }
        fetchPaperResponse()
    }, [hid])

    if (!apiresponse) {
        return (
            <Loader2 className="w-full h-full justify-center items-center text-black" />
        )
    }
    return (
        <div className={`w-full mt-5 px-5 py-5`}>
            {/* Top Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                <PaperOverviewCard difficulty={apiresponse?.difficulty_paper} theme={theme} />
                <StrategyCard strategy={apiresponse?.pass_strategy} theme={theme} />

                {/* check if the prompt is provided */}
                {apiresponse?.user_prompt?.is_prompt_provided ? (
                    <UserPrompt userprompt={apiresponse?.user_prompt} theme={theme} />
                ) : (
                    <></>
                )}
            </div>

            {/* Bottom Grid */}
            <section className="space-y-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <h2 className={`text-2xl sm:text-3xl font-bold mt-3 ${theme === "dark" ? "text-white/80" : "text-gray-800"}`}>
                        Question Analysis
                    </h2>
                    <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-slate-500"}`}>
                        {apiresponse?.questions?.length || 0} questions
                    </span>
                </div>

                {/* Grid: Ensure this is not nested inside something with a restricted width */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {apiresponse?.questions?.map((item) => (
                        <QuestionCard key={item.id} item={item} theme={theme} />
                    ))}
                </div>
            </section>
        </div>
    )

}