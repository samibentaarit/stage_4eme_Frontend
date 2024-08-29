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
        <div>
            <h1>Class List</h1>
            <Link to="/classes/create">Create New Class</Link>
            <ul>
                {classes.map((classObj) => (
                    <li key={classObj._id}>
                        {classObj.className} - Grade: {classObj.grade.name}
                        <button onClick={() => handleDelete(classObj._id)}>Delete</button>
                        <Link to={`/classes/${classObj._id}`}>Edit</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassList;
