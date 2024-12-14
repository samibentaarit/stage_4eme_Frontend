import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';

const AnnanceForm = () => {
  const [sujet, setSujet] = useState('');
  const [information, setInformation] = useState('');
  const [userAudience, setUserAudience] = useState([]);
  const [roleAudience, setRoleAudience] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendEmail, setSendEmail] = useState(false);
  const [message, setMessage] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:8080/user/users');
        setUsers(usersResponse.data);
        const rolesResponse = await axios.get('http://localhost:8080/user/roles');
        setRoles(rolesResponse.data);
      } catch (error) {
        console.error('Error fetching users and roles:', error);
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleRoleChange = (roleId) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleId)
        ? prevSelectedRoles.filter((id) => id !== roleId)
        : [...prevSelectedRoles, roleId]
    );
  };

  const handleUserCheckboxChange = (userId) => {
    setUserAudience((prevSelected) =>
      prevSelected.includes(userId) ? prevSelected.filter((id) => id !== userId) : [...prevSelected, userId]
    );
  };

  const handleRoleCheckboxChange = (roleId) => {
    setRoleAudience((prevSelected) =>
      prevSelected.includes(roleId) ? prevSelected.filter((id) => id !== roleId) : [...prevSelected, roleId]
    );
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const redacteurId = localStorage.getItem('id');
    if (!redacteurId) {
      console.error('Redacteur ID not found in session storage');
      return;
    }
  
    const formData = new FormData();
    formData.append('etat', 'en cours' ); // Default to 'en cours' if not set by user
    formData.append('sujet', sujet);
    formData.append('information', information);
    formData.append('redacteur', redacteurId);
  
    // Append each userAudience and roleAudience item separately
    userAudience.forEach((userId) => {
      formData.append('userAudience[]', userId);
    });
    roleAudience.forEach((roleId) => {
      formData.append('roleAudience[]', roleId);
    });
  
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
  
    try {
      const url = sendEmail ? 'http://localhost:8080/annances/mail' : 'http://localhost:8080/annances';
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setMessage('Annonce created successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Error creating annonce.');
      console.error(error);
    }
  };

  // Filtered users based on search input
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(userFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(userFilter.toLowerCase())
  );

  // Filtered roles based on search input
  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(roleFilter.toLowerCase())
  );

  return (
<div className="max-w-6xl mx-auto bg-white  py-5 px-10 rounded-lg shadow-lg">


  <h2 className="text-3xl font-extrabold text-indigo-600 text-center mb-8">Create Annonce</h2>
  <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
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

    {/* Information Field */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Information:</label>
      <textarea
        value={information}
        onChange={(e) => setInformation(e.target.value)}
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Enter detailed information"
        rows="4"
      />
    </div>

    {/* User and Role Audience */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Audience */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">User Audience:</label>
        <input
          type="text"
          placeholder="Search users..."
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="max-h-40 overflow-y-auto border rounded-lg mt-2 p-3 bg-gray-50">
          {filteredUsers.map((user) => (
            <label
              key={user._id}
              onClick={() => handleUserCheckboxChange(user._id)}
              className={`flex items-center justify-between cursor-pointer p-2 rounded-lg ${
                userAudience.includes(user._id) ? 'bg-indigo-100' : ''
              }`}
            >
              <span className="text-gray-600">
                {user.username} ({user.email})
              </span>
              <input
                type="checkbox"
                checked={userAudience.includes(user._id)}
                onChange={() => handleUserCheckboxChange(user._id)}
                className="w-4 h-4 pointer-events-none"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Role Audience */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Role Audience:</label>
        <input
          type="text"
          placeholder="Search roles..."
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="max-h-40 overflow-y-auto border rounded-lg mt-2 p-3 bg-gray-50">
          {filteredRoles.map((role) => (
            <label
              key={role._id}
              onClick={() => handleRoleCheckboxChange(role._id)}
              className={`flex items-center justify-between cursor-pointer p-2 rounded-lg ${
                roleAudience.includes(role._id) ? 'bg-indigo-100' : ''
              }`}
            >
              <span className="text-gray-600">{role.name}</span>
              <input
                type="checkbox"
                checked={roleAudience.includes(role._id)}
                onChange={() => handleRoleCheckboxChange(role._id)}
                className="w-4 h-4 pointer-events-none"
              />
            </label>
          ))}
        </div>
      </div>
    </div>

    {/* Upload Image */}
    <div>
      <label className="block text-gray-700 font-medium mb-2">Upload Image:</label>
      <input
        type="file"
        name="image"
        onChange={handleFileChange}
        className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Send Email */}
    <div className="flex items-center">
      <input
        type="checkbox"
        checked={sendEmail}
        onChange={(e) => setSendEmail(e.target.checked)}
        className="w-4 h-4 mr-2"
      />
      <FaEnvelope className="text-indigo-500 mr-2" />
      <label className="text-gray-700 font-medium">Send Email</label>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300"
    >
      Create Annonce
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

export default AnnanceForm;
