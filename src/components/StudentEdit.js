// StudentEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentEdit = () => {
  const { id } = useParams(); // Get the student ID from the URL
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    username: '',
    email: '',
    class: '',
    parents: [],
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/user/parent/${id}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8080/user/users/${id}`, student);
      alert('Student updated successfully!');
      navigate('/students'); // Redirect to the students list
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const containerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  };

  const labelStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Edit Student</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Username:</label>
          <input
            type="text"
            name="username"
            value={student.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Email:</label>
          <input
            type="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Class:</label>
          <input
            type="text"
            name="class"
            value={student.class || ''}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Save Changes</button>
      </form>
    </div>
  );
};

export default StudentEdit;
