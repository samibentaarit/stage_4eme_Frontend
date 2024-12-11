import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClassList = () => {
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get('http://localhost:8080/grades', {
                    withCredentials: true,
                });
                setGrades(response.data);
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/grades/${id}`, {
                withCredentials: true, 
              });
            setGrades(grades.filter((classObj) => classObj._id !== id));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Grade List</h1>
        <Link
          to="/grades/create"
          className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
        >
          Create New Grade
        </Link>
      </div>
    
      {/* Grade List Section */}
      {grades.length > 0 ? (
        <ul className="space-y-4">
          {grades.map((grade) => (
            <li
              key={grade._id}
              className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              {/* Grade Name */}
              <span className="text-gray-700 font-medium">
                <span className="font-semibold">Grade:</span> {grade?.gradeName || 'No Grade Assigned'}
              </span>
    
              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Link
                  to={`/grades/${grade._id}/edit`}
                  className="w-24 px-3 py-4 text-sm text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors text-center"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(grade._id)}
                  className="w-24 px-3 py-4 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors text-center"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No grades found.</p>
      )}
    </div>
    
      );
    };
    
export default ClassList;
