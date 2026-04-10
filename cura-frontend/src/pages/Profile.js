import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

function Profile({ session }) {
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone, age, gender")
        .eq("id", session.user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.warn(error);
      }

      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setAge(data.age || "");
        setGender(data.gender || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const updates = {
        id: session.user.id,
        full_name: fullName,
        email: session.user.email,
        phone,
        age,
        gender,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) throw error;

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Error updating profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card profile-card">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="card profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>{fullName ? fullName.charAt(0).toUpperCase() : "U"}</span>
        </div>
        <h2>User Profile</h2>
      </div>

      <div className="profile-info">
        <div className="profile-row">
          <label>Email</label>
          <input type="email" value={session.user.email} disabled />
        </div>

        <div className="profile-row">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="profile-row">
          <label>Phone Number</label>
          <input
            type="text"
            placeholder="+91 9876543210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="profile-row">
          <label>Age</label>
          <input
            type="text"
            placeholder="22"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="profile-row">
          <label>Gender</label>
          <input
            type="text"
            placeholder="Male"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </div>

        {message && (
          <div
            className={
              message.includes("Error") ? "auth-error" : "auth-success"
            }
          >
            {message}
          </div>
        )}

        <button className="upload-btn" onClick={updateProfile} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

export default Profile;
