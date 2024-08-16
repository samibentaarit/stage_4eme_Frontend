import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnnanceForm = () => {
  const [etat, setEtat] = useState('');
  const [sujet, setSujet] = useState('');
  const [information, setInformation] = useState('');
  const [userAudience, setUserAudience] = useState([]);
  const [roleAudience, setRoleAudience] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sendEmail, setSendEmail] = useState(false); // State for the send email checkbox
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch users and roles when the component mounts
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
    setSelectedRoles((prevSelectedRoles) => {
      if (prevSelectedRoles.includes(roleId)) {
        return prevSelectedRoles.filter((id) => id !== roleId);
      } else {
        return [...prevSelectedRoles, roleId];
      }
    });
  };
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  // Filter users who have at least one of the selected roles or return all users if no roles are selected
  const filteredUsers = selectedRoles.length > 0 
    ? users.filter((user) =>
        selectedRoles.some((roleId) => user.roles.some((role) => role._id === roleId))
      )
    : users;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Retrieve redacteur ID from session storage
    const redacteurId = localStorage.getItem('id');
    if (!redacteurId) {
      console.error('Redacteur ID not found in session storage');
      return;
    }

    // Create FormData object to handle file and form data
    const formData = new FormData();
    formData.append('etat', etat);
    formData.append('sujet', sujet);
    formData.append('information', information);
    if (redacteurId) {
      formData.append('redacteur', redacteurId);
    }
    if (userAudience.length > 0) {
      formData.append('userAudience', userAudience);
    }
    if (roleAudience.length > 0) {
      formData.append('roleAudience', roleAudience);
    }

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      // Send to the appropriate URL based on the sendEmail checkbox state
      const url = sendEmail ? 'http://localhost:8080/annances/mail' : 'http://localhost:8080/annances';
      
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage('Annance created successfully!');
      console.log(response.data);
    } catch (error) {
      setMessage('Error creating annance.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create Annance</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <label>Filter users by Role:</label>
          {roles.map((role) => (
            <div key={role._id}>
              <input
                type="checkbox"
                id={role._id}
                checked={selectedRoles.includes(role._id)}
                onChange={() => handleRoleChange(role._id)}
              />
              <label htmlFor={role._id}>{role.name}</label>
            </div>
          ))}
        </div>
        <div>
          <label>User Audience:</label>
          <select
            multiple
            value={userAudience}
            onChange={(e) =>
              setUserAudience([...e.target.selectedOptions].map((option) => option.value))
            }
          >
            {filteredUsers.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Role Audience:</label>
          <select
            multiple
            value={roleAudience}
            onChange={(e) =>
              setRoleAudience([...e.target.selectedOptions].map((option) => option.value))
            }
          >
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Upload Image:</label>
          <input type="file" name="image" onChange={handleFileChange} />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}/>
            Send Email
          </label>
        </div>
        <button type="submit">Create Annance</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AnnanceForm;
