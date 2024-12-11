import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ClassList = () => {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            const response = await axios.get('http://localhost:8080/classes');
            setClasses(response.data);
        };

        fetchClasses();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/classes/${id}`, {
                withCredentials: true,
            });
            setClasses(classes.filter((classObj) => classObj._id !== id));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Class List</h1>
          <Link
            to="/classes/create"
            className="inline-block px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Create New Class
          </Link>
        </div>
      
        {/* Class List Section */}
        {classes.length > 0 ? (
          <ul className="space-y-4">
            {classes.map((classObj) => (
              <li
                key={classObj._id}
                className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
              >
                {/* Class Details */}
                <span className="text-gray-700 font-medium">
                  <span className="font-semibold">{classObj.grade?.gradeName} - class: {classObj.className}</span>
                </span>
      
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link
                    to={`/classes/${classObj._id}/students`}
                    className="w-30 px-3 py-4 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors text-center"
                  >
                    Assign Students
                  </Link>
                  <Link
                    to={`/classes/${classObj._id}`}
                    className="w-24 px-3 py-4 text-sm text-yellow-600 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(classObj._id)}
                    className="w-24 px-3 py-2 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors text-center"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No classes found.</p>
        )}
      </div>
      
      );
    };

export default ClassList;
