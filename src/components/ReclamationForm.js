// src/components/ReclamationForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReclamationForm = () => {
  const [sujet, setSujet] = useState('');
  const [information, setInformation] = useState('');
  const [etat, setEtat] = useState('');
  const [etudiantConserne, setEtudiantConserne] = useState([]);
  const [parentConserne, setParentConserne] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [includeParents, setIncludeParents] = useState(true);
  const [etudiantFilter, setEtudiantFilter] = useState('');

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8080/user/users');
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEtudiantCheckboxChange = (studentId) => {
    setEtudiantConserne((prevSelected) => {
      const updatedList = prevSelected.includes(studentId)
        ? prevSelected.filter((id) => id !== studentId)
        : [...prevSelected, studentId];

      // Automatically fill parentConserne based on the selected students
      const selectedParents = [];
      updatedList.forEach((id) => {
        const student = users.find((user) => user._id === id);
        if (student?.parents) {
          selectedParents.push(...student.parents);
        }
      });
      setParentConserne([...new Set(selectedParents)]); // Remove duplicate parent IDs

      return updatedList;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const redacteurId = localStorage.getItem('id');

    const newReclamation = {
      sujet,
      information,
      etat,
      redacteur: redacteurId,
      etudiantConserne,
      parentConserne: includeParents ? parentConserne : [],
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

  // Filtered users based on search input
  const filteredEtudiants = users.filter((user) =>
    user.username.toLowerCase().includes(etudiantFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(etudiantFilter.toLowerCase())
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
            <label className="block text-gray-700 font-medium mb-2">Etat:</label>
            <select
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
            {filteredEtudiants.map((etudiant) => (
              <label
                key={etudiant._id}
                onClick={() => handleEtudiantCheckboxChange(etudiant._id)}
                className={`flex items-center justify-between cursor-pointer p-2 rounded-lg ${
                  etudiantConserne.includes(etudiant._id) ? 'bg-indigo-100' : ''
                }`}
              >
                <span className="text-gray-600">
                  {etudiant.username} ({etudiant.email})
                </span>
                <input
                  type="checkbox"
                  checked={etudiantConserne.includes(etudiant._id)}
                  onChange={() => handleEtudiantCheckboxChange(etudiant._id)}
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
          <ul className="list-disc list-inside bg-gray-50 p-3 rounded-lg">
            {parentConserne.map((parentId) => {
              const parent = users.find((user) => user._id === parentId);
              return parent ? (
                <li key={parentId} className="text-gray-600">
                  {parent.username} ({parent.email})
                </li>
              ) : null;
            })}
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
	