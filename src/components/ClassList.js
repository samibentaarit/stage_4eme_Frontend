import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

const ClassList = () => {
    const [classes, setClasses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [editClass, setEditClass] = useState({});
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            const response = await axios.get('http://localhost:8080/classes');
            setClasses(response.data);
        };

        const fetchGrades = async () => {
            const response = await axios.get('http://localhost:8080/grades');
            setGrades(response.data);
        };

        fetchClasses();
        fetchGrades();
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

    const handleOpenModal = (classObj = null) => {
        setIsCreateMode(!classObj);
        setEditClass(classObj ? { ...classObj } : {});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditClass({});
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            className: editClass.className,
            gradeId: editClass.grade?._id,
        };

        try {
            const response = isCreateMode
                ? await axios.post('http://localhost:8080/classes', payload, { withCredentials: true })
                : await axios.put(`http://localhost:8080/classes/${editClass._id}`, payload, { withCredentials: true });

            if (isCreateMode) {
                setClasses([...classes, response.data]);
            } else {
                setClasses(classes.map((c) => (c._id === editClass._id ? response.data : c)));
            }

            handleCloseModal();
        } catch (error) {
            console.error(isCreateMode ? 'Error creating class:' : 'Error updating class:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditClass((prev) => ({ ...prev, [name]: value }));
    };

    const handleGradeChange = (e) => {
        const selectedGrade = grades.find((grade) => grade._id === e.target.value);
        setEditClass((prev) => ({ ...prev, grade: selectedGrade }));
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Class List</h1>
                <Link >
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="inline-block px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
                    >
                        Create New Class
                    </button>
                </Link>
            </div>

            {classes.length > 0 ? (
                <ul className="space-y-4">
                    {classes.map((classObj) => (
                        <li
                            key={classObj._id}
                            className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                        >
                            <span className="text-gray-700 font-medium">
                                <span className="font-semibold">Grade: {classObj.grade?.gradeName} - Class: {classObj.className}</span>
                            </span>
                            <div className="flex space-x-3">
                                <Link
                                    to={`/classes/${classObj._id}/students`}
                                    className="w-30 px-3 py-4 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors text-center"
                                >
                                    Assign Students
                                </Link>
                                <button
                                    onClick={() => handleOpenModal(classObj)}
                                    className="w-24 px-3 py-4 text-sm text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors text-center"
                                >
                                    Edit
                                </button>
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

            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel={isCreateMode ? "Create Class" : "Edit Class"}
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-semibold mb-4">
                    {isCreateMode ? "Create New Class" : "Edit Class"}
                </h2>
                <form onSubmit={handleEditSubmit}>
                    <div className="mb-4">
                        <label htmlFor="grade" className="block text-gray-700 font-medium mb-2">
                            Grade
                        </label>
                        <select
                            id="grade"
                            name="grade"
                            value={editClass.grade?._id || ''}
                            onChange={handleGradeChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="" disabled>Select a grade</option>
                            {grades.map((grade) => (
                                <option key={grade._id} value={grade._id}>{grade.gradeName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="className" className="block text-gray-700 font-medium mb-2">
                            Class Name
                        </label>
                        <input
                            type="text"
                            id="className"
                            name="className"
                            value={editClass.className || ''}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                        >
                            {isCreateMode ? "Create Class" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClassList;
