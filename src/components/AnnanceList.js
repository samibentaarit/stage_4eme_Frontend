// src/components/AnnanceList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnanceList = () => {
  const [annances, setAnnances] = useState([]);

  useEffect(() => {
    const fetchAnnances = async () => {
      try {
        const response = await axios.get('http://localhost:8080/annances');
        setAnnances(response.data);
      } catch (error) {
        console.error('Error fetching annances:', error);
      }
    };

    fetchAnnances();
  }, []);

  const handleDelete = async (id) => {
    try {
      // Make the delete request
      await axios.delete(`http://localhost:8080/annances/${id}`, {
        // No need to include the token in headers
        withCredentials: true, // Ensure cookies are sent with the request
      });
  
      // Update the state to remove the deleted annance from the list
      setAnnances(annances.filter(annance => annance._id !== id));
    } catch (error) {
      console.error('Error deleting annance:', error);
      // Optionally, you can display an error message to the user
    }
  };
  


  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Annances</h2>
      {annances.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Etat</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Sujet</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Information</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Redacteur</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Created At</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {annances.map((annance) => (
              <tr key={annance._id} className="border-b last:border-none">
                <td className="py-2 px-4 text-sm text-gray-700">{annance.etat}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{annance.sujet}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{annance.information}</td>
                <td className="py-2 px-4 text-sm text-gray-700">{annance.redacteur?.username}</td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  {new Date(annance.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(annance._id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No annances found.</p>
      )}
    </div>
  );
};

export default AnnanceList;
