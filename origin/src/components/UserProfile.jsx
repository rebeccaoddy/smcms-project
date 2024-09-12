import React from 'react';
import BackButton from './BackButton';

const UserProfile = ({ user }) => {
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="user-profile">
      <BackButton />

      <h2>User Profile</h2>

      <div className="profile-details">
        <div className="profile-item">
          <strong>Username:</strong> <span>{user.username}</span>
        </div>
        <div className="profile-item">
          <strong>Email:</strong> <span>{user.email || 'Not provided'}</span>
        </div>
        <div className="profile-item">
          <strong>Role:</strong> <span>{user.role || 'User'}</span>
        </div>
        <div className="profile-item">
          <strong>Date Joined:</strong> <span>{new Date(user.dateJoined).toLocaleDateString()}</span>
        </div>
        <div className="profile-item">
          <strong>Last Login:</strong> <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
        </div>
        <div className="profile-item">
          <strong>Assigned Cases:</strong> <span>{user.assignedCases ? user.assignedCases.length : 0}</span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
