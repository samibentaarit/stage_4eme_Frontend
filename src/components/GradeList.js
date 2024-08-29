import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GradeList = () => {
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await axios.get('http://localhost:8080/grades');
                setGrades(response.data);
            } catch (error) {
                console.error('Error fetching grades:', error);
            }
        };

        fetchGrades();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/grades/${id}`);
            setGrades(grades.filter(grade => grade._id !== id));
        } catch (error) {
            console.error('Error deleting grade:', error);
        }
    };

    return (
        <div>
            <h1>Grades</h1>
            <Link to="/grades/create">
                <button>Create New Grade</button>
            </Link>
            <ul>
                {grades.map(grade => (
                    <li key={grade._id}>
                        {grade.name}
                        <Link to={`/grades/${grade._id}/edit`}>
                            <button>Edit</button>
                        </Link>
                        <button onClick={() => handleDelete(grade._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GradeList;
