import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AssignStudents = () => {
  const { classId } = useParams(); // Get classId from the URL
  const [students, setStudents] = useState([]); // All students fetched
  const [filteredStudents, setFilteredStudents] = useState([]); // To hold filtered students
  const [selectedStudents, setSelectedStudents] = useState([]); // Students selected for assignment
  const [classDetails, setClassDetails] = useState(null); // Class details
  const [searchTerm, setSearchTerm] = useState(""); // To manage the search input
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassAndStudents = async () => {
      try {
        // Fetch class details
        const classResponse = await axios.get(`http://localhost:8080/classes/${classId}`);
        setClassDetails(classResponse.data);

        // Fetch all students
        const studentsResponse = await axios.get(`http://localhost:8080/user/students-by-class/${classId}`);
        setStudents(studentsResponse.data.students);
        setFilteredStudents(studentsResponse.data.students); // Initialize filtered list

        // Fetch already assigned students
        const assignedResponse = await axios.get(`http://localhost:8080/classes/${classId}/students`);
        setSelectedStudents(assignedResponse.data.map((student) => student._id));
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchClassAndStudents();
  }, [classId]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId) // Remove student if already selected
        : [...prev, studentId] // Add student if not selected
    );
  };

  const handleAssignStudents = async () => {
    try {
      await axios.post(
        `http://localhost:8080/classes/${classId}/students`,
        { classId, studentIds: selectedStudents },
        { withCredentials: true }
      );

      alert("Students successfully assigned to the class.");
      navigate("/classes"); // Navigate back to the class list
    } catch (error) {
      console.error("Error assigning students:", error);
      alert("Failed to assign students. Please try again.");
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredStudents(
      students.filter(
        (student) =>
          (student?.username?.toLowerCase() || "").includes(term) ||
          (student?.email?.toLowerCase() || "").includes(term)
      )
    );
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-3xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Assign Students to class {( classDetails?.grade?.gradeName + " " + classDetails?.className  || "Class")}
      </h1>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search students by name or email"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {/* Student List */}
      <div className="space-y-4">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <div key={student._id} className="flex items-center">
              <input
                type="checkbox"
                id={student._id}
                checked={selectedStudents.includes(student._id)}
                onChange={() => handleCheckboxChange(student._id)}
                className="mr-2 w-5 h-5 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor={student._id} className="text-gray-700">
                {student.username} ({student.email})
              </label>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No students found matching your search.</p>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleAssignStudents}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Assign Selected Students
        </button>
        <button
          onClick={() => navigate(-1)}
          className="ml-4 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AssignStudents;
