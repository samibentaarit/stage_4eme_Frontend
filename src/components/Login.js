// src/Login.js
import React, { useState } from 'react';
import '../style/Login.css';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/api/auth/signin', {
        username,
        password,
      });

      if (response.status === 200) {
        const { id, username, email, roles, accessToken, refreshToken, deviceId } = response.data;

        // Save data in session storage
        sessionStorage.setItem('id', id);
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('roles', JSON.stringify(roles));
        sessionStorage.setItem('accessToken', accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('deviceId', deviceId);

        console.log('User data saved to session storage');
        // You can navigate to another page or update the UI as needed
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
      // Handle error cases, like invalid credentials
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
