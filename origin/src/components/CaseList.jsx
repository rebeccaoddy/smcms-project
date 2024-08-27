import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CaseList.css';

const CaseList = ({ cases, setCases, selectCase, user, setCurrentView }) => {
  //const [searchKeyword, setSearchKeyword] = useState('');
  //const [studentNames, setStudentNames] = useState({});
  //const [filterCriteria, setFilterCriteria] = useState('title'); // Default filter criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [searchPriority, setSearchPriority] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token from localStorage
        const response = await axios.get('http://localhost:5001/api/cases', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Fetched Cases:', response.data); // Log response data for debugging
        setCases(response.data);
        console.log("cases set")
      } catch (error) {
        console.error('Error fetching cases', error);
      }
    };

    fetchCases();
  }, [setCases]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="priority-icon">🔴</span>; // Red circle
      case 'medium':
        return <span className="priority-icon">🟡</span>; // Yellow circle
      case 'low':
        return <span className="priority-icon">🟢</span>; // Green circle
      default:
        return '';
    }
  };


  const filterCases = (caseItem) => {
    return (
      //(searchTitle === '' || caseItem.title.toLowerCase().includes(searchTitle.toLowerCase())) &&
      (searchCategory === '' || caseItem.category.toLowerCase().includes(searchCategory.toLowerCase())) &&
      (searchStudent === '' || (caseItem.student && caseItem.student.CampusID.toLowerCase().includes(searchStudent.toLowerCase()))) &&
      (searchPriority === '' || caseItem.priority.toLowerCase().includes(searchPriority.toLowerCase())) &&
      (searchStatus === '' || caseItem.status.toLowerCase().includes(searchStatus.toLowerCase()))
    );
  };

//filter cases by assigned to and created by 
  const filteredCases = cases.filter(
    (c) => filterCases(c) && (c.createdBy === user.username || c.assignedTo.username === user.username)
  );


  const myCases = filteredCases.filter((c) => c.createdBy === user.username); //filter by created by 
  const assignedCases = filteredCases.filter((c) => c.assignedTo.username === user.username); //filter by assigned to
  
  return (
    <div>
      <h2>Case List</h2>
      {/* Add Case Button */}
      <button onClick={() => setCurrentView('add')} className="add-case-button">
        New Case
      </button>
      <div className="search-container">
  <input
    type="text"
    placeholder="Search by Category"
    value={searchCategory}
    onChange={(e) => setSearchCategory(e.target.value)}
  />
  <input
    type="text"
    placeholder="Search by Student"
    value={searchStudent}
    onChange={(e) => setSearchStudent(e.target.value)}
  />
  <input
    type="text"
    placeholder="Search by Priority"
    value={searchPriority}
    onChange={(e) => setSearchPriority(e.target.value)}
  />
  <input
    type="text"
    placeholder="Search by Status"
    value={searchStatus}
    onChange={(e) => setSearchStatus(e.target.value)}
  />
</div>
      <h3>My Cases</h3>
      <table>
        <thead>
          <tr>
          <th>Priority</th>
            <th>Category</th>
            <th>Studen Number</th>
            <th>Assigned To</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {myCases
            .filter(c => c.createdBy === user.username && filterCases(c))
            .map((c) => (
            <tr key={c._id}>
              <td>{getPriorityIcon(c.priority)}</td> {/* Display priority as an icon */}
              <td>{c.category}</td>
              <td>{c.student?.CampusID || 'N/A'}</td>

              <td>{c.assignedTo.username}</td>
              <td>{c.dateCreated}</td>
              <td>{c.status}</td>
              <td>{c.notes}</td>
              <td>
                <button
                  onClick={() => {
                    console.log('Selected Case ID:', c._id);
                    selectCase(c._id);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Assigned to Me</h3>
      <table>
        <thead>
          <tr>
          <th>Priority</th>
            <th>Category</th>
            <th>Student Number</th>
            <th>Assigned To</th>
            <th>Date Created</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {assignedCases
            .map((c) => (
            <tr key={c._id}>
              
              <td>{getPriorityIcon(c.priority)}</td> {/* Display priority as an icon */}
              <td>{c.category}</td>
              <td>{c.student?.CampusID || 'N/A'}</td> {/* Display student name */}
              <td>{c.assignedTo.username}</td>
              <td>{c.dateCreated}</td>
              <td>{c.status}</td>
              <td>{c.notes}</td>
              <td>
                <button
                  onClick={() => {
                    console.log('Selected Case ID:', c._id);
                    selectCase(c._id);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseList;