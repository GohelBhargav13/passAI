import React from "react";
import { FileUpload } from "./components/FileUplod";
import { Toaster } from "react-hot-toast"
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Toaster />
      <FileUpload />
    </>
  )
}

export default App;