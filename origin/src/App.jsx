import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Add this import statement
import CaseList from './components/CaseList';
import AddCase from './components/AddCase';
import CaseDetail from './components/CaseDetail';
import SidePanel from './components/SidePanel';
import Login from './components/Login';
import Register from './components/Register';
import StudentDetailPage from './components/StudentDetailPage';

///testing commit to branch
import './App.css';

const App = () => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // Initially set to login
  const [user, setUser] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);



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
          setCurrentView('list'); // Set view to 'list' if user is authenticated
        } catch (error) {
          console.error('Error fetching user', error);
          setUser(null);
          setCurrentView('login'); // Redirect to login if authentication fails
        }
      } else {
        setUser(null);
        setCurrentView('login'); // Redirect to login if no token
      }
    };
    fetchUser();
  }, []);

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
    setCurrentView('detail');
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
    setCurrentView('login');
  };


  // New function to handle updating a case
  const onUpdateCase = (updatedCase) => {
    setCases(cases.map(c => c._id === updatedCase._id ? updatedCase : c));
    setSelectedCase(updatedCase); // Update the selected case with the new details
  };



  return (
    <div className="App">
      <SidePanel 
        user={user} 
        setCurrentView={setCurrentView} 
        handleLogout={handleLogout} 
        setSelectedStudentNumber={setSelectedStudentNumber} //pass setter function
        />
      <div className="content">
        <h1>Case Management System</h1>
        {user ? (
          <>
            {currentView === 'add' && <AddCase addCase={addCase} setCurrentView={setCurrentView} user={user} />}
            {currentView === 'list' && <CaseList cases={cases} setCases={setCases} setCurrentView={setCurrentView} selectCase={selectCase} user={user} />}
            {currentView === 'detail' && selectedCase && (
            <CaseDetail caseDetail={selectedCase} onUpdateCase={onUpdateCase} setSelectedStudentNumber={setSelectedStudentNumber} setCurrentView={setCurrentView} 
            />
          )}
            {currentView === 'profile' && <div>Profile View</div>}
            {currentView === 'studentDetails' && selectedStudentNumber && (
              <StudentDetailPage CampusID={selectedStudentNumber} selectCase={selectCase} />
            )}
          </>
        ) : (
          <>
            {currentView === 'login' && <Login setUser={setUser} setCurrentView={setCurrentView} />}
            {currentView === 'register' && <Register setUser={setUser} setCurrentView={setCurrentView} />}
            <button onClick={() => setCurrentView('register')}>Register</button>
            <button onClick={() => setCurrentView('login')}>Login</button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
