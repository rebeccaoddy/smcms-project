import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditCase from './EditCase'; // Import the EditCase component
import Attachments from './Attachments'; // Import the Attachments component
import './CaseDetail.css';
import StudentDetailPage from './StudentDetailPage';



const CaseDetail = ({ caseDetail, onUpdateCase, selectCase, setCurrentView, setSelectedStudentNumber }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState('details'); // Define the activeTab state
  const [studentDetail, setStudentDetail] = useState(null); // State for student detail
  const [studentCases, setStudentCases] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // State to handle edit mode; track whether the user is in edit mode.
  //const [studentNumberInput, setStudentNumberInput] = useState('');


  //format caseID for looks
  // const truncateCaseId = (caseId) => {
  //   return `${caseId.slice(0, 6)}...${caseId.slice(-4)}`;
  // };

  
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
    //setCaseDetail(updatedCase);

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

  //////CHANGE FORMATTING
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
            <h3>Details</h3>
            <div className="text-box">{caseDetail.description}</div>
          </div>
        );
      case 'attachments':
        return <Attachments caseDetail={caseDetail} />; // Render the Attachments component
      case 'edit':
        return <EditCase caseDetail={caseDetail} onUpdate={updatedCase => {
          setCurrentView('detail'); // Ensure you switch back to 'detail' after edit
        }} //onUpdateCase} setActiveTab={setActiveTab}  // Render the EditCase component ************* MOVEEEEEEEEE
        />;
      case 'studentDetails':
        //setStudentNumberInput(caseDetail.student.CampusID);
        console.log('Student Number:', caseDetail.student.CampusID);
        // if (studentNumberInput) {
        setSelectedStudentNumber(caseDetail.student.CampusID);
        setCurrentView('studentDetails');
      default:
        return null;
    }
  };


  return (
    <div className="case-detail">
      <div className="tabs">
        <button className={activeTab === 'details' ? 'active' : ''} onClick={() => setActiveTab('details')}>Case Details</button>
        <button className={activeTab === 'attachments' ? 'active' : ''} onClick={() => setActiveTab('attachments')}>Attachments</button>
        <button className={activeTab === 'studentDetails' ? 'active' : ''} onClick={() => setActiveTab('studentDetails')}>Student Details</button>
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
        {/* <button>Assign Member</button>
        <button>Update Status</button> */}
      </div>
    </div>
  );
};

export default CaseDetail;
