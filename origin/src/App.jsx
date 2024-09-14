import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import statement
import TopNavBar from './components/TopNavBar';
import CaseList from './components/CaseList';
import AddCase from './components/AddCase';
import CaseDetail from './components/CaseDetail';
import Login from './components/Login';
import Register from './components/Register';
import StudentDetailPage from './components/StudentDetailPage';
import UserProfile from './components/UserProfile';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';


///testing commit to branch
import './App.css';

const MainApp = () => {
  window.location.href = "http://localhost:3000/faculty"
  // const handleNavigation = () => {

  //   window.location.href = "http://localhost:3000/faculty"
  // };
  // return (
  //   <button onClick={handleNavigation}>
  //     Go to Dashboard
  //   </button>
  // );
  };

const App = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  //const [currentView, setCurrentView] = useState('list'); // Initially set to login
  const [user, setUser] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);
  const navigate = useNavigate(); // Use this to navigate programmatically
  const location = useLocation();




//get user details from login
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5001/api/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
          ////navigate('/cases'); // Navigate to the case list if authenticated
        } catch (error) {
          console.error('Error fetching user', error);
          setUser(null);
          navigate('/login'); // Redirect to login if no token
        }
      } else {
        setUser(null);
        if (window.location.pathname !== '/register') {
        navigate('/login'); // Redirect to login if no token
        }
      }
    };
    fetchUser();
  }, [navigate]);

  //create a new case 
  const addCase = (newCase) => {
    setCases([...cases, { ...newCase, assignedTo: user.username }]);
  };


  //select a case to view
  const selectCase = (caseId) => {
    console.log('Case ID to Select:', caseId); // Add this line for debugging
    const caseDetail = cases.find((c) => c._id === caseId);
    console.log('Selected Case:', caseDetail); // Add this line for debugging
    setSelectedCase(caseDetail);
    navigate('/cases/detail'); // Navigate to case detail view
  };

  // //view student id --DELETE ???
  // const selectStudent = (studentId) => {
  //   console.log('Student ID to Select:', studentId);
  //   setSelectedStudentId(studentId);
  //   setCurrentView('studentDetails');
  // };

  //logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from localStorage
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  };


  // New function to handle updating a case
  const onUpdateCase = (updatedCase) => {
    setCases(cases.map(c => c._id === updatedCase._id ? updatedCase : c));
    setSelectedCase(updatedCase); // Update the selected case with the new details
  };



  return (
    <div className="App">
      {/* Conditionally render TopNavBar only if not on /login route */}
      {location.pathname !== '/login' && (
        <TopNavBar
          user={user}
          handleLogout={handleLogout}
          setSelectedStudentNumber={setSelectedStudentNumber}
        />
      )}
      <div className="content">
        <Routes>
          <Route
            path="/login"
            element={<Login setUser={setUser} />}
          />
          <Route
            path="/register"
            element={<Register setUser={setUser} />}
          />
          <Route
            path="/cases"
            element={<CaseList cases={cases} setCases={setCases} selectCase={selectCase} user={user} />}
          />
          <Route
            path="/cases/add"
            element={<AddCase addCase={addCase} user={user} />}
          />
          <Route
            path="/cases/detail"
            element={<CaseDetail caseDetail={selectedCase} setSelectedStudentNumber={setSelectedStudentNumber} />}
          />
          <Route
            path="/student-details"
            element={<StudentDetailPage CampusID={selectedStudentNumber} selectCase={selectCase} />}
          />
          <Route
            path="/faculty"
            element={<MainApp user={user}/>}
          />
          <Route
            path="/profile"
            element={<UserProfile user={user} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
