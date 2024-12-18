import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const GradeList = () => {
  const [grades, setGrades] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGradeName, setNewGradeName] = useState('');

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
      setGrades(grades.filter((grade) => grade._id !== id));
    } catch (error) {
      console.error('Error deleting grade:', error);
    }
  };

  const handleEdit = (grade) => {
    setSelectedGrade(grade);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedGrade(null);
  };

  const handleSaveChanges = async () => {
    if (selectedGrade) {
      try {
        await axios.put(
          `http://localhost:8080/grades/${selectedGrade._id}`,
          selectedGrade,
          { withCredentials: true }
        );
        setGrades(grades.map((grade) =>
          grade._id === selectedGrade._id ? selectedGrade : grade
        ));
        closeEditModal();
      } catch (error) {
        console.error('Error saving grade:', error);
      }
    }
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewGradeName('');
  };

  const handleCreateGrade = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8080/grades',
        { gradeName: newGradeName },
        { withCredentials: true }
      );
      setGrades([...grades, response.data]);
      closeCreateModal();
    } catch (error) {
      console.error('Error creating grade:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Grade List</h1>
        <Link>
        <button
          onClick={openCreateModal}
          className="inline-block px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
        >
          Create New Grade
        </button></Link>
      </div>

      {/* Grade List Section */}
      {grades.length > 0 ? (
        <ul className="space-y-4">
          {grades.map((grade) => (
            <li
              key={grade._id}
              className="flex justify-between items-center bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-gray-700 font-medium">
                <span className="font-semibold">Grade:</span> {grade?.gradeName || 'No Grade Assigned'}
              </span>
              <div className="flex space-x-3">
                <a
                  href={`/grades/${grade._id}/assign-students`}
                  className="w-40 px-3 py-4 text-sm text-green-600 bg-green-100 rounded-md hover:bg-green-200 transition-colors text-center"
                >
                  Assign Students
                </a>
                <button
                  onClick={() => handleEdit(grade)}
                  className="w-24 px-3 py-4 text-sm text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors text-center"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(grade._id)}
                  className="w-24 px-3 py-4 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors text-center"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No grades found.</p>
      )}

      {/* Modal for editing grade */}
      {isEditModalOpen && selectedGrade && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Grade</h2>
            <div>
              <label className="block text-gray-700">Grade Name</label>
              <input
                type="text"
                value={selectedGrade.gradeName || ''}
                onChange={(e) =>
                  setSelectedGrade({ ...selectedGrade, gradeName: e.target.value })
                }
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating grade */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create New Grade</h2>
            <div>
              <label className="block text-gray-700">Grade Name</label>
              <input
                type="text"
                value={newGradeName}
                onChange={(e) => setNewGradeName(e.target.value)}
                className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeCreateModal}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGrade}
                className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradeList;
