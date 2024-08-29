import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';  // Updated here

const ClassForm = () => {
    const [className, setClassName] = useState('');
    const [gradeId, setGradeId] = useState('');
    const [grades, setGrades] = useState([]);
    const navigate = useNavigate();  // Updated here
    const { id } = useParams();  // For editing

    useEffect(() => {
        const fetchGrades = async () => {
            const response = await axios.get('http://localhost:8080/grades', {
                withCredentials: true, 
              });
            setGrades(response.data);
        };

        fetchGrades();

        if (id) {
            const fetchClass = async () => {
                const response = await axios.get(`http://localhost:8080/classes/${id}`, {
                    withCredentials: true, 
                  });
                setClassName(response.data.className);
                setGradeId(response.data.grade._id);
            };

            fetchClass();
        }
    }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const classData = {
        className,
        gradeId
    };

    // Log the state before making the request
    console.log('Class Name:', className);
    console.log('Grade ID:', gradeId);
    console.log('Class Data:', classData);

    try {
        if (id) {
            console.log('Updating class with ID:', id);
            await axios.put(`http://localhost:8080/classes/${id}`, classData, {
                withCredentials: true, 
            });
        } else {
            console.log('Creating a new class');
            await axios.post('http://localhost:8080/classes', classData, {
                withCredentials: true, 
            });
        }

        navigate('/classes');  // Updated here
    } catch (error) {
        console.error('Error saving class:', error);
    }
};

    return (
        <div>
            <h1>{id ? 'Edit Class' : 'Create New Class'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Class Name</label>
                    <input
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Grade</label>
                    <select value={gradeId} onChange={(e) => setGradeId(e.target.value)} required>
                        <option value="">Select Grade</option>
                        {grades.map((grade) => (
                            <option key={grade._id} value={grade._id}>
                                {grade.gradeName}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">{id ? 'Update Class' : 'Create Class'}</button>
            </form>
        </div>
    );
};

export default ClassForm;
