import React, { useState } from 'react';
import LiveStream from './LiveStream';
import FaceTable from './FaceTable';
import MacAddressInput from './addMacAddress'; // Modal for Add Camera
import AddUser from './addUser'; // Modal for Add User
import CameraList from './cameraList'; // Import CameraList

const Dashboard = () => {
    const username = localStorage.getItem('username'); 
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCameraListVisible, setIsCameraListVisible] = useState(false);

    // Function to handle camera addition
    const handleCameraAdded = () => {
        console.log('Camera added');
    };

    return (
        <div className="flex flex-col w-screen h-screen overflow-hidden">
            {/* Main Content */}
            <main className="flex-grow p-5 bg-gray-100 w-full box-border">
                <header className="flex justify-between items-center w-full mb-8 flex-wrap">
                    <h1 className="text-2xl font-bold">Dashboard Overview</h1>
                    <div className="stats flex justify-between">
                        <button
                            type="button" 
                            className="stat-item bg-blue-100 rounded-b-lg p-4 text-center flex-1 mx-2 shadow-md transform transition-transform hover:scale-105 hover:bg-blue-200 min-w-[150px] whitespace-nowrap"
                            onClick={() => setIsCameraModalOpen(true)}
                        >
                            <span className="stat-label text-lg font-semibold text-blue-600">Add Camera</span>
                        </button>

                        <button
                            type="button" 
                            className="stat-item bg-blue-100 rounded-b-lg p-4 text-center flex-1 mx-2 shadow-md transform transition-transform hover:scale-105 hover:bg-blue-200 min-w-[150px] whitespace-nowrap"
                            onClick={() => setIsUserModalOpen(true)}
                        >
                            <span className="stat-label text-lg font-semibold text-blue-600">Add Users</span>
                        </button>

                        <button
                            type="button" 
                            className="stat-item bg-blue-100 rounded-b-lg p-4 text-center flex-1 mx-2 shadow-md transform transition-transform hover:scale-105 hover:bg-blue-200 min-w-[150px] whitespace-nowrap"
                            onClick={() => setIsCameraListVisible(true)}
                        >
                            <span className="stat-label text-lg font-semibold text-blue-600">Camera List</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1.3fr,1fr] gap-8 w-full box-border flex-grow">
                    <div className="bg-white rounded-lg shadow-md p-5 overflow-hidden">
                        <h2 className="text-xl font-bold mb-4">Face Recognition</h2>
                        <div className="max-h-[250px] overflow-y-auto">
                            <FaceTable />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Live Stream</h2>
                        <div className="flex-grow overflow-hidden">
                            <div className="h-full max-h-[calc(100vh-200px)] md:max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-100px)]">
                                <LiveStream />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render the camera list conditionally */}
                {isCameraListVisible && (
                    <CameraList onClose={() => setIsCameraListVisible(false)} />
                )}
            </main>

            <MacAddressInput
                isOpen={isCameraModalOpen}
                onClose={() => setIsCameraModalOpen(false)}
                onCameraAdded={handleCameraAdded}
            />

            <AddUser
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
