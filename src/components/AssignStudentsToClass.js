import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';  // Updated here

const AssignStudentsToClass = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const { classId } = useParams();
    const navigate = useNavigate();  // Updated here

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await axios.get('http://localhost:8080/user/students', {
                withCredentials: true, 
              });
            setStudents(response.data);
        };

        fetchStudents();
    }, []);


    const handleAssign = async () => {
        try {
            await axios.post(`http://localhost:8080/classes/${classId}/students`, {
                classId,
                studentIds: selectedStudents
            });
            navigate(`/classes`);  
        } catch (error) {
            console.error('Error assigning students:', error);
        }
    };

    const handleSelectStudent = (studentId) => {
        setSelectedStudents((prevSelected) => {
            if (prevSelected.includes(studentId)) {
                return prevSelected.filter((id) => id !== studentId);
            } else {
                return [...prevSelected, studentId];
            }
        });
    };

    return (
        <div>
            <h1>Assign Students to Class</h1>
            <ul>
                {students.map((student) => (
                    <li key={student._id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedStudents.includes(student._id)}
                                onChange={() => handleSelectStudent(student._id)}
                            />
                            {student.username}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleAssign}>Assign Students</button>
        </div>
    );
};

export default AssignStudentsToClass;
