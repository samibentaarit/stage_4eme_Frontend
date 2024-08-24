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
    <div>
      <h2>All Annances</h2>
      {annances.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Etat</th>
              <th>Sujet</th>
              <th>Information</th>
              <th>Redacteur</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {annances.map((annance) => (
              <tr key={annance._id}>
                <td>{annance.etat}</td>
                <td>{annance.sujet}</td>
                <td>{annance.information}</td>
                <td>{annance.redacteur?.username}</td>
                <td>{new Date(annance.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(annance._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No annances found.</p>
      )}
    </div>
  );
};

export default AnnanceList;
