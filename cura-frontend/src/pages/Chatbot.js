import { useState, useRef, useEffect } from "react";

function Chatbot() {
  const [activeTab, setActiveTab] = useState("symptoms"); // "symptoms" or "chat"

  // ===== Symptom Prediction State =====
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am Cura AI. Please enter your symptoms separated by commas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featureColumns, setFeatureColumns] = useState([]);

  // ===== LLM Chat State =====
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I'm Cura AI. Ask me anything about diseases, symptoms, or home remedies. I'm here to help! 🩺",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const chatBoxRef = useRef(null);
  const llmChatBoxRef = useRef(null);

  // Fetch feature columns from backend on mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/symptoms")
      .then((res) => res.json())
      .then((data) => {
        if (data.symptoms) {
          setFeatureColumns(data.symptoms);
        }
      })
      .catch(() => {
        // fallback: use hardcoded list
        setFeatureColumns([
          "fever", "cough", "headache", "fatigue", "sore_throat",
          "nausea", "vomiting", "dizziness", "shortness_of_breath",
          "chest_tightness"
        ]);
      });
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (activeTab === "symptoms" && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
    if (activeTab === "chat" && llmChatBoxRef.current) {
      llmChatBoxRef.current.scrollTop = llmChatBoxRef.current.scrollHeight;
    }
  }, [messages, chatMessages, activeTab]);

  const severityColor = (severity) => {
    if (severity === "mild") return "#28a745";
    if (severity === "moderate") return "#ff9800";
    return "#dc3545";
  };

  const formatSymptom = (sym) => sym.replace(/_/g, " ");

  // ===== Symptom Prediction Handlers =====
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
        .map((s) => s.trim().toLowerCase().replace(/ /g, "_"))
        .filter(Boolean);

      if (!currentSymptoms.includes(selected)) {
        return [...currentSymptoms, selected]
          .map((s) => formatSymptom(s))
          .join(", ");
      }
      return prevInput;
    });

    e.target.value = "";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const symptomList = input
      .split(",")
      .map((s) => s.trim().toLowerCase().replace(/ /g, "_"))
      .filter(Boolean);

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setSuggestions([]);

    const validSymptoms = symptomList.filter((sym) =>
      featureColumns.includes(sym)
    );

    if (validSymptoms.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Please enter valid medical symptoms separated by commas. You can select from the dropdown.",
        },
      ]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: validSymptoms }),
      });

      const data = await response.json();
      setLoading(false);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Predicted Disease: ${data.predicted_disease}`,
          severity: data.severity,
          remedy: data.remedy,
          confidence: data.confidence,
        },
      ]);
    } catch (error) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  // ===== LLM Chat Handlers =====
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatMessages,
        }),
      });

      const data = await response.json();
      setChatLoading(false);

      if (data.error) {
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.error },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.reply },
        ]);
      }
    } catch (error) {
      setChatLoading(false);
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Failed to connect. Please try again." },
      ]);
    }
  };

  // ===== RENDER =====
  return (
    <div className="chat-container card">
      <div className="chat-header">
        <h2>CURA AI Assistant</h2>
        <p>Describe your symptoms or ask about diseases</p>
      </div>

      {/* Tab Switcher */}
      <div className="tab-switcher">
        <button
          className={`tab-btn ${activeTab === "symptoms" ? "active" : ""}`}
          onClick={() => setActiveTab("symptoms")}
        >
          🩺 Symptom Checker
        </button>
        <button
          className={`tab-btn ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          💬 Ask Cura AI
        </button>
      </div>

      {/* ===== SYMPTOM CHECKER TAB ===== */}
      {activeTab === "symptoms" && (
        <>
          <div className="chat-box" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div>{msg.text}</div>

                {msg.remedy && (
                  <>
                    <div
                      className="severity-badge"
                      style={{
                        background: severityColor(msg.severity),
                      }}
                    >
                      {msg.severity.toUpperCase()}
                    </div>
                    <div className="confidence">
                      Confidence: {msg.confidence}%
                    </div>
                    <div className="remedy">{msg.remedy}</div>
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
              {featureColumns.map((sym, i) => (
                <option key={i} value={sym}>
                  {formatSymptom(sym)}
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
                    .toLowerCase()
                    .replace(/ /g, "_");
                  if (lastWord.length > 0) {
                    const filtered = featureColumns.filter((sym) =>
                      sym.startsWith(lastWord)
                    );
                    setSuggestions(filtered.slice(0, 8));
                  } else {
                    setSuggestions([]);
                  }
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((sym, i) => (
                    <div
                      key={i}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(formatSymptom(sym))}
                    >
                      {formatSymptom(sym)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleSend}>
              {loading ? "Analyzing..." : "Send"}
            </button>
          </div>
        </>
      )}

      {/* ===== LLM CHAT TAB ===== */}
      {activeTab === "chat" && (
        <>
          <div className="chat-box" ref={llmChatBoxRef}>
            {chatMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
              </div>
            ))}

            {chatLoading && (
              <div className="message ai typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>

          <div className="chat-input-area">
            <div className="input-wrapper" style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Ask about any disease, symptom, or home remedy..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              />
            </div>

            <button onClick={handleChatSend}>
              {chatLoading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Chatbot;
