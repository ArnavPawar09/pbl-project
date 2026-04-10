import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">CURA AI</div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
          <Link to="/dashboard" className="landing-nav-cta">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="landing-badge">AI-Powered Health Intelligence</span>
          <h1>
            Your Personal
            <br />
            <span className="hero-highlight">Health Assistant</span>
          </h1>
          <p className="landing-hero-sub">
            Describe your symptoms, get instant AI-powered predictions, and
            receive safe home remedies — all backed by machine learning and
            medical knowledge.
          </p>
          <div className="landing-hero-actions">
            <Link to="/dashboard" className="btn-primary">
              Start Diagnosis →
            </Link>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>
          <div className="landing-hero-stats">
            <div className="stat-item">
              <span className="stat-number">19</span>
              <span className="stat-label">Diseases Detected</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">88</span>
              <span className="stat-label">Symptom Features</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">96%</span>
              <span className="stat-label">Model Accuracy</span>
            </div>
          </div>
        </div>
        <div className="landing-hero-visual">
          <div className="hero-card-stack">
            <div className="hero-float-card card-1">
              <span className="float-icon">🩺</span>
              <div>
                <strong>Symptom Analysis</strong>
                <p>ML-powered prediction</p>
              </div>
            </div>
            <div className="hero-float-card card-2">
              <span className="float-icon">🧠</span>
              <div>
                <strong>AI Chat Assistant</strong>
                <p>Ask about any disease</p>
              </div>
            </div>
            <div className="hero-float-card card-3">
              <span className="float-icon">💊</span>
              <div>
                <strong>Home Remedies</strong>
                <p>Safe, natural advice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features" id="features">
        <h2 className="section-title">What Cura AI Offers</h2>
        <p className="section-subtitle">
          Built for everyday health, powered by machine learning and LLM
          intelligence.
        </p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Symptom Checker</h3>
            <p>
              Enter your symptoms and get instant disease predictions using our
              trained SVM and Random Forest models with 96% accuracy.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>AI Health Chat</h3>
            <p>
              Ask questions about any disease — get clear explanations, home
              remedies, and guidance. No medication advice, just safe
              information.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Symptom Log</h3>
            <p>
              Track your symptoms over time with timestamps and notes. Build a
              personal health history you can share with your doctor.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📄</div>
            <h3>Report Upload</h3>
            <p>
              Upload your medical reports and lab results for safekeeping —
              always have your health documents at your fingertips.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="landing-how" id="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Three simple steps to better health insight.</p>
        <div className="how-steps">
          <div className="how-step">
            <div className="step-number">01</div>
            <h3>Describe Symptoms</h3>
            <p>Select or type your symptoms into the Symptom Checker.</p>
          </div>
          <div className="how-connector"></div>
          <div className="how-step">
            <div className="step-number">02</div>
            <h3>Get Prediction</h3>
            <p>Our ML models analyze your symptoms and predict possible conditions.</p>
          </div>
          <div className="how-connector"></div>
          <div className="how-step">
            <div className="step-number">03</div>
            <h3>Receive Guidance</h3>
            <p>Get home remedies and chat with Cura AI for more information.</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="landing-about" id="about">
        <div className="about-content">
          <h2>Built with Purpose</h2>
          <p>
            Cura AI is an academic project built to demonstrate how AI and
            machine learning can be applied to everyday healthcare. It combines
            classical ML (SVM, Random Forest) with modern LLM technology to
            create a comprehensive health assistant.
          </p>
          <p className="about-disclaimer">
            ⚠️ Cura AI is for informational purposes only. It does not provide
            medical diagnoses or prescribe medications. Always consult a
            qualified healthcare professional.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <span className="footer-logo">CURA AI</span>
          <span className="footer-copy">
            © 2026 Cura AI · Academic Project · MUJ
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
