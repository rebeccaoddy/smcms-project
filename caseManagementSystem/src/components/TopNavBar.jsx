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

  // user searchs for a student directly via the navBar
  const handleStudentSelect = (selectedStudent) => {
    setStudentNumberInput(selectedStudent.CampusID);
    setStudentResultsVisible(false);
    setSelectedStudentNumber(selectedStudent.CampusID);
    navigate('/student-details'); // navigate to student details 
    setStudentNumberInput(''); // Reset the input field after submission
  };

  //user chooses to manually type instead of selcting from dropdown via navBar
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (studentNumberInput.trim() === '') {
      alert('Please enter a valid student number');
      return;
    }
    setSelectedStudentNumber(studentNumberInput.trim());
    navigate('/student-details');
    setStudentNumberInput(''); // Reset the input field after submission
    setStudentResultsVisible(false);
  };

  return (
    <div className="top-nav-bar">
      <div className="logo" onClick={() => navigate('/cases')}>
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
            console.log('Student Results in TopNavBar:', studentResults);

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
    </div>
  );
};

export default TopNavBar;
