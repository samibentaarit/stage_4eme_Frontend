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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Student List</h1>
      {error && <p className="text-red-500">{error}</p>}
      {students.length > 0 ? (
        <ul className="space-y-4">
          {students.map((student) => (
            <li key={student._id} className="border p-4 rounded-lg shadow-sm">
              <p>
                <strong>Username:</strong> {student.username}
              </p>
              <p>
                <strong>Email:</strong> {student.email}
              </p>
              <p>
                <strong>Class:</strong> {student.class ? student.class.className || 'Class Name Not Available' : 'Not Assigned'}
              </p>
              <div>
                <p>
                  <strong>Parents:</strong> {student.parents && student.parents.length > 0 ? '' : 'No Parents Listed'}
                </p>
                <ul>
                  {student.parents &&
                    student.parents.map((parent) => (
                      <li key={parent._id} className="ml-4">
                        {parent.username} - {parent.email}
                      </li>
                    ))}
                </ul>
              </div>
              <Link to={`/students/${student._id}/edit`} className="text-blue-500 hover:underline">
                Edit
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No students found.</p>
      )}
    </div>
  );
};

export default StudentList;
