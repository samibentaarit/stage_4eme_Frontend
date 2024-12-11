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
<div className="p-6 bg-gray-100 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-4">All Reclamations</h2>
  {reclamations.length > 0 ? (
    <table className="min-w-full bg-white border border-yellow-200 rounded-lg overflow-hidden">
      <thead className="bg-yellow-100">
        <tr>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Sujet</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Information</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Etudiant Conserne</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Created At</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Etat</th>
          <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
        </tr>
      </thead>
      <tbody>
        {reclamations.map((reclamation) => (
          <tr key={reclamation._id} className="border-b last:border-none">
            <td className="py-2 px-4 font-semibold text-sm text-gray-700">{reclamation.sujet}</td>
            <td className="py-2 px-4 font-semibold text-sm text-gray-700">{reclamation.information}</td>
            <td className="py-2 px-4 font-semibold text-sm text-gray-700">
              {reclamation.etudiantConserne.map((e) => e.username).join(', ')}
            </td>
            <td className="py-2 px-4 font-semibold text-sm text-gray-700">
              {new Date(reclamation.createdAt).toLocaleString()}
            </td>
            <td className="py-2 px-4 font-semibold text-sm text-gray-700">{reclamation.etat}</td>
            <td className="py-2 px-4 font-semibold">
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDelete(reclamation._id)}
                  className="px-3 py-4 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors text-center"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-gray-600">No reclamations found.</p>
  )}
</div>

  );
};
export default ReclamationList;
