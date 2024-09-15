import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditCase from './EditCase'; // Import the EditCase component
import Attachments from './Attachments'; // Import the Attachments component
import './CaseDetail.css';
import BackButton from './BackButton'; // Import the BackButton component
import { useNavigate, useLocation } from 'react-router-dom';


const CaseDetail = ({ caseDetail, onUpdateCase, onDeleteCase, selectCase, setSelectedStudentNumber }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to handle edit mode; track whether the user is in edit mode.
  const navigate = useNavigate();
  const location = useLocation();
  const [updatedCaseDetail, setUpdatedCaseDetail] = useState(caseDetail);

  // Get the current tab from the URL from SMS
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'details'; 

  // Function to handle tab navigation
  const handleTabChange = (tab) => {
    if (tab === 'studentDetails') {
      setSelectedStudentNumber(caseDetail.student.CampusID);
      navigate('/student-details'); // Navigate only when the tab is studentDetails
    } else {
      navigate(`${location.pathname}?tab=${tab}`); // Navigate normally for other tabs
    }
  };

  const renderTabContent = () => {
    console.log('Student details:', caseDetail.student);

    switch (activeTab) {
      case 'details':
        return (
          <div>
            <h3>Subject</h3>
            <div className="text-line">{caseDetail.title}</div>
            <h3>Case Number </h3>
            <div className="text-line">{caseDetail._id}</div>
            <h3>Student Number </h3>
            <div className="text-line">{caseDetail.student.CampusID}</div>
            <h3>Details</h3>
            <div className="text-box">{caseDetail.description}</div>
            <h3>Assigned To </h3>
            <div className="text-line">{caseDetail.assignedTo.username}</div>
          </div>
        );
      case 'attachments':
        return <Attachments caseDetail={caseDetail} onAttachmentUpload={handleAttachmentUpload}/>; // Render the Attachments component
      case 'edit':
        return <EditCase caseDetail={caseDetail} onUpdate={updatedCase => {{onUpdateCase}
          navigate('/cases/detail'); // Ensure you switch back to 'detail' after edit
        }}
        />;
      case 'studentDetails':
        console.log('Student Number:', caseDetail.student.CampusID); //testing
        setSelectedStudentNumber(caseDetail.student.CampusID);
        return <div>Student Details Content</div>;
      default:
        return null;
    }
  };

// retrieve comments for cases 
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5001/api/comments/${caseDetail._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments', error);
      }
    };
    if (caseDetail && caseDetail._id) {
      fetchComments();
    }
  }, [caseDetail]);

// add new comment to case details
  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5001/api/comments/${caseDetail._id}`, 
      { text: newComment }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  //function to set isEditing to true, which switches the view to the EditCase component.
  const handleEditClick = () => {
    setIsEditing(true); // Set editing mode to true when "Edit Case" is clicked
  };

  const handleSaveEdit = (updatedCase) => {
    onUpdateCase(updatedCase); // Update the case with the new details
    setIsEditing(false); // Exit editing mode
  };

  if (isEditing) {
    return (
      <EditCase 
        caseDetail={caseDetail} 
        onUpdate={handleSaveEdit} 
        setActiveTab={() => setIsEditing(false)} // Return to view mode after saving
      />
    );
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this case?'); //popup 
    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token'); // Ensure token is being sent
        const response = await axios.delete(`http://localhost:5001/api/cases/${caseDetail._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('onDeleteCase function:', onDeleteCase); //testing
        onDeleteCase(caseDetail._id);  // Call the function passed in props to update the parent component
        navigate('/cases'); // Redirect to case list after deletion
      } catch (error) {
        console.error('Error deleting case', error);
        alert('Failed to delete the case. Please try again.');
      }
    }
  };

  const handleAttachmentUpload = (newAttachment) => {
    const updatedAttachments = [...upcaseDetail.attachments, newAttachment];     // Update the case details with the new attachment
    setUpdatedCaseDetail({
      ...caseDetail,
      attachments: updatedAttachments
    });
    navigate("cases/detail") // nav to case details after submission
  };


return (
  <div className="case-detail">
    <BackButton />
    <div className="tabs">
      <button
        className={activeTab === 'details' ? 'active' : ''}
        onClick={() => handleTabChange('details')}
      >
        Case Details
        </button>

      <button
        className={activeTab === 'attachments' ? 'active' : ''}
        onClick={() => handleTabChange('attachments')}
      >
        Attachments
      </button>
      <button
        className={activeTab === 'studentDetails' ? 'active' : ''}
        onClick={() => handleTabChange('studentDetails')}
      >
        Student Details
      </button>
    </div>
    <div className="tab-content">
      {renderTabContent()}
    </div>
    <div className="comments-section">
      <h3>Comments</h3>
      <ul>
        {comments.map(comment => (
          <li key={comment._id}>
            <strong>{comment.user}</strong>: {comment.text}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment"
      />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
    <div className="actions">
      <h3>Actions</h3>
      <button onClick={handleEditClick}>Edit Case</button>
      <button onClick={handleDelete} className="delete-button">Delete</button>

    </div>
  </div>
  );
};


export default CaseDetail;
