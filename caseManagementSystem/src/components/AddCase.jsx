import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSearch from '../hooks/useSearch';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import './AddCase.css';


const AddCase = ({ addCase, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [student, setStudent] = useState(''); //  represents CampusID 
  const [assignedTo, setAssignedTo] = useState(''); 
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [errors, setErrors] = useState({}); // State for storing error messages
  const [studentResultsVisible, setStudentResultsVisible] = useState(false);
  const [userResultsVisible, setUserResultsVisible] = useState(false)
  const [studentDisplay, setStudentDisplay] = useState(''); // New state for displaying CampusID
  const [userDisplay, setUserDisplay] = useState(''); // New state for displaying CampusID
  const navigate = useNavigate();

  const categories = ['Student Wellness Concern - Mental','Student Wellness Concern - Physical', 
                      'Student Misdemeanor', 'Administration Issue','Student Academic Dishonesty', 
                      'DPR Status/Appeal','Curriculumn advice', 'General advice','Record of Appointment', 
                      'Financial Issue', 'Lost Property', 'URGENT', 'Other' ]; 

  // Use the custom hook for searching students and users
  const studentResults = useSearch(student, 'students');
  const userResults = useSearch(assignedTo, 'auth');

  // student is selected
  const handleStudentSelect = (selectedStudent) => {
    setStudent(selectedStudent._id); // Store object ID 
    setStudentResultsVisible(false); // Hide the search results after selection
    setStudentDisplay(selectedStudent.CampusID); // Store the CampusID for display in the UI
  };

  // user is selected
  const handleUserSelect = (selectedUser) => {
    setAssignedTo(selectedUser._id); // Store user username in the input field 
    setUserResultsVisible(false)
    setUserDisplay(selectedUser.username); // Store the username for display in the UI
  };

// ensure all sections are filled in 
  const validateForm = () => {
    const newErrors = {};
    
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!priority) newErrors.priority = 'Priority is required';
    if (!student) newErrors.student = 'Student selection is required';
    if (!status) newErrors.status = 'Status is required';
    if (!category) newErrors.category = 'Category is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent form submission if validation fails

    const newCase = {
      title,
      description,
      priority,
      dateCreated: new Date().toLocaleDateString(),
      student,
      assignedTo: assignedTo || user.username, // set assigned to as cuurent user if not specified,
      status,
      notes: notes || " ", // Ensure notes is always a string, even if empty
      createdBy: user.username,
      category,
    };

    console.log(newCase); //debugging 


    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await axios.post('http://localhost:5001/api/cases', newCase, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      //reset all fields after submition
      addCase(response.data);
      setTitle('');
      setDescription('');
      setPriority('');
      setStudent('');
      setAssignedTo('');
      setStatus('');
      setNotes('');
      setCategory(''); 
      setErrors({}); 
      navigate('/cases');  //load cases page after submission
    } 
    catch (error) {
      console.error('Error adding case', error); //log error 
    }
  };

  console.log('Student Results from FrontEnd', studentResults); // log student details 

  return (
    <form onSubmit={handleSubmit}>
      <BackButton />  

      <h2>Add Case</h2>

      <label htmlFor="category">Category:</label>
      <select 
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="category-dropdown"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>}

      <label htmlFor="title">Title:</label>
      <input
        id="title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {errors.title && <p className="error">{errors.title}</p>}

      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.description && <p className="error">{errors.description}</p>}

      <label htmlFor="priority">Priority:</label>
      <select
        id="priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-dropdown"
      >
        <option value="">Select Priority</option>
        <option value="high" className="red-flag">🔴 High</option>
        <option value="medium" className="yellow-flag">🟡 Medium</option>
        <option value="low" className="green-flag">🟢 Low</option>
      </select>

      <div className="add-case-input-container" style={{ position: 'relative' }}>
        <label htmlFor="student">Student Number:</label>
        <input
          id="student"
          type="text"
          placeholder="Student Number"
          value={studentDisplay}
          onChange={(e) => {
            setStudent(e.target.value);
            setStudentResultsVisible(true); // Show results when typing
            setStudentDisplay(e.target.value)
            console.log('Student Results in AddCase2:', studentResults);

          }}
          onFocus={() => setStudentResultsVisible(true)}
          onBlur={() => setTimeout(() => setStudentResultsVisible(false), 200)}
          style={{ width: '100%' }} // This makes sure the input takes full container width
        />
      
          {studentResultsVisible && studentResults.length > 0 && (
            <ul className="student-results">
              {studentResults.map((student) => (
                <li key={student._id} onClick={() => {
                  // setStudent(student.CampusID);
                  // setStudentResultsVisible(false);
                  handleStudentSelect(student)
                  console.log('Student set to:', student.CampusID);
              }}>
                  {student.CampusID} - {student.firstName} {student.lastName}
              </li>

              ))}
            </ul>
          )}
    </div>

    <div className="add-case-input-container" style={{ position: 'relative' }}>
          <label htmlFor="assignedTo">Assigned To:</label>
          <input
            id="assignedTo"
            type="text"
            placeholder="Assigned To"
            value={userDisplay}
            onChange={(e) => {
              setAssignedTo(e.target.value)
              setUserResultsVisible(true)
              setUserDisplay(e.target.value)

            }}
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

      <label htmlFor="status">Status:</label>
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="status-dropdown"
      >
        <option value="">Select Status</option>
        <option value="Open">Open</option>
        <option value="Pending">Pending</option>
        <option value="Closed">Closed</option>
      </select>
      {errors.status && <p className="error">{errors.status}</p>}

      <label htmlFor="notes">Notes:</label>
      <textarea
        id="notes"
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Add Case</button>
    </form>
  );
};

export default AddCase;