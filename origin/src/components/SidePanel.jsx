// src/components/SidePanel.jsx
import React, { useState, useEffect } from 'react';
import useSearch from '../hooks/useSearch'; //import custom hook 

//import React from 'react';
import './SidePanel.css';

const SidePanel = ({ user, setCurrentView, handleLogout, setSelectedStudentNumber }) => {
  //const studentIDs = useStudentIDs(); // Use the custom hook to get student IDs
  const [studentNumberInput, setStudentNumberInput] = useState('');
  const [student, setStudent] = useState(''); //  represents CampusID 
  const [filteredStudentIDs, setFilteredStudentIDs] = useState([]); // State to store filtered student IDs based on input

// Use the custom hook for searching students and users
const studentResults = useSearch(studentNumberInput, 'students');

const handleStudentSelect = (selectedStudent) => {
  setStudent(selectedStudent._id); // Store object ID
};






  const handleStudentDetailsClick = () => {
    if (studentNumberInput) {
      setSelectedStudentNumber(studentNumberInput);
      setCurrentView('studentDetails');
    } else {
      alert('Please enter a valid student number'); ///doesnt work 
    }
  };

  const handleStudentIDSelect = (id) => {
    setStudentNumberInput(id);
    setFilteredStudentIDs([]);
    setSelectedStudentNumber(id);
    setCurrentView('studentDetails');
  }


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

              {studentResults.length > 0 && (
                      <ul className="student-results">
                        {studentResults.map((s) => (
                          <li key={s._id} onClick={() => setStudentNumberInput(s.CampusID)}>
                            {s.CampusID}
                          </li>
                        ))}
                      </ul>
                    )}
        

              
              <button onClick={handleStudentDetailsClick}>View Student Details</button> 
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
