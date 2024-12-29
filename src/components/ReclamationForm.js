import React, { useState, useEffect } from "react";
import axios from "axios";

const ReclamationForm = () => {
  const [sujet, setSujet] = useState("");
  const [information, setInformation] = useState("");
  const [etat, setEtat] = useState("Simple Fault");
  const [etudiantConserne, setEtudiantConserne] = useState([]);
  const [parentConserne, setParentConserne] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [includeParents, setIncludeParents] = useState(true);
  const [etudiantFilter, setEtudiantFilter] = useState("");

  useEffect(() => {
    // Fetch students when the component mounts
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/students");
        setStudents(response.data); // Populate the students list
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleEtudiantCheckboxChange = (studentId) => {
    setEtudiantConserne((prevSelected) => {
      const updatedList = prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId];

      // Extract parents for the selected students
      const selectedParents = [];
      updatedList.forEach((id) => {
        const student = students.find((student) => student._id === id);
        if (student?.parents) {
          selectedParents.push(...student.parents.filter(Boolean)); // Avoid undefined entries
        }
      });

      setParentConserne(selectedParents);
      return updatedList;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const redacteurId = localStorage.getItem("id");

    const newReclamation = {
      sujet,
      information,
      etat,
      redacteur: redacteurId,
      etudiantConserne,
      parentConserne: includeParents ? parentConserne.map((parent) => parent._id) : [], // Send parent IDs
    };

    try {
      const endpoint = includeParents
        ? 'http://localhost:8080/reclamations'
        : 'http://localhost:8080/reclamations/default';
      const response = await axios.post(endpoint, newReclamation);
      setMessage('Reclamation created successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Error creating reclamation.');
      console.error(error);
    }
  };

  // Filter students based on search input
  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(etudiantFilter.toLowerCase()) ||
    student.email.toLowerCase().includes(etudiantFilter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto bg-white py-5 px-10 rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-indigo-600 text-center mb-8">
        Create Reclamation
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Sujet Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Sujet:</label>
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the subject"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Information:</label>
          <textarea
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter detailed information"
            rows="2"
          />
        </div>

        {/* Etat Field */}
        <div>
          <label htmlFor="etat" className="block text-gray-700 font-medium mb-2">Etat:</label>
          <select
            id="etat"
            value={etat}
            onChange={(e) => setEtat(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="simple fault">Simple Fault</option>
            <option value="severe">Severe</option>
            <option value="intermediate">Intermediate</option>
          </select>
        </div>

        {/* Etudiant Conserne Field */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Etudiant Conserne:
          </label>
          <input
            type="text"
            placeholder="Search students..."
            value={etudiantFilter}
            onChange={(e) => setEtudiantFilter(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="max-h-40 overflow-y-auto border rounded-lg mt-0 p-3 bg-gray-50">
            {filteredStudents.map((student) => (
              <label
                key={student._id}
                onClick={() => handleEtudiantCheckboxChange(student._id)}
                className={`flex items-center justify-between cursor-pointer p-2 rounded-lg ${
                  etudiantConserne.includes(student._id) ? "bg-indigo-100" : ""
                }`}
              >
                <span className="text-gray-600">
                  {student.username} ({student.email})
                </span>
                <input
                  type="checkbox"
                  checked={etudiantConserne.includes(student._id)}
                  onChange={() => handleEtudiantCheckboxChange(student._id)}
                  className="w-4 h-4 pointer-events-none"
                />
              </label>
            ))}
          </div>
        </div>
 {/* Notify Parents */}
 <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={includeParents}
              onChange={(e) => setIncludeParents(e.target.checked)}
              className="w-4 h-4 mr-2"
            />
            <label className="text-gray-700 font-medium">
              Notifier les Parents? (Auto-filled)
            </label>
          </div>      
              </div>

        {/* Display Parents */}
        <div className="space-y-2">
          <h3 className="text-gray-700 font-medium">Selected Parents:</h3>
          <ul className="list-disc list-inside bg-gray-50 p-3 rounded-lg">
            {parentConserne.map((parent) => (
              <li key={parent._id} className="text-gray-600">
                {parent.username} ({parent.email})
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Create Reclamation
        </button>
      </form>

      {/* Message Display */}
      {message && (
        <div className="mt-6 p-4 text-center text-white bg-green-500 rounded-lg">
          {message}
        </div>
      )}
    </div>
  );
};

export default ReclamationForm;
