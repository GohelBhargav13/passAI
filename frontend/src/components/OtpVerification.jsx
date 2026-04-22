import { useState } from "react";
import { data, useLocation,useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient";
import toast from "react-hot-toast";

export default function OtpVerification() {
    const [code,setCode] = useState("")
    const [isVerify,setIsVerify] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    // fetch the user email for the resend otp
    const handleResendOtp = async() => {
      const useremail = location?.state?.useremail || ""
      console.log(location)
      try {
        const response = await apiClient.userResendOtp(useremail)
        if (!response?.status) {
            toast.error(response?.message)
            return;
        }
        toast.success(response?.message)
      } catch (error) {
          toast.error(error)
      }
    }

    // handle submit page for OTP
    const handleSubmit = async(e) => {
        e.preventDefault()
        setIsVerify(true)
    try {
        const respose = await apiClient.verifyOtpFunc(code)
        if (respose?.status) {
            toast.success(respose?.message || "OTP matched successfully")
            const apiresponse = location?.state?.apiresponse || {}
            
            // call a save response in the database
            if (apiresponse) {
                const data = {
                    "user_paper_response":apiresponse,
                    "user_email":respose?.user_email
                }
               const response_db =  await apiClient.saveUserPaperAnalysis(data)
               if (response_db?.status) {
                    toast.success(response_db?.message || "Data is saved")
                    setTimeout(() => {
                        navigate(`/paper-response/${response_db["history_id"]}`)
                    }, 500);

               }else {
                    toast.error(response_db?.message || "Error while save a data in the database")
                    setIsVerify(false)
               }
            }else {
                toast.error("paper data is not found")
                setIsVerify(false)
            }

        }else {
            toast.error(respose?.message || "Error in OTP verification")
            setIsVerify(false)
        }
            
        } catch (error) {
            toast.error(error)
        }
    }
    return(
        <>
        {/* design a otp page for 6 - digit like github otp verification */}
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-white/10 bg-[#161b22] rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-center mb-5">
            <svg
              viewBox="0 0 16 16"
              className="w-10 h-10 fill-white"
              aria-hidden="true"
            >
            </svg>
          </div>

          <h1 className="text-white text-xl font-semibold text-center">
            Enter verification code
          </h1>

          <p className="text-sm text-gray-400 text-center mt-2 leading-6">
            Type the 6-digit code sent to your email address to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <label className="block text-sm text-gray-300 mb-2">
              Verification code
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={ (e) => setCode(e.target.value) }
              placeholder="XXXXXX"
              className="w-full h-12 rounded-md border border-white/10 bg-[#0d1117] px-4 text-center text-lg tracking-[0.4em] text-white placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />

            <button
              type="submit"
              disabled={code.length < 6 || isVerify}
              className={`w-full mt-4 h-10 rounded-md bg-[#238636] text-white text-sm font-medium hover:bg-[#2ea043] transition cursor-pointer disabled:bg-gray-400 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              { isVerify ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="mt-5 text-center text-sm">    
            <button className="text-blue-400 hover:underline" onClick={handleResendOtp} >
              Resend code
            </button>
          </div>
        </div>
      </div>
    </div>
        
        </>
    )
}