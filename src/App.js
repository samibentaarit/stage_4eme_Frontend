import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFoundPage from './components/NotFoundPage';
import HomePage from './components/Home';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ReclamationList from './components/ReclamationList';
import AnnanceList from './components/AnnonceList';
import AnnanceForm from './components/AnnanceForm';
import ReclamationForm from './components/ReclamationForm';
import ClassList from './components/ClassList';
import AssignStudentsToClass from './components/AssignStudentsToClass';
import StudentList from './components/StudentList';
import GradeList from './components/GradeList';
import './index.css';
import AssignStudentsToGrade from './components/AssignStudentsToGrade';
import AssignStudentsToGradeCopy from './components/AssignStudentsToGrade copy';
import MainLayout from './components/layouts/MainLayout'; 
import AuthLayout from './components/layouts/AuthLayout'; 
import ResetPassword from './components/ResetPassword';
import RequestPasswordReset from './components/RequestPasswordReset';

function App() {
  const isLoggedIn = document.cookie.includes('accessToken') != null;

  return (
    <Router>
      <Routes>
       <Route path="/password-reset" element={<AuthLayout><RequestPasswordReset /> </AuthLayout>} />
        <Route path="/password-reset/:token" element={<AuthLayout><ResetPassword /> </AuthLayout>} />
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
        <Route path="/" element={<MainLayout><ProtectedRoute isLoggedIn={isLoggedIn}><HomePage /></ProtectedRoute></MainLayout>} />
        <Route path="/reclamations" element={<MainLayout><ReclamationList /></MainLayout>} />
        <Route path="/announcements" element={<MainLayout><AnnanceList /></MainLayout>} />
        <Route path="/create-announcement" element={<MainLayout><AnnanceForm /></MainLayout>} />
        <Route path="/create-reclamation" element={<MainLayout><ReclamationForm /></MainLayout>} />
        <Route path="/classes" element={<MainLayout><ClassList /></MainLayout>} />
        <Route path="/classes/:classId/students" element={<MainLayout><AssignStudentsToClass /></MainLayout>} />
        <Route path="/students" element={<MainLayout><StudentList /></MainLayout>} />
        <Route path="/grades" element={<MainLayout><GradeList /></MainLayout>} />
        <Route path="/grades/:gradeId/assign-students" element={<MainLayout><AssignStudentsToGrade /></MainLayout>} />
        <Route path="/gradess/:gradeId/assign-students" element={<MainLayout><AssignStudentsToGradeCopy /></MainLayout>} />
        <Route path="*" element={<AuthLayout><NotFoundPage /></AuthLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
