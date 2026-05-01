import { EyeIcon, Loader2, User, X } from "lucide-react";
import React, { use, useState } from "react";
import PaperOverviewCard from "./PaperOverviewCard";
import StrategyCard from "./StrategyCard";
import QuestionCard from "./QuestionCard";
import UserPrompt from "./UserPrompt";
import { useLocation,useNavigate } from "react-router-dom"
import apiClient from "../services/ApiClient";
import toast from "react-hot-toast";

export default function PdfResult({ theme }) {

    const navigate = useNavigate()
    const location = useLocation()
    const apiresponse = location?.state || {};
    const [isShoe,setIsShow] = useState(false)
    const [isOpen,setIsOpen] = useState(false)
    const [isSaving,setIssaving] = useState(false)
    const [userEmail,setUserEmail] = useState(null)

    // handle the show result button click
    const handleShowResult = () => {
        console.log(apiresponse)
        setIsShow(prev => !prev)
    }

    // handle is open function for the save response form
    const handleIsOpen = () => {
        setIsOpen(prev => !prev)
    }

    // handle the response of the save response
     const handleSaveResponse = async(e) => {
       setIssaving(prev => !prev)
       e.preventDefault();
       try {
          const response =  await apiClient.saveUserResponse({ email: userEmail })
          console.log(response)
          if(response?.status){
              toast.success(response?.message || "OTP send to you're email")
              setIsOpen(false)

              navigate("/otp-verification",{ state:{ apiresponse:apiresponse,useremail:userEmail } })
          } else {
              toast.error(response?.error || "Failed to save response. Please try again.")
          }
        
       } catch (error) {
          toast.error(error)
       }
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
                  <div className={`w-full p-5 ${isOpen ? "blur-sm" : ""}`}>
                  {/* Top Grid */}
                  <button className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition mb-2 hover:cursor-pointer" onClick={handleIsOpen}>Save response</button>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
                    <PaperOverviewCard difficulty={apiresponse?.difficulty_paper} theme={theme} />
                    <StrategyCard strategy={apiresponse?.pass_strategy} theme={theme} />

                    {/* check if the prompt is provided */}
                    { apiresponse?.user_prompt?.is_prompt_provided ? (
                        <UserPrompt userprompt={apiresponse?.user_prompt} theme={theme} />
                    ) : (
                        <></>
                    ) } 
                  </div>

                  {/* Bottom Grid */}
                  <section className="space-y-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                      <h2 className={`text-2xl sm:text-3xl font-bold mt-2 ${ theme === "dark" ? "text-white" : "text-slate-900" }`}>
                        Question Analysis
                      </h2>
                      <span className="text-sm text-slate-500">
                        {apiresponse?.questions?.length || 0} questions
                      </span>
                    </div>

                    {/* Grid: Ensure this is not nested inside something with a restricted width */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {apiresponse?.questions?.map((item) => (
                        <QuestionCard key={item.id} item={item} theme={theme}  />
                      ))}
                    </div>
                  </section>
                </div>

        ) }

         { isOpen && (
          // make it mobile responsive and center the form
            <div className="fixed inset-0 opacity-100 flex items-center justify-center z-50 px-4">
              <div className={` ${ theme === "dark" ? " bg-linear-to-br from-fuchsia-400/50 via-black/40 to-violet-500/50 " : "" } rounded-lg p-6 w-96 border border-gray-300 shadow-lg`}>
                <div className="w-full flex gap-5 mb-2">
                <h2 className="text-xl font-semibold mb-4 justify-center">Save Response</h2>
                <X className="text-red-500 cursor-pointer" onClick={handleIsOpen} />
                </div>
                <div className="flex justify-center gap-4">
                  <form method="post" onSubmit={handleSaveResponse} >
                    <input type="email" name="useremail" id="useremail" placeholder="Enter a email" className="border w-65 border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500" onChange={(e) => setUserEmail(e.target.value)} value={userEmail || ''} required/>
                    <button type="submit" disabled={isSaving || !userEmail} className="px-2 py-1 sm:mt-2 md:px-4 md:py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition ml-2 disabled:bg-gray-500 disabled:cursor-not-allowed">
                      { isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save" }
                    </button>
                  </form>
                </div>
              </div>
            </div>
         ) }

        </>
    )
}