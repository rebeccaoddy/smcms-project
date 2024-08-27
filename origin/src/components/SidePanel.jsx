// src/components/SidePanel.jsx
import React, { useState, useEffect } from 'react';

//import React from 'react';
import './SidePanel.css';

const SidePanel = ({ user, setCurrentView, handleLogout, setSelectedStudentNumber }) => {
  const [studentNumberInput, setStudentNumberInput] = useState('');

  const handleStudentDetailsClick = () => {
    if (studentNumberInput) {
      setSelectedStudentNumber(studentNumberInput);
      setCurrentView('studentDetails');
    } else {
      alert('Please enter a valid student number'); ///doesnt work 
    }
  };


  return (
    <div className="side-panel">
      <ul className="list-group">
        {user ? (
          <>
            <li className="list-group-item" onClick={() => setCurrentView('list')}>Case List</li>
            <div>
              <input
                type="text"
                placeholder="Enter Student Number"
                value={studentNumberInput}
                onChange={(e) => setStudentNumberInput(e.target.value)}
              />
              <button onClick={handleStudentDetailsClick}>View Student Cases</button> 
            </div>
            
            <li className="list-group-item mt-4">
              <div>User: {user.username}</div>
              <ul className="list-group">
                <li className="list-group-item" onClick={() => setCurrentView('profile')}>Profile</li>
                
                </ul>
              <button className="btn btn-primary mt-2" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="list-group-item" onClick={() => setCurrentView('login')}>Login</li>
            <li className="list-group-item" onClick={() => setCurrentView('register')}>Register</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SidePanel;
