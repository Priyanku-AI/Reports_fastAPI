import { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function App() {
  const [file, setFile] = useState(null);
  const [month, setMonth] = useState("");
  const [reports, setReports] = useState([]); // Store multiple reports

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !month) {
      alert("Please select a file and choose a month.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("month", month);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload-excel/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Store new report alongside existing reports
      setReports((prevReports) => [...prevReports, { month, data: res.data }]);

      // Reset file input
      setFile(null);
      document.getElementById("fileInput").value = "";
    } catch (error) {
      console.error("Upload failed", error);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Upload Excel File</h2>
      <input id="fileInput" type="file" accept=".xlsx" onChange={handleFileChange} className="border p-2 rounded" />
      <select value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded w-full">
        <option value="">Select Month</option>
        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>

      {/* Reports Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <div key={index} className="p-4 border rounded shadow">
            <h3 className="text-lg font-bold">{report.month} Report</h3>
            <p><strong>Total Hyderabad Addresses:</strong> {report.data.hyderabad_count}</p>
            <p><strong>Wrong Address Count:</strong> {report.data.wrong_feedback_count}</p>
            <p>
              <strong>Wrong Address Percentage:</strong>{" "}
              {report.data.hyderabad_count > 0
                ? ((report.data.wrong_feedback_count / report.data.hyderabad_count) * 100).toFixed(2) + "%"
                : "N/A"}
            </p>

            {/* Pie Chart */}
            <h4 className="text-md font-bold mt-4">Wrong vs Correct Addresses</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Wrong Addresses", value: report.data.wrong_feedback_count },
                    { name: "Correct Addresses", value: report.data.hyderabad_count - report.data.wrong_feedback_count },
                  ]}
                  cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label
                >
                  <Cell key="wrong" fill="#FF4D4D" />
                  <Cell key="correct" fill="#4CAF50" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>

            {/* Bar Chart */}
            <h4 className="text-md font-bold mt-4">Total vs Wrong Addresses</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: "Hyderabad Addresses", count: report.data.hyderabad_count },
                { name: "Wrong Addresses", count: report.data.wrong_feedback_count },
              ]}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
