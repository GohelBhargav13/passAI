import React from "react";
import { FileUpload } from "./components/FileUplod";
import { Toaster } from "react-hot-toast"
import Header from "./components/Header";
import { BrowserRouter,Routes,Route,Outlet } from "react-router-dom"
import UserHistory from "./components/UserHistory";
import PaperResponse from "./components/PaperResponse";
import PdfResult from "./components/PdfResult";
import OtpVerification from "./components/OtpVerification";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Toaster />
        {/* configure a outlet for the file upload and for the history page */}
        <Routes>
          <Route path="/" element={<FileUpload />} />
          <Route path="/user/history" element={<UserHistory />} />
          <Route path="/paper-response/:hid" element={<PaperResponse />} />
          <Route path="/pdf-result" element={<PdfResult />} />
          <Route path="/otp-verification" element={ <OtpVerification /> } />
          <Route path="*" element={<div className="flex items-center justify-center h-screen"><h1 className="text-3xl font-bold text-gray-700">404 - Page Not Found</h1></div>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;