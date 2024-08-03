import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>Here you can find information about the app.</p>
      <Link to="/signup">Go to Sign Up</Link>
    </div>
  );
}

export default HomePage;