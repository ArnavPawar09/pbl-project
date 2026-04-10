import { useState, useRef, useEffect } from "react";

const commonSymptoms = [
  "fever",
  "cough",
  "headache",
  "fatigue",
  "sore throat",
  "nausea",
  "vomiting",
  "chest pain",
  "weakness",
  "dizziness"
];

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "Hello! I am Cura AI. Please enter your symptoms separated by commas."
    }
  ]);

  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatBoxRef = useRef(null);

  /* Scroll only inside chat area */
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop =
        chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const severityColor = (severity) => {
    if (severity === "mild") return "#28a745";
    if (severity === "moderate") return "#ff9800";
    return "#dc3545";
  };

  const handleSuggestionClick = (symptom) => {
    const parts = input.split(",");
    parts[parts.length - 1] = " " + symptom;
    const newInput = parts.join(",");
    setInput(newInput.trim());
    setSuggestions([]);
  };

  const handleDropdownSelect = (e) => {
    const selected = e.target.value;
    if (!selected) return;

    setInput((prevInput) => {
      const currentSymptoms = prevInput
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (!currentSymptoms.includes(selected)) {
        return [...currentSymptoms, selected].join(", ");
      }

      return prevInput;
    });

    e.target.value = "";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const symptomList = input
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input }
    ]);

    setInput("");
    setSuggestions([]);

    const validSymptoms = symptomList.filter((sym) =>
      commonSymptoms.includes(sym)
    );

    if (validSymptoms.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Please enter valid medical symptoms separated by commas."
        }
      ]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ symptoms: validSymptoms })
        }
      );

      const data = await response.json();

      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Predicted Disease: ${data.predicted_disease}`,
          severity: data.severity,
          remedy: data.remedy,
          confidence: data.confidence
        }
      ]);
    } catch (error) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            "Something went wrong. Please try again."
        }
      ]);
    }
  };

  return (
    <div className="chat-container card">
      <div className="chat-header">
        <h2>CURA AI Assistant</h2>
        <p>
          Describe your symptoms and receive medical guidance
        </p>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender}`}
          >
            <div>{msg.text}</div>

            {msg.remedy && (
              <>
                <div
                  className="severity-badge"
                  style={{
                    background: severityColor(
                      msg.severity
                    )
                  }}
                >
                  {msg.severity.toUpperCase()}
                </div>

                <div className="confidence">
                  Confidence: {msg.confidence}%
                </div>

                <div className="remedy">
                  {msg.remedy}
                </div>
              </>
            )}
          </div>
        ))}

        {loading && (
          <div className="message ai typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="chat-input-area">
        <select
          className="symptom-dropdown"
          onChange={handleDropdownSelect}
        >
          <option value="">Select Symptom</option>
          {commonSymptoms.map((sym, i) => (
            <option key={i} value={sym}>
              {sym}
            </option>
          ))}
        </select>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Type symptoms (e.g. fever, cough)"
            value={input}
            onChange={(e) => {
              const value = e.target.value;
              setInput(value);

              const lastWord = value
                .split(",")
                .pop()
                .trim()
                .toLowerCase();

              if (lastWord.length > 0) {
                const filtered =
                  commonSymptoms.filter((sym) =>
                    sym.startsWith(lastWord)
                  );
                setSuggestions(filtered);
              } else {
                setSuggestions([]);
              }
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
          />

          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((sym, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() =>
                    handleSuggestionClick(sym)
                  }
                >
                  {sym}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSend}>
          {loading ? "Analyzing..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;




