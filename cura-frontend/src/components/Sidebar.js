import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Sidebar.css";

function Sidebar({ session, guestMode, setGuestMode }) {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (guestMode) {
      setGuestMode(false);
      navigate("/");
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <div className="sidebar">
      <NavLink to="/" className="logo-link">
        <h2 className="logo">CURA AI</h2>
      </NavLink>

      <nav>
        <NavLink to="/dashboard" end>
          <span className="nav-icon">🩺</span> Chatbot
        </NavLink>
        <NavLink to="/report">
          <span className="nav-icon">📄</span> Reports
        </NavLink>
        <NavLink to="/symptoms">
          <span className="nav-icon">📋</span> Symptom Log
        </NavLink>
        <NavLink to="/profile">
          <span className="nav-icon">👤</span> Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <small>{guestMode ? "Guest User" : session?.user?.email}</small>
        <button className="sign-out-btn" onClick={handleSignOut}>
          {guestMode ? "Exit Guest Mode" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
