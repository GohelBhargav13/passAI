import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, CheckCircle2, Flashlight } from 'lucide-react';
import PdfResult from "./PdfResult.jsx"
import apiClient from '../services/ApiClient.js';
import toast from 'react-hot-toast';

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAnalyzing,setIsAnalyzing] = useState(false)
  const [isGetRes,setIsRes] = useState(false)
  const [apiresponse,setApiResponse] = useState(null)
  const [userId,setUserId] = useState(null)
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      setSelectedFile(file);
      setIsSubmitted(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setIsSubmitted(false);
    }
  };

  // core function for the submit the file to backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile) {
      // Handle file upload here
      console.log('Uploading file:', selectedFile);
      setIsSubmitted(true);

      // make a call to the backend to upload the file using the api client
      try {
        const  fd = new FormData()
        fd.append("paper-pdf",selectedFile)
        fd.append("userId",userId)
        setIsAnalyzing(true)
        const response = await apiClient.uploadFile(fd);
        console.log('Upload response:',response?.final_response_data);

        if (response?.statuscode >= 400) {
            toast.error(response?.message)
            setIsAnalyzing(false)
            setSelectedFile(null)
            setIsSubmitted(false)
            return
        }
        toast.success(response?.message)
        if (typeof response?.final_response_data === "string") {
          try {
              const formattedResponse = response.final_response_data.replace(/\n/g, "");
              setApiResponse(JSON.parse(formattedResponse))
              setIsRes(true)
          } catch (error) {
              console.error("Error parsing API response:", error);
              toast.error("Failed to parse analysis results.");
              setApiResponse(null)
              setIsRes(false)
              setSelectedFile(null)
              setIsSubmitted(false)
          }
        }else {
              setIsAnalyzing(false)
              setIsRes(true)
              setApiResponse(response?.final_response_data)
        }
      }catch(error){
        console.error('Error uploading file:', error);
        toast.error(error)
        setIsAnalyzing(false)
        setSelectedFile(null)
        setIsSubmitted(false)
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setIsSubmitted(false);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // find the file size in human readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // for fecth the userid from the local storage and set it to the state
  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("userId"));
    setUserId(userId)

    if (userId == null) {
      const userId = crypto.randomUUID()
      localStorage.setItem("userId",JSON.stringify(userId))
      setUserId(userId)
    }

  },[])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-2 ">
  
      {/* Upload Card */}
      { !isGetRes ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-violet-500/10 p-5 mt-4 border border-violet-100">
        <form onSubmit={handleSubmit}>
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-violet-500 bg-violet-50 scale-[1.02]'
                : selectedFile
                ? 'border-green-400 bg-green-50'
                : 'border-violet-200 hover:border-violet-400 hover:bg-violet-50/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="file-upload"
              multiple={true}
            />

            {!selectedFile ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                    <Upload className="w-10 h-10 text-violet-600" />
                  </div>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Drop your file here or{' '}
                    <span className="text-violet-600 hover:text-violet-700 cursor-pointer">
                      browse
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports all file types
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-8 h-8 text-violet-600 flex-shrink-0" />
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='flex gap-3'>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || isSubmitted}
            className={`w-full mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
              selectedFile && !isSubmitted
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transform hover:scale-[1.02]'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitted && isAnalyzing ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Analyzing Paper...
              </span>
            ) : (
              'Upload File'
            )}
          </button>
          <button
                      type="button"
                      onClick={handleRemoveFile}
                      disabled={!selectedFile || isSubmitted || isAnalyzing}
                      className="mt-6 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 bg-gray-200 text-gray-400 hover:bg-red-300 hover:text-red-600 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                    >
                      <X className="w-5 h-5" />
                    </button>
        </div>
        </form>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-violet-50 rounded-xl border border-violet-100">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-violet-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-violet-700 text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-700 mb-1">Quick Tips:</p>
              <ul className="space-y-1 text-gray-600">
                <li>• Drag and drop your file into the upload area</li>
                <li>• Click anywhere in the box to browse files</li>
                <li>• Remove selected file by clicking the X button</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      ) : (
          <PdfResult apiresponse={apiresponse} />
      ) }
    </div>
  );
}
