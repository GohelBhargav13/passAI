import React, { useEffect } from "react";
import { FileUpload } from "./components/FileUplod";
import { Toaster } from "react-hot-toast"
import Header from "./components/Header";
import { BrowserRouter,Routes,Route,Outlet } from "react-router-dom"
import UserHistory from "./components/UserHistory";
import PaperResponse from "./components/PaperResponse";
import PdfResult from "./components/PdfResult";
import OtpVerification from "./components/OtpVerification";

// define the theme of the app from the local storage and pass it to the header component
function App() {

    let theme = localStorage.getItem("theme");
    if (!theme) {
      theme = localStorage.setItem("theme", "dark");
    }else {
      theme = localStorage.getItem("theme");
    }

  return (
    <>
      <div className={`min-h-screen ${ theme === "dark" ? "bg-linear-to-br from-slate-950 via-slate-900 to-black text-white font-mono" : "bg-gray-50 text-gray-900 font-mono" }`}>
      <BrowserRouter>
        <Header istheme={theme} />
        <Toaster />
        {/* configure a outlet for the file upload and for the history page */}
        <Routes>
          <Route path="/" element={<FileUpload theme={theme} />} />
          <Route path="/user/history" element={<UserHistory theme={theme} />} />
          <Route path="/paper-response/:hid" element={<PaperResponse theme={theme} />} />
          <Route path="/pdf-result" element={<PdfResult theme={theme} />} />
          <Route path="/otp-verification" element={ <OtpVerification theme={theme} /> } />
          <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-3xl font-bold text-gray-700">404 - Page Not Found</h1></div>} />
        </Routes>
      </BrowserRouter>
      </div>
    </>
  )
}

export default App;