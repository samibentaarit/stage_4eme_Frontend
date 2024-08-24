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

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
