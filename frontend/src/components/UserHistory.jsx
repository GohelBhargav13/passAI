import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import apiClient from "../services/ApiClient.js"
import { toast } from "react-hot-toast"

export default function UserHistory() { 
    const { uuid } = useParams()
    const [isUserHistory,setUserHistory] = useState([])

    // make a one api call to get a user history based on uuid
    useEffect(() => {

        async function fetchUserHistory() {
        const userResponse = await apiClient.findUserHistory(uuid)

        console.log(userResponse)

        // if the status is false than toast
        if (!userResponse?.status) {
            toast.error(userResponse?.message || "Failed to fetch user history")
            setUserHistory([])
            return;
        }

        setUserHistory(userResponse?.data || [])
        toast.success(userResponse?.message)
    }

    fetchUserHistory()
    },[uuid])

// define the columns for the table
    const columns = [
        "h_id",
        "university_name",
        "paper_name",
        "search_time",
        "subject_name",
        "branch_name",
        "subject_code",
        "paper_response",
        "paper_year",
];

// write a function that call the api to get the paper response
async function handleViewResponse(historyId) {
    // forward request to the paper response page with the history id
    window.location.href = `/paper-response/${historyId}`;
}
    
    return (
        <>
           <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Paper Search History</h1>
        <p style={styles.subtitle}>
          Simple table layout for paper history records.
        </p>

        <div style={styles.tableWrapper}>
          <table style={styles.table} border="1px">
            <caption style={styles.caption}>Recent searched papers</caption>
            <thead className="text-center text-sm font-medium border-b-2">
              <tr>
                {columns.map((col) => (
                  <th key={col} scope="col" style={styles.th}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="text-center font-medium">
              {isUserHistory.map((row, index) => (
                <tr key={index} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd} className="border-b-2">
                    <td>{index + 1}</td>
                    <td>{row?.university_name}</td>
                    <td>{row?.paper_name}</td>
                    <td>{ new Date(row?.search_time).toDateString() }</td>
                    <td>{row?.subject_name}</td>
                    <td>{row?.branch_name}</td>
                    <td>{row?.subject_code}</td>
                    <td>
                        <button onClick={() => handleViewResponse(row["h_id"])} className="mt-3  bg-purple-700 cursor-pointer text-white font-bold py-1.5 px-1.5 rounded">
                            View Response
                        </button>
                    </td>
                    <td>{row?.paper_year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </>
    )
}   
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f5ff",
    padding: "32px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  card: {
    maxWidth: "1400px",
    margin: "0 auto",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 30px rgba(107, 70, 193, 0.08)",
    border: "1px solid #ede9fe",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#4c1d95",
  },
  subtitle: {
    marginTop: "8px",
    marginBottom: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },
  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #e9d5ff",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1200px",
  },
  caption: {
    textAlign: "left",
    padding: "14px 16px",
    fontWeight: "600",
    color: "#6b21a8",
    background: "#faf5ff",
    captionSide: "top",
  },
  th: {
    background: "#7c3aed",
    color: "#ffffff",
    textAlign: "left",
    padding: "14px 16px",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 16px",
    borderTop: "1px solid #f3e8ff",
    color: "#374151",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },
  rowEven: {
    background: "#ffffff",
  },
  rowOdd: {
    background: "#fcfaff",
  },
};