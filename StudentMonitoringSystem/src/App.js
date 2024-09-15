import React from 'react';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Topbar from "./Scenes/Global/TopBar";
import Sidebar from "./Scenes/Global/NavBar";
import Faculty from "./Scenes/Overviews/Faculty";
import Program from "./Scenes/Overviews/Program";
import Course from "./Scenes/Overviews/Course";
import Student from "./Scenes/Overviews/Student";
import StudentDetails from "./Scenes/Overviews/Student/StudentDetails";
import CourseDetail from "./Scenes/Overviews/Course/CourseDetail";
import ProgramDetail from "./Scenes/Overviews/Program/ProgramDetail";


//updated this to handle direct link and link with studentId 
const SecondaryApp = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentId = queryParams.get('studentId');
  
  console.log("this is the student objectID:", studentId); // This should log the actual studentId

  const iframeSrc = studentId
    ? `http://localhost:5173/student-details?studentId=${studentId}` // Append studentId to the URL
    : `http://localhost:5173/cases`;

  console.log("This is the iframe URL:", iframeSrc); // Debugging 

  return (
    <iframe
      src={iframeSrc}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Secondary Application"
    />
  );
};

const Login = () => {
  //const location = useLocation();
  
  // // Check if the current route is the login route
  // const isLoginRoute = location.pathname === "/";
  // console.log("This is the  URL:", isLoginRoute); // Debugging 

  return (
    <iframe
      src={'http://localhost:5173/login'}
      style={{ width: '100%', height: '100vh', border: 'none' }}
      title="Login"
    />
  );
}
  

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  // // Check if the current route is the login route
  const isLoginRoute = location.pathname === "/";
  console.log("This is the  URL:", isLoginRoute); // Debugging 
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isLoginRoute && <Sidebar />}  {/* Render Sidebar only if it's not the login route */}
          <main className="content">
            {!isLoginRoute && <Topbar />} {/* Render Topbar only if it's not the login route */}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/Faculty" element={<Faculty />} />
              <Route path="/Program" element={<Program />} />
              <Route path="/Student" element={<Student />} />
              <Route path="/students/:id" element={<StudentDetails />} />
              <Route path="/Course" element={<Course />} />
              <Route path="/course/:CourseCode" element={<CourseDetail />} />
              <Route path="/program/:ProgramCode" element={<ProgramDetail />} />
              <Route path="/cases" element={<SecondaryApp />} />  
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
