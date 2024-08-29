import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentDetailPage.css';
import { useLocation } from 'react-router-dom';

const StudentDetailPage = ({ CampusID, selectCase }) => {
  const [studentDetail, setStudentDetail] = useState(null);
  const [studentCases, setStudentCases] = useState([]);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To track error state

  //handle load from dashboard
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('studentId'); // Extract the studentId from the URL query parameters

  useEffect(() => {
    if (studentId) {
      console.log("this is the studentId from app 1", studentId);
      fetchStudentDetails(studentId);
      fetchStudentCases(studentId);  // Added this call to ensure student cases are fetched for the passed studentId
    }
  }, [studentId]);

  // Define the fetchStudentDetails function at the top
  const fetchStudentDetails = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Student details response:', response.data);
      setStudentDetail(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student details', error);
      setError(error);
      setLoading(false);
    }
  };

  const fetchStudentCases = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5001/api/cases/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Student cases response:', response.data);
      setStudentCases(response.data);
    } catch (error) {
      console.error('Error fetching student cases', error);
      setError(error);
    }
  };

  useEffect(() => {
    if (CampusID) {
      console.log('Fetching student details for number:', CampusID);
      fetchStudentDetails(CampusID);
      fetchStudentCases(CampusID);
    }
  }, [CampusID]);

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="priority-icon">🔴</span>;
      case 'medium':
        return <span className="priority-icon">🟡</span>;
      case 'low':
        return <span className="priority-icon">🟢</span>;
      default:
        return '';
    }
  };

  const truncateCaseId = (caseId) => {
    return `${caseId.slice(0, 6)}...${caseId.slice(-4)}`;
  };

  // Return error state 
  if (error) return <div>Error loading student details. Please try again later.</div>;
  // Handle no student found
  if (!studentDetail) return <div>No student details found.</div>;
  
  return (
    <div className="student-detail">
      <div className="button-container">
        <button className="dashboard-button">Link to Student Dashboard</button>
      </div>
      <h3>Student Details</h3>
      {studentDetail ? (
        <div>
          <p>Name: </p>
          <p>Student Number: {studentDetail.CampusID}</p>
          <p>Birth Date: {studentDetail.BirthDate}</p>
          <p>Population Group: {studentDetail.PopulationGrp}</p>
          <p>Gender: {studentDetail.Gender}</p>
          <p>Risk Level: {studentDetail.RiskLevel}</p>
          <h3>Cases for {studentDetail.CampusID}</h3>
          <table>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Case #</th>
                <th>Subject</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {studentCases.map((c) => (
                <tr key={c._id}>
                  <td>{getPriorityIcon(c.priority)}</td>
                  <td>{truncateCaseId(c._id)}</td>
                  <td>{c.title}</td>
                  <td>{c.dateCreated}</td>
                  <td>{c.status}</td>
                  <td>{c.category}</td>
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
      ) : (
        <p>Loading student details...</p>
      )}
    </div>
  );
};

export default StudentDetailPage;
