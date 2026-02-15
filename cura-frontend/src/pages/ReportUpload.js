import { useState } from "react";

function ReportUpload() {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only PDF, JPG, and PNG files are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    alert("Upload functionality will be connected to backend soon.");
  };

  return (
    <div className="card upload-card">
      <h2>Upload Medical Report</h2>
      <p>Upload your lab reports or medical documents for analysis.</p>

      <div
        className={`drop-zone ${dragActive ? "active" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="fileInput"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />

        <p>Drag & Drop your file here</p>
        <span>or</span>
        <button onClick={() => document.getElementById("fileInput").click()}>
          Browse Files
        </button>

        <small>Accepted formats: PDF, JPG, PNG (Max 5MB)</small>
      </div>

      {file && (
        <div className="file-preview">
          <strong>Selected File:</strong>
          <p>{file.name}</p>
        </div>
      )}

      <button className="upload-btn" onClick={handleUpload}>
        Upload Report
      </button>
    </div>
  );
}

export default ReportUpload;
