import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="logo">CURA - AI</h2>

      <nav>
        <NavLink to="/" end>Chatbot</NavLink>
        <NavLink to="/report">Report Upload</NavLink>
        <NavLink to="/symptoms">Symptom Log</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
