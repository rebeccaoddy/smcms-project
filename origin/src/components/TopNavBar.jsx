// src/components/TopNavBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';


import './TopNavBar.css';

const TopNavBar = ({ user, handleLogout, setSelectedStudentNumber }) => {
  const navigate = useNavigate();
  const [studentNumberInput, setStudentNumberInput] = useState('');
  const [studentResultsVisible, setStudentResultsVisible] = useState(false);

  const studentResults = useSearch(studentNumberInput, 'students');

  const handleStudentSelect = (selectedStudent) => {
    setStudentNumberInput(selectedStudent.CampusID);
    setStudentResultsVisible(false);
    setSelectedStudentNumber(selectedStudent.CampusID);
    navigate('/student-details');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (studentNumberInput.trim() === '') {
      alert('Please enter a valid student number');
      return;
    }
    setSelectedStudentNumber(studentNumberInput.trim());
    navigate('/student-details');
    setStudentResultsVisible(false);
  };

  return (
    <div className="top-nav-bar">
      <div className="logo" onClick={() => navigate('/')}>
        <h1>Case Management System</h1>
      </div>
      <form className="search-form" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Search Student Number"
          value={studentNumberInput}
          onChange={(e) => {
            setStudentNumberInput(e.target.value);
            setStudentResultsVisible(true);
          }}
          onFocus={() => setStudentResultsVisible(true)}
          onBlur={() => setTimeout(() => setStudentResultsVisible(false), 200)}
        />
        <button type="submit">View Student Details</button>
        {studentResultsVisible && studentResults.length > 0 && (
          <ul className="student-results">
            {studentResults.map((student) => (
              <li key={student._id} onClick={() => handleStudentSelect(student)}>
                {student.CampusID} - {student.firstName} {student.lastName}
              </li>
            ))}
          </ul>
        )}
      </form>
      <div className="nav-links">
        <button onClick={() => navigate('/cases')}>          
        <FontAwesomeIcon icon={faHome} /> {/* Home icon */}
        </button>
        {user ? (
          <>
            <span className="user-info">Hello, {user.username}</span>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopNavBar;
