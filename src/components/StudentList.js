import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

    fetchStudents();
  }, []);

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
              className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-lg font-bold text-indigo-700 mb-2">
                {student.username}
              </h2>
              <p className="text-gray-700">
                <strong>Email:</strong> {student.email}
              </p>
              <p className="text-gray-700">
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
              <Link
                to={`/students/${student._id}/edit`}
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
    </div>
  );
};

export default StudentList;
