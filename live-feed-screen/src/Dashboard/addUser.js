import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUser = ({ isOpen, onClose }) => {
  const loggedInUsername = localStorage.getItem('username');
  console.log(loggedInUsername);

  const [username, setUsername] = useState('');
  const [uploadImages, setUploadImages] = useState([]); // For multiple image uploads
  const [users, setUsers] = useState([]);

  const handleFileChange = (e) => {
    setUploadImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');

    const formData = new FormData();
    formData.append('username', username);
    Array.from(uploadImages).forEach(image => {
      formData.append('uploadimages', image);
    });

    try {
      let response = await axios.post('https://live-feed-attendance-react-cojag.onrender.com/api/addUser', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(response.data);
      alert('User added successfully');
      fetchUsers(); // Refresh users after adding a new user
    } catch (error) {
      console.error(error);
      alert('Error adding user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.get('https://live-feed-attendance-react-cojag.onrender.com/api/allusers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data.filter(user => user.username === loggedInUsername); // Filter users by logged-in user
      setUsers(userData);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="border p-2 w-full"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="uploadimages">Upload Images</label>
            <input
              type="file"
              id="uploadimages"
              accept="image/*"
              onChange={handleFileChange}
              multiple
              className="border p-2 w-full"
              required
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md">
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>

      
      </div>
    </div>
  );
};


export default AddUser;
