import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Chatbot from "./pages/Chatbot";
import ReportUpload from "./pages/ReportUpload";
import SymptomLog from "./pages/SymptomLog";
import Profile from "./pages/Profile";
import "./App.css";

function AppContent({ session, guestMode, setGuestMode }) {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isAuth = location.pathname === "/auth";
  const isLoggedIn = session || guestMode;

  // Pages that don't show sidebar
  if (isLanding || isAuth) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/auth"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Auth onGuestLogin={() => setGuestMode(true)} />
            )
          }
        />
      </Routes>
    );
  }

  // Protected routes — redirect to auth if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      <Sidebar session={session} guestMode={guestMode} setGuestMode={setGuestMode} />
      <div className="main-content">
        <Routes>
          <Route path="/dashboard" element={<Chatbot />} />
          <Route path="/report" element={<ReportUpload />} />
          <Route path="/symptoms" element={<SymptomLog />} />
          <Route
            path="/profile"
            element={<Profile session={session} />}
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setGuestMode(false); // Exit guest mode on real login
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <AppContent session={session} guestMode={guestMode} setGuestMode={setGuestMode} />
    </Router>
  );
}

export default App;
