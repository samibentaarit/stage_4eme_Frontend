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
        <div>
            <h1>Class List</h1>
            <Link to="/grades/create"><button>Create New Class</button></Link>
            <ul>
                {grades.map((classObj) => (
                    <li key={classObj._id}>
                        {classObj.className} - Grade: {classObj.grade?.gradeName || 'No Grade Assigned'}
                        <Link to={`/grades/${classObj._id}/edit`}><button>Edit</button></Link>
                        <button onClick={() => handleDelete(classObj._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassList;
