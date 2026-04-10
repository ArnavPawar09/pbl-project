import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

function Auth({ onGuestLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Account created! Check your email for verification, or sign in directly.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="auth-logo">CURA AI</Link>
          <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
          <p>
            {isSignUp
              ? "Sign up to access your personal health assistant"
              : "Sign in to continue to your health dashboard"}
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Arnav Pawar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? "Loading..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <button className="auth-guest-btn" onClick={onGuestLogin}>
          Continue as Guest
        </button>

        <div className="auth-switch">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button onClick={() => setIsSignUp(false)}>Sign In</button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <button onClick={() => setIsSignUp(true)}>Sign Up</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
