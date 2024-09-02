import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user/students');
        setStudents(response.data);
      } catch (err) {
        setError('Error fetching students. Please try again later.');
        console.error('Error fetching students:', err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <h1>Student List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {students.map((student) => (
          <li key={student._id}>
            <p>
              <strong>Username:</strong> {student.username}
            </p>
            <p>
              <strong>Email:</strong> {student.email}
            </p>

            {/* Display Class */}
            {student.class ? (
              <p>
                <strong>Class:</strong> {student.class.className || 'Class Name Not Available'}
              </p>
            ) : (
              <p>
                <strong>Class:</strong> Not Assigned
              </p>
            )}

            {/* Display Parents */}
            {student.parents && student.parents.length > 0 ? (
              <div>
                <p>
                  <strong>Parents:</strong>
                </p>
                <ul>
                  {student.parents.map((parent) => (
                    <li key={parent._id}>
                      {parent.username} - {parent.email}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>
                <strong>Parents:</strong> No Parents Listed
              </p>
            )}

            {/* Edit Link */}
            <Link to={`/students/${student._id}/edit`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;
