import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await axios.get('http://localhost:8080/students');
            setStudents(response.data);
        };

        fetchStudents();
    }, []);

    return (
        <div>
            <h1>Student List</h1>
            <ul>
                {students.map((student) => (
                    <li key={student._id}>
                        {student.username} - {student.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentList;
