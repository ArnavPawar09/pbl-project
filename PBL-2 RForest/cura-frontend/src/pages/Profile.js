function Profile() {
  return (
    <div className="card profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          <span>U</span>
        </div>
        <h2>User Profile</h2>
      </div>

      <div className="profile-info">
        <div className="profile-row">
          <label>Full Name</label>
          <input type="text" placeholder="Arnav Pawar" disabled />
        </div>

        <div className="profile-row">
          <label>Email</label>
          <input type="email" placeholder="arnav@gmail.com" disabled />
        </div>

        <div className="profile-row">
          <label>Phone Number</label>
          <input type="text" placeholder="+91 9876543210" disabled />
        </div>

        <div className="profile-row">
          <label>Age</label>
          <input type="text" placeholder="22" disabled />
        </div>

        <div className="profile-row">
          <label>Gender</label>
          <input type="text" placeholder="Male" disabled />
        </div>
      </div>
    </div>
  );
}

export default Profile;
