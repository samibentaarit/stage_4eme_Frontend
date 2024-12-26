import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/students");
        setStudents(response.data);
      } catch (err) {
        setError("Error fetching students. Please try again later.");
        console.error("Error fetching students:", err);
      }
    };

    const fetchGrades = async () => {
      try {
        const response = await axios.get("http://localhost:8080/grades");
        setGrades(response.data);
      } catch (err) {
        console.error("Error fetching grades:", err);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/classes");
        setClasses(response.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };

    fetchStudents();
    fetchGrades();
    fetchClasses();
  }, []);

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };

  const handleModalChange = (e) => {
    setSelectedStudent({ ...selectedStudent, [e.target.name]: e.target.value });
  };

  const handleDropdownChange = (e) => {
    const { name, value } = e.target;
    setSelectedStudent({ ...selectedStudent, [name]: value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8080/user/users/${selectedStudent._id}`, selectedStudent);
      alert("Student updated successfully!");
      setStudents((prev) => prev.map((s) => (s._id === selectedStudent._id ? selectedStudent : s)));
      closeModal();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  // Filter students based on the search term
  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">
        Student List
      </h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search students..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Student List */}
      {filteredStudents.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <li
              key={student._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-indigo-700 mb-2">
                  {student.username}
                </h2>
                <p className="text-gray-700">
                  <strong>Email:</strong> {student.email}
                </p>
                <p className="text-gray-700">
                  <strong>Grade:</strong>{" "}
                  {student.grade
                    ? student.grade.gradeName || "Grade Name Not Available"
                    : "Not Assigned"}
                  <br />
                  <strong>Class:</strong>{" "}
                  {student.class
                    ? student.class.className || "Class Name Not Available"
                    : "Not Assigned"}
                </p>
                <div className="mt-4">
                  <p className="text-gray-700">
                    <strong>Parents:</strong>{" "}
                    {student.parents && student.parents.length > 0
                      ? ""
                      : "No Parents Listed"}
                  </p>
                  <ul className="ml-4 list-disc text-gray-600">
                    {student.parents &&
                      student.parents.map((parent) => (
                        <li key={parent._id}>
                          <span className="text-gray-800 font-medium">
                            {parent.username}
                          </span>{" "}
                          - {parent.email}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
              <Link
                onClick={() => openModal(student)}
                className="block mt-4 text-center text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg py-2 transition duration-300"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No students found.</p>
      )}

      {/* Modal */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Edit Student</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={selectedStudent.username}
                  onChange={handleModalChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={selectedStudent.email}
                  onChange={handleModalChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Class</label>
                <select
                  name="class"
                  value={selectedStudent.class || ""}
                  onChange={handleDropdownChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Grade</label>
                <select
                  name="grade"
                  value={selectedStudent.grade || ""}
                  onChange={handleDropdownChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade._id} value={grade._id}>
                      {grade.gradeName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Parents</label>
                <ul className="list-disc pl-4">
                  {selectedStudent.parents?.map((parent) => (
                    <li key={parent._id}>
                      <span className="text-gray-800 font-medium">
                        {parent.username}
                      </span>{" "}
                      - {parent.email}
                    </li>
                  )) || <p className="text-gray-600">No Parents Listed</p>}
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg py-2 px-4 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg py-2 px-4"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
