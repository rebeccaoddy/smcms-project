import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CaseList.css';
import { useNavigate } from 'react-router-dom';


const CaseList = ({ cases, setCases, selectCase, user }) => {
  //const [searchKeyword, setSearchKeyword] = useState('');
  //const [studentNames, setStudentNames] = useState({});
  //const [filterCriteria, setFilterCriteria] = useState('title'); // Default filter criteria
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [searchPriority, setSearchPriority] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const navigate = useNavigate();


  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });// sort the cases array based on the selected column and the current sorting direction.

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const sortedCases = cases.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  
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

//handle search function eg search by category/stuentID/priority/status
  const filterCases = (caseItem) => {
    const lowerSearchQuery = searchQuery.toLowerCase();
  return (
    caseItem.category.toLowerCase().includes(lowerSearchQuery) ||
    (caseItem.student && caseItem.student.CampusID.toLowerCase().includes(lowerSearchQuery)) ||
    caseItem.priority.toLowerCase().includes(lowerSearchQuery) ||
    caseItem.status.toLowerCase().includes(lowerSearchQuery)||
    caseItem.assignedTo.username.toLowerCase().includes(lowerSearchQuery)
  );
};

//const filteredCases = sortedCases.filter(filterCases);

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
      <button onClick={() => navigate('/cases/add')} className="add-case-button">
        New Case
      </button>
      <div className="search-container">
  <input
    type="text"
    placeholder="Search by ..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>
      <h3>My Cases</h3>
      <table>
        <thead>
          <tr>
          <th
      onClick={() => handleSort('priority')}
      className={
        sortConfig.key === 'priority' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Priority
    </th>
    <th
      onClick={() => handleSort('category')}
      className={
        sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Category
    </th>
    <th
      onClick={() => handleSort('student')}
      className={
        sortConfig.key === 'student' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Student
    </th>
    <th
      onClick={() => handleSort('assignedTo')}
      className={
        sortConfig.key === 'assignedTo' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Assigned To
    </th>
    <th
      onClick={() => handleSort('dateCreated')}
      className={
        sortConfig.key === 'dateCreated' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Date Created
    </th>
    <th
      onClick={() => handleSort('status')}
      className={
        sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Status
    </th>
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
          <th
      onClick={() => handleSort('priority')}
      className={
        sortConfig.key === 'priority' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Priority
    </th>
    <th
      onClick={() => handleSort('category')}
      className={
        sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Category
    </th>
    <th
      onClick={() => handleSort('student')}
      className={
        sortConfig.key === 'student' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Student
    </th>
    <th
      onClick={() => handleSort('assignedTo')}
      className={
        sortConfig.key === 'assignedTo' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Assigned To
    </th>
    <th
      onClick={() => handleSort('dateCreated')}
      className={
        sortConfig.key === 'dateCreated' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Date Created
    </th>
    <th
      onClick={() => handleSort('status')}
      className={
        sortConfig.key === 'status' ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : ''
      }
    >
      Status
    </th>
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