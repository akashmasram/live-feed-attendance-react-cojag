import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CameraList = ({ onClose }) => {
    const [cameraList, setCameraList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCameraList = async () => {
        const token = localStorage.getItem('authToken');
        console.log(token);
        
            try {
                const response = await axios.get("https://live-feed-attendance-react-cojag.onrender.com/api/cameralist",{
                    headers: { Authorization : `Bearer ${token}`}
                });
                setCameraList(response.data);
            } catch (error) {
                console.error("Error fetching camera list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCameraList();
    }, []);

    // Function to start stream for a specific MAC address
    const startStream = async (macAddress) => {
        try {
            const response = await axios.post("https://live-feed-attendance-react-cojag.onrender.com/api/start-stream", { macAddress });
            if (response.status === 200) {
                alert(`Stream started for MAC address: ${macAddress}`);
            }
        } catch (error) {
            console.error("Error starting stream:", error);
            alert("Failed to start stream. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center">Camera List</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    <ul className="list-disc pl-5 px-2">
                        {cameraList.map((camera) => (
                            <li key={camera._id} className="text-gray-700 flex items-center py-1">
                                <span>{camera.name || camera.macAddress}</span> {/* Display name or MAC if name is unavailable */}
                                <button
                                    onClick={() => startStream(camera.macAddress)}
                                    className="bg-blue-500 text-white text-sm rounded ml-4 hover:bg-blue-700 px-2 py-1 w-28"
                                >
                                    Start Camera
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                <button onClick={onClose} className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md mt-[10px]">
                    Close
                </button>
            </div>
        </div>
    );
};

export default CameraList;
