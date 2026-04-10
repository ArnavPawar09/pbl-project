import { useState } from "react";

function Profile({ session }) {
  // Dummy user data
  const dummyUser = {
    fullName: "Arnav Pawar",
    email: session?.user?.email || "arnav@gmail.com",
    phone: "1234556789",
    age: "21",
    gender: "Male",
    picture: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
  };

  const [fullName, setFullName] = useState(dummyUser.fullName);
  const [phone, setPhone] = useState(dummyUser.phone);
  const [age, setAge] = useState(dummyUser.age);
  const [gender, setGender] = useState(dummyUser.gender);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const updateProfile = () => {
    setSaving(true);
    setMessage(null);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setMessage("Profile updated successfully!");
    }, 800);
  };

  return (
    <div className="card profile-card">
      <div className="profile-header">
        <div 
          className="profile-avatar" 
          style={{ 
            backgroundImage: `url("${dummyUser.picture}")`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#e2e8f0'
          }}
        ></div>
        <h2>{fullName}</h2>
        <p style={{ color: "var(--text-muted)", marginTop: "-10px", fontSize: "14px" }}>
          Patient Profile
        </p>
      </div>

      <div className="profile-info">
        <div className="profile-row">
          <label>Email</label>
          <input type="email" value={dummyUser.email} disabled />
        </div>

        <div className="profile-row">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Arnav Pawar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="profile-row">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="1234556789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="profile-row" style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label>Age</label>
            <input
              type="text"
              placeholder="21"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label>Gender</label>
            <input
              type="text"
              placeholder="Male"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
        </div>

        {message && (
          <div
            className={message.includes("Error") ? "auth-error" : "auth-success"}
            style={{ 
              padding: "10px", 
              borderRadius: "8px", 
              background: message.includes("Error") ? "#ffebee" : "#e8f5e9",
              color: message.includes("Error") ? "#c62828" : "#2e7d32",
              fontSize: "13px",
              textAlign: "center"
            }}
          >
            {message}
          </div>
        )}

        <button className="upload-btn" onClick={updateProfile} disabled={saving} style={{ marginTop: "10px" }}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
