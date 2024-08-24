// src/components/ReclamationList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/reclamations');
        setReclamations(response.data);
      } catch (error) {
        console.error('Error fetching reclamations:', error);
      }
    };

    fetchReclamations();
  }, []);

    // Handle the delete functionality
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/reclamations/${id}`);
      // Update the state to remove the deleted reclamation from the list
      setReclamations(reclamations.filter(reclamation => reclamation._id !== id));
    } catch (error) {
      console.error('Error deleting reclamation:', error);
      // Optionally, you can display an error message to the user
    }
  };
  
  return (
    <div>
      <h2>All Reclamations</h2>
      {reclamations.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Etat</th>
              <th>Sujet</th>
              <th>Information</th>
              <th>Etudiant Conserne</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reclamations.map((reclamation) => (
              <tr key={reclamation._id}>
                <td>{reclamation.etat}</td>
                <td>{reclamation.sujet}</td>
                <td>{reclamation.information}</td>
                <td>{reclamation.etudiantConserne.map(e => e.username).join(', ')}</td>
                <td>{new Date(reclamation.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(reclamation._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reclamations found.</p>
      )}
    </div>
  );
};

export default ReclamationList;
