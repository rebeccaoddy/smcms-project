import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import statement
import TopNavBar from './components/TopNavBar';
import CaseList from './components/CaseList';
import AddCase from './components/AddCase';
import CaseDetail from './components/CaseDetail';
import Login from './components/Login';
import Register from './components/Register';
import StudentDetailPage from './components/StudentDetailPage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

//handle SMS application navigation afer login 
const MainApp = () => {
  window.location.href = "http://localhost:3000/faculty"
  };

const App = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);
  const navigate = useNavigate(); // Use this to navigate programmatically

// Check if the current route is the login or register page
const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

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
    console.log('Case ID to Select:', caseId); //  debugging
    const caseDetail = cases.find((c) => c._id === caseId);
    console.log('Selected Case:', caseDetail); // debugging
    setSelectedCase(caseDetail);
    navigate('/cases/detail'); // Navigate to case detail view
  };

//logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // clear token from localStorage
    setUser(null);
    navigate('/login'); // redirect to login after logout
  };

// function to handle updating a case
  const onUpdateCase = (updatedCase) => {
    setCases(cases.map(c => c._id === updatedCase._id ? updatedCase : c));
    setSelectedCase(updatedCase); // Update the selected case with the new details
  };

  //handle deletion of case
  const onDeleteCase = (deletedCaseId) => {
    setCases(cases.filter(c => c._id !== deletedCaseId));
    navigate("/cases")

  };
  
  return (
    <div className="App">
      {!isAuthPage && (
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
              element={<CaseDetail caseDetail={selectedCase} onUpdateCase={onUpdateCase} setSelectedStudentNumber={setSelectedStudentNumber} onDeleteCase={onDeleteCase} selectCase={selectCase} />}
            />

            <Route
              path="/student-details"
              element={<StudentDetailPage CampusID={selectedStudentNumber} selectCase={selectCase} />}
            />
            <Route
              path="/faculty"
              element={<MainApp user={user}/>}
            />  {/* navigate to SMS application */}
          </Routes>
        </div>
      </div>
  );
};

export default App;
