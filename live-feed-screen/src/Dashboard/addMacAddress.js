import React, { useState } from 'react';
import axios from 'axios';

const MacAddressInput = ({ isOpen, onClose, onCameraAdded }) => {
    const [macAddress, setMacAddress] = useState('');
    const [name, setName] = useState(''); // New state for name
    const [message, setMessage] = useState('');

    const handleMacChange = (e) => {
        setMacAddress(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        setMessage(''); 
        try {
            const response = await axios.post('/api/add-macadd', { macAddress, name }, {
                headers: {Authorization: `Bearer ${token}`}
            }); 
            setMessage(response.data.message);
            setMacAddress(''); // Clear input after submission
            setName(''); // Clear name field
            onCameraAdded(); // Notify the parent to refresh the camera list
        } catch (error) {
            setMessage(error.response ? error.response.data.error : 'An error occurred');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-6 text-center">Add Camera</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter Camera Name"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <input
                        type="text"
                        value={macAddress}
                        onChange={handleMacChange}
                        placeholder="Enter MAC Address"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex justify-between space-x-4">
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Submit
                        </button>
                        <button type="button" onClick={onClose} className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
                            Close
                        </button>
                    </div>
                </form>
                {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
            </div>
        </div>
    );
};

export default MacAddressInput;