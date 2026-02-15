import { useState, useEffect } from "react";

function SymptomLog() {
  const [symptom, setSymptom] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [logs, setLogs] = useState([]);

  // Load saved logs from localStorage
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("symptomLogs")) || [];
    setLogs(savedLogs);
  }, []);

  // Save logs to localStorage
  useEffect(() => {
    localStorage.setItem("symptomLogs", JSON.stringify(logs));
  }, [logs]);

  const handleAddLog = () => {
    if (!symptom || !date || !time) {
      alert("Please fill all required fields.");
      return;
    }

    const newLog = {
      id: Date.now(),
      symptom,
      date,
      time,
      description
    };

    setLogs([newLog, ...logs]);

    setSymptom("");
    setDate("");
    setTime("");
    setDescription("");
  };

  const handleDelete = (id) => {
    const updatedLogs = logs.filter(log => log.id !== id);
    setLogs(updatedLogs);
  };

  return (
    <div className="card symptom-card">
      <h2>Symptom Log</h2>
      <p>Track your symptoms over time.</p>

      <div className="symptom-form">
        <input
          type="text"
          placeholder="Symptom (e.g. headache)"
          value={symptom}
          onChange={(e) => setSymptom(e.target.value)}
        />

        <div className="date-time-row">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <textarea
          placeholder="Additional description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button onClick={handleAddLog}>Add Entry</button>
      </div>

      <div className="log-list">
        {logs.length === 0 && <p>No symptom entries yet.</p>}

        {logs.map(log => (
          <div key={log.id} className="log-item">
            <div className="log-header">
              <strong>{log.symptom}</strong>
              <span>{log.date} | {log.time}</span>
            </div>

            {log.description && (
              <p className="log-description">{log.description}</p>
            )}

            <button
              className="delete-btn"
              onClick={() => handleDelete(log.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SymptomLog;

