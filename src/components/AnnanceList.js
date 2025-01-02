import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import apiService from './apiService'; // Import the configured Axios instance

const AnnanceList = () => {
  const [annances, setAnnances] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items per page

  useEffect(() => {
    const fetchAnnances = async () => {
      try {
        const response = await apiService.get('/annances');
        setAnnances(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnances();
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiService.delete(`/annances/${id}`);
      setAnnances(annances.filter((annance) => annance._id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = annances.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(annances.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-extrabold text-indigo-600 mb-4">Announcements</h1>
        <Link to="/create-Announcement">
          <button className="inline-block px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300">
            Create New Announcement
          </button>
        </Link>
      </div>
      {annances.length > 0 ? (
        <>
          <table className="min-w-full bg-white border border-indigo-200 rounded-lg overflow-hidden">
            <thead className="bg-indigo-100">
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
              {currentItems.map((annance) => (
                <tr key={annance._id} className="border-b last:border-none">
                  <td className="py-2 px-4 font-semibold text-sm text-gray-700">{annance.etat}</td>
                  <td className="py-2 px-4 font-semibold text-sm text-gray-700">{annance.sujet}</td>
                  <td className="py-2 px-4 font-semibold text-sm text-gray-700">{annance.information}</td>
                  <td className="py-2 px-4 font-semibold text-sm text-gray-700">{annance.redacteur?.username}</td>
                  <td className="py-2 px-4 font-semibold text-sm text-gray-700">
                    {new Date(annance.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 font-semibold">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleDelete(annance._id)}
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
        <p className="text-gray-600">No announcements found.</p>
      )}
    </div>
  );
};

export default AnnanceList;
