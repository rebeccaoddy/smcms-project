import { Box, Button, IconButton, Typography, useTheme, List, ListItem, ListItemText, Pagination, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import BarChart from "../../../components/BarChart";
import LineGraph from "../../../components/LineGraph";
import React, { useEffect, useState } from 'react';
import { getUsersData } from '../../../Data/DataFile';
import ListScrollTest from '../Student/ListScrollTest';
import CourseListScroll from "./CourseListScroll";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import { getCourses } from "../../../Data/CourseData/CSCourseData";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseType, setSelectedCourseType] = useState(''); // State for selected course type
  const [selectedLastLetter, setSelectedLastLetter] = useState(''); // State for selected last letter

  useEffect(() => {
      const fetchCourses = async () => {
          try {
              const data = await getCourses();
              setCourses(data);
          } catch (error) {
              console.error('Error fetching courses:', error);
          }
      };

      fetchCourses();
  }, []);

  // Calculate the indices for the courses to be displayed on the current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  
  // Filter courses based on the search query, selected course type, and selected last letter
  const filteredCourses = courses.filter(course => 
      course.CourseCode.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCourseType ? course.CourseCode.startsWith(selectedCourseType) : true) && // Check for selected course type
      (selectedLastLetter ? course.CourseCode.endsWith(selectedLastLetter) : true) // Check for selected last letter
  );

  // Get current courses to display based on pagination
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Handle page change
  const handlePageChange = (event, value) => {
      setCurrentPage(value);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1); // Reset to first page when search query changes
  };

  // Handle course type filter change
  const handleCourseTypeChange = (event) => {
      setSelectedCourseType(event.target.value);
      setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle last letter filter change
  const handleLastLetterChange = (event) => {
      setSelectedLastLetter(event.target.value);
      setCurrentPage(1); // Reset to first page when filter changes
  };

  return (
      <Box
      p={2}>
        <Header title="Course List" />
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
          
          <FormControl fullWidth variant="outlined" style={{ margin: '5px 0' }}>
              <InputLabel id="course-type-label">Course Type</InputLabel>
              <Select
                  labelId="course-type-label"
                  value={selectedCourseType}
                  onChange={handleCourseTypeChange}
                  label="Course Type"
              >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="MAM">MAM</MenuItem>
                  <MenuItem value="CSC">CSC</MenuItem>
                  <MenuItem value="PHY">PHY</MenuItem>
                  <MenuItem value="STA">STA</MenuItem>
                  <MenuItem value="BIO">BIO</MenuItem>
                  <MenuItem value="MCB">MCB</MenuItem>
                  <MenuItem value="AST">AST</MenuItem>
                  <MenuItem value="CEM">CEM</MenuItem>
                  {/* Add more course types as needed */}
              </Select>
          </FormControl>
          
          <FormControl fullWidth variant="outlined" style={{ margin: '5px 0' }}>
              <InputLabel id="last-letter-label">Last Letter</InputLabel>
              <Select
                  labelId="last-letter-label"
                  value={selectedLastLetter}
                  onChange={handleLastLetterChange}
                  label="Last Letter"
              >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="F">F</MenuItem>
                  <MenuItem value="S">S</MenuItem>
                  <MenuItem value="H">H</MenuItem>
                  <MenuItem value="W">W</MenuItem>
                  <MenuItem value="Z">Z</MenuItem>
              </Select>
          </FormControl>

          
          <List style={{ maxHeight: '400px', overflow: 'auto' }}>
              {currentCourses.map(course => (
                  <ListItem key={course.CourseCode}>
                      <Link to={{
                          pathname: `/course/${course.CourseCode}`,
                          state: { course } // Pass the course data as state
                      }} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <ListItemText primary={course.CourseCode} />
                      </Link>
                  </ListItem>
              ))}
          </List>
          <Pagination 
              count={Math.ceil(filteredCourses.length / coursesPerPage)} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary" 
              style={{ marginTop: '20px' }}
          />
      </Box>
  );
};

export default Course;
