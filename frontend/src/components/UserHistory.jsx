import { useEffect, useState } from "react";
import apiClient from "../services/ApiClient.js";
import { toast } from "react-hot-toast";

export default function UserHistory({ theme }) {
  const [userHistory, setUserHistory] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [isSearch,setIsSearching] = useState(false)
  const [isDeleting,setIsDeleting] = useState(false)
  const [paperHistoryId,setPaperHistoryId] = useState(null);

  const columns = [
    "h_id",
    "university_name",
    "search_time",
    "subject_name",
    "branch_name",
    "subject_code",
    "paper_response",
    "paper_year",
    "Delete_action"
  ];

  const fetchUserHistory = async () => {
    try {
      setIsSearching(true)
      const userResponse = await apiClient.findUserHistory(userEmail);

      if (!userResponse?.status) {
        toast.error(userResponse?.message || "Failed to fetch user history");
        setUserHistory([]);
        return;
      }

      setUserHistory(userResponse?.data || []);
      setUserEmail("")

    } catch (error) {
      toast.error("Something went wrong while fetching history");
      console.error(error);
      setIsSearching(false)
    }finally{
      setIsSearching(false)
      setUserEmail("")
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserHistory();
    }
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    fetchUserHistory();
  }

  function handleViewResponse(historyId) {
    window.location.href = `/paper-response/${historyId}`;
  }

  async function handleDeleteHistory(historyId){
    try {
      setPaperHistoryId(historyId)
      setIsDeleting(true)
       const response = await apiClient.paperHistoryDelete(historyId)
       if (response?.status) {
          toast.success(response?.message)
          setUserHistory(prev => prev.filter(uhis => uhis?.h_id !== historyId))
       }else{
          console.error(response?.message)
          toast.error(response?.message)
          setIsDeleting(false)
       }
      
    } catch (error) {
        toast.error(error)
    }finally{
      setIsDeleting(false)
      setPaperHistoryId(null)
    }
  }


  return (
    <div className={`min-h-screen ${ theme === "dark" ? "bg-linear-to-br from-slate-950 via-slate-900 to-black text-white font-mono" : "bg-gray-50 text-gray-900 font-mono" } px-3 py-4 sm:px-6 sm:py-8`}>
      <div className={`mx-auto max-w-7xl rounded-2xl border border-violet-100 ${ theme === "dark" ? "bg-linear-to-br from-fuchsia-500/30 via-black/40 to-violet-500/30 text-white/10" : "bg-white"}  p-4 shadow-sm sm:p-6`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className={`text-2xl font-bold ${ theme === "dark" ? "text-violet-400/50" : "text-violet-600" }  sm:text-3xl`}>
              Paper Search History
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              View you're paper history
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"
          >
            <input
              type="email"
              name="useremail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user email"
              className={`h-11 w-full rounded-lg border border-violet-200 px-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-200 sm:w-72 ${ theme === "dark" ? "bg-transparent text-white" : "bg-white text-gray-900" }`}
            />
            <button
              type="submit"
              disabled={ isSearch || !userEmail }
              className="h-11 rounded-lg cursor-pointer bg-violet-600 px-4 text-sm font-medium text-white transition hover:bg-violet-700 disabled:bg-gray-500 disabled:text-white disabled:cursor-not-allowed"
            >
              {  isSearch ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-violet-100">
          <table className="min-w-300 border-collapse text-sm">
            <caption className="bg-violet-50 px-4 py-3 text-left font-semibold text-violet-700">
              Recent searched papers
            </caption>

            <thead className="bg-violet-700 text-center text-xs font-semibold uppercase tracking-wide text-white">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="whitespace-nowrap px-4 py-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {userHistory.length > 0 ? (
                userHistory.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-white" : "bg-violet-50/80"}
                  >
                    <td className="whitespace-nowrap px-4 py-3">{index + 1}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row?.university_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row?.search_time
                        ? new Date(row?.search_time).toLocaleString()
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row?.subject_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row?.branch_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row?.subject_code}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => handleViewResponse(row?.h_id)}
                        className="rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700"
                      >
                        View Response
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row?.paper_year}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => handleDeleteHistory(row?.h_id)}
                        disabled={isDeleting && paperHistoryId === row?.h_id}
                        className={`rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer`}
                      >
                        { isDeleting && paperHistoryId === row?.h_id ? "Deleting..." : "Delete" }
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}