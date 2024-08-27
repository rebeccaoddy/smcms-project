import React, { useState } from 'react';
import axios from 'axios';

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
        setActiveTab('details'); // Switch back to the details tab after saving
      } catch (error) {
        console.error('Error updating case', error);
        setError('Failed to update the case. Please try again.'); // Set error message
      }
  };

  return (
    <div>
      <h3>Edit Case</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message if any */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Open">Open</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed</option>
      </select>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default EditCase;
