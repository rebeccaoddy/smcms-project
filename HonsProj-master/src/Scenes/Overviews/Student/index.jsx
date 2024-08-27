import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText,Pagination , Box} from '@mui/material';
import { getStudents } from '../../../Data/StudentDataFolder/StudentData'; // Adjust the import based on your structure
import { getNewStudents } from '../../../Data/StudentDataFolder/StudentData';
import { Link } from 'react-router-dom';
import ListScrollTest from './ListScrollTest';
import { useNavigate } from 'react-router-dom';
import Header from '../../../components/Header';

const Student = () => {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
      const fetchStudents = async () => {
          const data = await getNewStudents();
          setStudents(data);
      };
      
      fetchStudents();
  }, []);

  // Calculate the indices for the students to be displayed on the current page
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  
  // Filter students based on the search query
  const filteredStudents = students.filter(student => 
      student.CampusID.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current students to display based on pagination
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Handle page change
  const handlePageChange = (event, value) => {
      setCurrentPage(value);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1); // Reset to first page when search query changes
  };

  return (
    <Box
      p={2}>
        <Header title="Student List" />
      <div>
          <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                  width: '100%',
                  padding: '10px',
                  margin: '5px 0',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
              }}
          />
          <List style={{ maxHeight: '400px', overflow: 'auto' }}>
              {currentStudents.map(student => (
                  <ListItem key={student.CampusID}>
                      <Link to={`/students/${student.CampusID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <ListItemText primary={student.CampusID} />
                      </Link>
                  </ListItem>
              ))}
          </List>
          <Pagination 
              count={Math.ceil(filteredStudents.length / studentsPerPage)} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
              style={{ marginTop: '20px' }}
          />
      </div>
      </Box>
  );
};

export default Student;