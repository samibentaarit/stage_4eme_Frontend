import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Annonce</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <div className="flex space-x-4">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Sujet:</label>
            <input
              type="text"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Information:</label>
          <textarea
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">User Audience:</label>
            <input
              type="text"
              placeholder="Search users..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="max-h-32 overflow-y-auto border p-2 rounded-lg">
              {filteredUsers.map((user) => (
                <div key={user._id} className="flex items-center mb-2">
                  <label className="text-gray-600">{user.username}({user.email})</label><input
                    type="checkbox"
                    checked={userAudience.includes(user._id)}
                    onChange={() => handleUserCheckboxChange(user._id)}
                    className="mr-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">Role Audience:</label>
            <input
              type="text"
              placeholder="Search roles..."
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="max-h-32 overflow-y-auto border p-2 rounded-lg">
              {filteredRoles.map((role) => (
                <div key={role._id} className="flex items-center mb-2">
                  
                  <label className="text-gray-600">{role.name}</label>
                  <input
                    type="checkbox"
                    checked={roleAudience.includes(role._id)}
                    onChange={() => handleRoleCheckboxChange(role._id)}
                    className="mr-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Upload Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 border rounded-lg cursor-pointer focus:outline-none"
          />
        </div>
        <div className="flex items-center">
          
          <label className="text-gray-700">Send Email</label>
          <input
            type="checkbox"
            checked={sendEmail}
            onChange={(e) => setSendEmail(e.target.checked)}
            className="mr-2"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Create Annonce
        </button>
      </form>
      {message && <div className="mt-4 p-4 text-center text-white bg-green-500 rounded-lg">{message}</div>}
    </div>
  );
};

export default AnnanceForm;
