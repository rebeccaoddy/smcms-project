import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from './BackButton';
import './EditCase.css'; 
import { useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch'; // Import the custom hook for search

const EditCase = ({ caseDetail, onUpdate = () => {}, setActiveTab }) => {
  const [title, setTitle] = useState(caseDetail.title);
  const [description, setDescription] = useState(caseDetail.description);
  const [priority, setPriority] = useState(caseDetail.priority);
  const [status, setStatus] = useState(caseDetail.status);
  const [category, setCategory] = useState(caseDetail.category);
  const [assignedTo, setAssignedTo] = useState(caseDetail.assignedTo?._id || ''); 
  const [userDisplay, setUserDisplay] = useState(caseDetail.assignedTo?.username || ''); 
  const [userResultsVisible, setUserResultsVisible] = useState(false); // Control visibility of search results
  const navigate = useNavigate();
  const [error, setError] = useState(null); // State for error handling

  // Use the custom hook for searching users
  const userResults = useSearch(assignedTo, 'auth');

  // List of categories for the dropdown
  const categories = [
    'Student Wellness Concern - Mental',
    'Student Wellness Concern - Physical',
    'Student Misdemeanor',
    'Administration Issue',
    'Student Academic Dishonesty',
    'DPR Status/Appeal',
    'Curriculum advice',
    'General advice',
    'Record of Appointment',
    'Financial Issue',
    'Lost Property',
    'URGENT',
    'Other'
  ];

  // Handle user selection from the search results
  const handleUserSelect = (selectedUser) => {
    setAssignedTo(selectedUser._id); // Set the selected user's ID
    setUserResultsVisible(false); // Hide the search results after selection
    setUserDisplay(selectedUser.username); // Set the username for display
  };

  const handleSave = async () => {
    const updatedCase = {
      title,
      description,
      priority,
      status,
      category,
      assignedTo, 
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5001/api/cases/${caseDetail._id}`, 
        updatedCase, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdate(response.data); // call onUpdate prop 
      navigate('/cases'); // Navigate to case list after saving
    } catch (error) {
      console.error('Error updating case', error); //error handling 
      setError('Failed to update the case. Please try again.');
    }
  };

  return (
    <div className="edit-case-container">
      <BackButton />
      <h3>Edit Case</h3>
      {error && <p className="error-message">{error}</p>} 
      
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="Pending">Pending</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ position: 'relative' }}>
        <label>Assigned To</label>
        <input
          id="assignedTo"
          type="text"
          placeholder="Search for user"
          value={userDisplay}
          onChange={(e) => {
            setAssignedTo(e.target.value);
            setUserResultsVisible(true);
            setUserDisplay(e.target.value);
          }}
          onFocus={() => setUserResultsVisible(true)}
          onBlur={() => setTimeout(() => setUserResultsVisible(false), 200)}
        />
        {userResultsVisible && userResults.length > 0 && (
          <ul className="user-results">
            {userResults.map((user) => (
              <li key={user._id} onClick={() => handleUserSelect(user)}>
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="save-button" onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditCase;
