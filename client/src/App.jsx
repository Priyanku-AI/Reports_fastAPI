import { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [month, setMonth] = useState("");
  const [response, setResponse] = useState(null);

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

      setResponse(res.data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("File upload failed. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold">Upload Excel File</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} className="border p-2 rounded" />
      <select value={month} onChange={(e) => setMonth(e.target.value)} className="border p-2 rounded w-full">
        <option value="">Select Month</option>
        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <button onClick={handleUpload} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>

      {response && (
        <div className="mt-4 p-4 border rounded">
          <p><strong>File:</strong> {response.file_name}</p>
          <p><strong>Total Hyderabad Addresses:</strong> {response.hyderabad_count}</p>
          <p><strong>Wrong Address Count:</strong> {response.wrong_feedback_count}</p>
          <p>
            <strong>Wrong Address Percentage:</strong>{" "}
            {response.hyderabad_count > 0
              ? ((response.wrong_feedback_count / response.hyderabad_count) * 100).toFixed(2) + "%"
              : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
