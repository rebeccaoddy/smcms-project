import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSearch from '../hooks/useSearch';
import { useNavigate } from 'react-router-dom';


import './AddCase.css';


const AddCase = ({ addCase, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [student, setStudent] = useState(''); //  represents CampusID 
  // const [studentResults, setStudentResults] = useState([]); // State to hold user search results for student
  const [assignedTo, setAssignedTo] = useState(''); 
  // const [userResults, setUserResults] = useState([]); // State to hold user search results for user

  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState(''); // New state for category
  const [errors, setErrors] = useState({}); // State for storing error messages
  const navigate = useNavigate();



  const categories = ['Student Wellness Concern', 'Student Misdemeanor', 'Administration Issue','Student Academic Dishonesty','Log Appointment','Other' ]; // Example categories


  // Use the custom hook for searching students and users
  const studentResults = useSearch(student, 'students');
  const userResults = useSearch(assignedTo, 'auth');


  const handleStudentSelect = (selectedStudent) => {
    setStudent(selectedStudent._id); // Store object ID
  };

  const handleUserSelect = (selectedUser) => {
    setAssignedTo(selectedUser._id); // Store user object ID or username
  };


  // search student database for student name **** UPDATE TO NUMBER 
  //Search by CampusID: The student variable is now assumed to contain a CampusID or a similar identifier, rather than the student's name.

  // useEffect(() => {
  //   console.log('Searching for student in AddCase line 28:', student);
  //   if (student) {
  //     const searchStudents = async () => {
  //       try {
  //         const token = localStorage.getItem('token');
  //         const response = await axios.get(`http://localhost:5001/api/students/search?query=${student}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         });
  //         console.log("this is the response data in add case line 38:", response.data) // BLANK

  //         setStudentResults(response.data);  //setting empty array to response data
  //       } catch (error) {
  //         console.error('Error searching students', error);
  //       }
  //     };


  //     searchStudents();
  //   } else {
  //     setStudentResults([]);
  //   }
  // }, [student]);

  // search user database for username
  // useEffect(() => {
  //   if (assignedTo) {
  //     const searchUsers = async () => {
  //       try {
  //         const token = localStorage.getItem('token');
  //         const response = await axios.get(`http://localhost:5001/api/auth/search?query=${assignedTo}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         });
  //         setUserResults(response.data);
  //       } catch (error) {
  //         console.error('Error searching users', error);
  //       }
  //     };
  
  //     searchUsers();
  //   } else {
  //     setUserResults([]);
  //   }
  // }, [assignedTo]);

  // // const handleStudentSelect = (selectedStudent) => {
  // //   //setStudent(selectedStudent.name); 
  // //   setStudent(selectedStudent._id); // Store object ID 
  // //   setStudentResults([]);
  // // };

  // const handleUserSelect = (selectedUser) => {
  //   setAssignedTo(selectedUser._id); // Store user object ID or username
  //   setUserResults([]);
  // };
  



// ensure all sections are filled in 
  const validateForm = () => {
    const newErrors = {};
    
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!priority) newErrors.priority = 'Priority is required';
    if (!student) newErrors.student = 'Student selection is required';
    //if (!assignedTo) newErrors.assignedTo = 'Assigned To is required';
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

    console.log(newCase);


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
      // setCreatedBy('')

      navigate('/cases');  
  } catch (error) {
    console.error('Error adding case', error);
  }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Case</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {errors.title && <p className="error">{errors.title}</p>} {/* Display error if any */}
      
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.description && <p className="error">{errors.description}</p>} {/* Display error if any */}

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="priority-dropdown"
      >
        <option value="">Select Priority</option>
        <option value="high" className="red-flag">🔴 High</option>
        <option value="medium" className="yellow-flag">🟡 Medium</option>
        <option value="low" className="green-flag">🟢 Low</option>
      </select>
      {errors.priority && <p className="error">{errors.priority}</p>} {/* Display error if any */}

      <input
        type="text"
        placeholder="Student Number"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      />
      {errors.student && <p className="error">{errors.student}</p>} {/* Display error if any */}

      {studentResults.length > 0 && (
        <ul className="student-results">
          {studentResults.map((s) => (
            <li key={s._id} onClick={() => handleStudentSelect(s)}>
              {s.CampusID}
            </li>
          ))}
        </ul>
      )}
      <input
        type="text"
        placeholder="Assigned To"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
      />
      {userResults.length > 0 && (
        <ul className="user-results">
          {userResults.map((user) => (
            <li key={user._id} onClick={() => handleUserSelect(user)}>
              {user.username}
            </li>
          ))}
        </ul>
      )}
      
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="status-dropdown"
      >
        <option value="">Select Status</option>
        <option value="Open" >Open</option>
        <option value="Pending" > Pending</option>
        <option value="Closed" > Closed</option>
      </select>
      {errors.status && <p className="error">{errors.status}</p>} {/* Display error if any */}

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}
      className="category-dropdown">
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      {errors.category && <p className="error">{errors.category}</p>} {/* Display error if any */}

      <button type="submit">Add Case</button>
      
    </form>
  );
};

export default AddCase;
