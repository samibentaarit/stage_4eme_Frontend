import React, { useState } from 'react';
import axios from 'axios';
import '../style/Login.css';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleRoleChange = (event) => {
    const value = event.target.value;
    setRole((prevRoles) =>
      prevRoles.includes(value)
        ? prevRoles.filter((role) => role !== value)
        : [...prevRoles, value]
    );
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/api/auth/signup', {
        username,
        email,
        password,
        role,
      });

      if (response.status === 200) {
        console.log('User signed up successfully:', response.data);
        // Optionally, redirect or update UI after successful sign-up
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      // Handle error cases, like user already exists or validation errors
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"            
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="role">Roles:</label>
          <select id="role" multiple={false} value={role} onChange={handleRoleChange}>
            <option value="moderator">Moderator</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
