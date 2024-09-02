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
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Class List</h1>
          <Link to="/classes/create" className="text-blue-500 hover:underline mb-4 block">
            Create New Class
          </Link>
          {classes.length > 0 ? (
            <ul className="space-y-4">
              {classes.map((classObj) => (
                <li key={classObj._id} className="flex justify-between items-center border p-4 rounded-lg shadow-sm">
                  <span>
                  {classObj.grade.gradeName} - {classObj.className}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleDelete(classObj._id)}
                      className="text-red-500 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                    <Link to={`/classes/${classObj._id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                    <Link to={`/classes/${classObj._id}/students`} className="text-blue-500 hover:underline">
                      Assign Students
                    </Link>
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
