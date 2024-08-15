// src/components/ReclamationForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReclamationForm = () => {
  const [sujet, setSujet] = useState('');
  const [information, setInformation] = useState('');
  const [etat, setEtat] = useState('');
  const [redacteur, setRedacteur] = useState('');
  const [etudiantConserne, setEtudiantConserne] = useState([]);
  const [parentConserne, setParentConserne] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [includeParents, setIncludeParents] = useState(true);

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

  const handleEtudiantConserneChange = (selectedOptions) => {
    const selectedStudents = [...selectedOptions].map(option => option.value);
    setEtudiantConserne(selectedStudents);

    // Automatically fill parentConserne based on the selected students
    const selectedParents = [];
    selectedStudents.forEach(studentId => {
      const student = users.find(user => user._id === studentId);
      if (student?.parents) {
        selectedParents.push(...student.parents);
      }
    });
    setParentConserne([...new Set(selectedParents)]); // Remove duplicate parent IDs
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const redacteurId = sessionStorage.getItem('id');

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

  return (
    <div>
      <h2>Create Reclamation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sujet:</label>
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Information:</label>
          <textarea
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Etat:</label>
          <input
            type="text"
            value={etat}
            onChange={(e) => setEtat(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Etudiant Conserne:</label>
          <select
            multiple
            value={etudiantConserne}
            onChange={(e) => handleEtudiantConserneChange(e.target.selectedOptions)}
          >
            {users.map((user) => (
              user.isStudent && (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              )
            ))}
          </select>
        </div>
        <div>
          <label>Notifier les Parents? (Auto-filled):</label>
          <input
            type="checkbox"
            checked={includeParents}
            onChange={(e) => setIncludeParents(e.target.checked)}
          />
          <ul>
            {parentConserne.map((parentId) => {
              const parent = users.find(user => user._id === parentId);
              return parent ? <li key={parentId}>{parent.username} ({parent.email})</li> : null;
            })}
          </ul>
        </div>
        <button type="submit">Create Reclamation</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};


export default ReclamationForm;
