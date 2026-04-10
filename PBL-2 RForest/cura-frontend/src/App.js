import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Chatbot from "./pages/Chatbot";
import ReportUpload from "./pages/ReportUpload";
import SymptomLog from "./pages/SymptomLog";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <Router>
      <Sidebar />

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Chatbot />} />
          <Route path="/report" element={<ReportUpload />} />
          <Route path="/symptoms" element={<SymptomLog />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

