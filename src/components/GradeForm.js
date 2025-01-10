import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const GradeForm = () => {
    const [gradeName, setGradeName] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); 

    useEffect(() => {
        if (id) {
            const fetchGrade = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/grades/${id}`);
                    setGradeName(response.data.gradeName);
                } catch (error) {
                    console.error('Error fetching grade:', error);
                }
            };

            fetchGrade();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const gradeData = {
            gradeName 
        };

        try {
            if (id) {
                await axios.put(`http://localhost:8080/grades/${id}`, gradeData);
            } else {
                await axios.post('http://localhost:8080/grades', gradeData);
            }

            navigate('/grades');
        } catch (error) {
            console.error('Error saving grade:', error);
        }
    };

    return (
        <div>
            <h1>{id ? 'Edit Grade' : 'Create New Grade'}</h1>
            <br />  
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Grade Name</label>
                    <input
                        type="text"
                        value={gradeName}
                        onChange={(e) => setGradeName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{id ? 'Update Grade' : 'Create Grade'}</button>
            </form>
        </div>
    );
};

export default GradeForm;
