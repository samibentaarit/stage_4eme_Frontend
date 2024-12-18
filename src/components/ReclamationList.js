import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust this value to set how many items per page are displayed

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/reclamations');
        setReclamations(response.data); // Assuming response.data contains the list of reclamations
      } catch (error) {
        console.error('Error fetching reclamations:', error);
      }
    };

    fetchReclamations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/reclamations/${id}`);
      setReclamations(reclamations.filter((reclamation) => reclamation._id !== id));
    } catch (error) {
      console.error('Error deleting reclamation:', error);
    }
  };

  // Calculate the current items to display based on the current page and items per page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reclamations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reclamations.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-extrabold text-indigo-600 mb-4">All Reclamations</h2>
      {reclamations.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-indigo-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-100">
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
              {currentItems.map((reclamation) => (
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
                        className="px-3 py-2 text-sm text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors text-center"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No reclamations found.</p>
      )}
    </div>
  );
};

export default ReclamationList;
