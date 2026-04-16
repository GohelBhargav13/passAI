import { EyeIcon, User } from "lucide-react";
import React, { useState } from "react";
import PaperOverviewCard from "./PaperOverviewCard";
import StrategyCard from "./StrategyCard";
import QuestionCard from "./QuestionCard";
import UserPrompt from "./UserPrompt";

export default function PdfResult({ apiresponse }){
    const [isShoe,setIsShow] = useState(false)

    // handle the show result button click
    const handleShowResult = () => {
        console.log(apiresponse)
        setIsShow(prev => !prev)
    }

    return (
        <>
            { !isShoe ? (
                <div className="bg-white rounded-3xl shadow-xl shadow-violet-500/10 p-5 mt-4 border border-violet-100 flex flex-col items-center gap-6">
                <EyeIcon className="w-12 h-12 text-violet-600" onClick={handleShowResult} />
                <h2 className="text-xl font-semibold text-gray-700">
                </h2>
                <p className="text-gray-600 text-center">
                    Your paper has been analyzed. Click the button below to view the results.
                </p>
            </div>
            ) : (
                  <div className="w-full">
                  {/* Top Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    <PaperOverviewCard difficulty={apiresponse?.diffculty_paper} />
                    <StrategyCard strategy={apiresponse?.pass_strategy} />

                    {/* check if the prompt is provided */}
                    { apiresponse?.user_prompt?.is_prompt_provided ? (
                        <UserPrompt userprompt={apiresponse?.user_prompt} />
                    ) : (
                        <></>
                    ) } 
                  </div>

                  {/* Bottom Grid */}
                  <section className="space-y-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                        Question Analysis
                      </h2>
                      <span className="text-sm text-slate-500">
                        {apiresponse?.questions?.length || 0} questions
                      </span>
                    </div>

                    {/* Grid: Ensure this is not nested inside something with a restricted width */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {apiresponse?.questions?.map((item) => (
                        <QuestionCard key={item.id} item={item} />
                      ))}
                    </div>
                  </section>
                </div>

        ) }

        </>
    )
}