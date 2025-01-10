import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const AssignStudentsToGrade = () => {
  const { gradeId } = useParams();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [grade, setGrade] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [unassignedStudents, setUnassignedStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGradeAndStudents = async () => {
      try {
        const gradeResponse = await axios.get(`http://localhost:8080/grades/${gradeId}`);
        setGrade(gradeResponse.data);

        const studentsResponse = await axios.get("http://localhost:8080/user/students");
        const allStudents = studentsResponse.data;

        const assignedResponse = await axios.get(`http://localhost:8080/grades/${gradeId}/students`);
        const assignedToGrade = assignedResponse.data.map((student) => student._id);

        const unassigned = [];
        const assigned = [];
        allStudents.forEach((student) => {
          if (!student.grade?.gradeName) {
            unassigned.push(student);
          } else if (student.grade.gradeId !== gradeId) {
            assigned.push(student);
          }
        });

        setStudents(allStudents);
        setUnassignedStudents(unassigned);
        setAssignedStudents(assigned);
        setSelectedStudents(assignedToGrade);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      }
    };

    fetchGradeAndStudents();
  }, [gradeId]);

  const handleCheckboxChange = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleAssignStudents = async () => {
    try {
      await axios.post(
        `http://localhost:8080/grades/${gradeId}/students`,
        { gradeId, studentIds: selectedStudents },
        { withCredentials: true }
      );
      alert("Students successfully assigned to the grade.");
      navigate("/grades");
    } catch (error) {
      console.error("Error assigning students:", error);
      alert("Failed to assign students. Please try again.");
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filterList = (list) =>
    list.filter(
      (student) =>
        (student?.username?.toLowerCase() || "").includes(searchTerm) ||
        (student?.email?.toLowerCase() || "").includes(searchTerm)
    );

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">
        Assign Students to grade {grade?.gradeName || "Grade"}
      </h1>

      {/* Search Filter */}
      <input
        type="text"
        placeholder="Search students by name or email"
        value={searchTerm}
        onChange={handleSearch}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="grid grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">Unassigned Students</h2>
          {filterList(unassignedStudents).length > 0 ? (
            filterList(unassignedStudents).map((student) => (
              <div key={student._id} className="flex items-center mb-2">
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
            <p className="text-gray-500">No unassigned students available.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Assigned to Other Grades</h2>
          {filterList(assignedStudents).length > 0 ? (
            filterList(assignedStudents).map((student) => (
              <div key={student._id} className="flex items-center mb-2">
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
            <p className="text-gray-500">No students assigned to other grades.</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Assigned to this grade </h2>
          {filterList(
            students.filter((student) =>
              selectedStudents.includes(student._id)
            )
          ).length > 0 ? (
            filterList(
              students.filter((student) =>
                selectedStudents.includes(student._id)
              )
            ).map((student) => (
              <div key={student._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={student._id}
                  checked={true}
                  onChange={() => handleCheckboxChange(student._id)}
                  className="mr-2 w-5 h-5 text-indigo-600 border-gray-300 rounded"
                />
                <label htmlFor={student._id} className="text-gray-700">
                  {student?.username} ({student?.email})
                </label>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No assigned students to this grade.</p>
          )}
        </div>
      </div>

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

export default AssignStudentsToGrade;
