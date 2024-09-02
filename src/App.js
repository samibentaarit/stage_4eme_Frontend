// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage';
import HomePage from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AnnanceList from './components/AnnanceList';
import AnnanceForm from './components/AnnanceForm';
import ReclamationForm from './components/ReclamationForm';
import ReclamationList from './components/ReclamationList';
import ClassList from './components/ClassList';
import ClassForm from './components/ClassForm';
import AssignStudentsToClass from './components/AssignStudentsToClass';
import StudentList from './components/StudentList';
import GradeForm from './components/GradeForm';
import GradeList from './components/GradeList';
import StudentEdit from './components/StudentEdit';
import './index.css'; // Import Tailwind CSS here

function App() {
  const isLoggedIn = document.cookie.includes('accessToken') !== null;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/reclamations" element={<ReclamationList />} />
        <Route path="/annances" element={<AnnanceList />} />
        <Route path="/create-annance" element={<AnnanceForm />} />
        <Route path="/create-reclamation" element={<ReclamationForm />} />
        <Route path="/classes" element={<ClassList />} />
        <Route path="/classes/create" element={<ClassForm />} />
        <Route path="/classes/:id" element={<ClassForm />} />
        <Route path="/classes/:classId/students" element={<AssignStudentsToClass />} />
        <Route path="/students" element={<StudentList />} />
        <Route path="/students/:id/edit" element={<StudentEdit />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/grades" element={<GradeList />} />
        <Route path="/grades/create" element={<GradeForm />} />
        <Route path="/grades/:id/edit" element={<GradeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
