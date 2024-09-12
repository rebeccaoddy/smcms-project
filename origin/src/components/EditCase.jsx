import React, { useState } from 'react';
import axios from 'axios';
import BackButton from './BackButton';
import './EditCase.css'; // Import the stylesheet for styling
import { useNavigate } from 'react-router-dom';

const EditCase = ({ caseDetail, onUpdate, setActiveTab }) => {
  const [title, setTitle] = useState(caseDetail.title);
  const [description, setDescription] = useState(caseDetail.description);
  const [priority, setPriority] = useState(caseDetail.priority);
  const [status, setStatus] = useState(caseDetail.status);
  const [category, setCategory] = useState(caseDetail.category);
  const [error, setError] = useState(null); // State for error handling
  
  

  const handleSave = async () => {
    const updatedCase = {
      title,
      description,
      priority,
      status,
      category,
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

      onUpdate(response.data); // Update the parent component with the new case details
      navigate('/cases') // Switch back to the details tab after saving
    } catch (error) {
      console.error('Error updating case', error);
      //setError('Failed to update the case. Please try again.'); // Set error message
    }
  };

  return (
    <div className="edit-case-container">
      <BackButton />
      <h3>Edit Case</h3>
      {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
      
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
          type = "text"
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
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
      </div>

      <button className="save-button" onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditCase;
