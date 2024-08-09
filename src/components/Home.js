import React from 'react';
import { Link } from 'react-router-dom';

const handleLogout = () => {
  // Remove the authentication token from localStorage (or sessionStorage)
  sessionStorage.removeItem('accessToken');
  localStorage.removeItem('userData'); // If you store user data

  // Redirect the user to the login page
  window.location.href = '/login';
};

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Here you can find information about the app.</p>
      <Link to="/signup">Go to Sign Up</Link>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default HomePage;