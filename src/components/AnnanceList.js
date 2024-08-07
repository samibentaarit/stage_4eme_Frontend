import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AnnanceList = () => {
  const [annances, setAnnances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnances = async () => {
      try {
        const response = await axios.get('http://localhost:8080/annances');
        setAnnances(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnances();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Annances</h2>
      {annances.length === 0 ? (
        <p>No annances found.</p>
      ) : (
        <ul>
          {annances.map((annance) => (
            <li key={annance._id}>
              <h3>{annance.sujet}</h3>
              <p>{annance.information}</p>
              <p>Status: {annance.etat}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AnnanceList;
