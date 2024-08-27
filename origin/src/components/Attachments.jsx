import React, { useState } from 'react';
import axios from 'axios';

const Attachments = ({ caseDetail, selectedFile }) => {
  const [attachments, setAttachments] = useState(caseDetail.attachments || []);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);  // Use the file state
  
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:5001/api/cases/${caseDetail._id}/attachments`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setAttachments([...attachments, response.data]); /// Update the attachments array with the new attachment
      setFile(null); // Clear the file input after upload
      console.log('File uploaded successfully', response.data);
    } catch (error) {
      console.error('Error uploading attachment', error);
    }
  };
  

  return (
    <div>
      <h3>Attachments</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <ul>
        {attachments.map((attachment, index) => (
          <li key={index}>
            <a href={`http://localhost:5001${attachment.path}`} target="_blank" rel="noopener noreferrer">
              {attachment.filename}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Attachments;
