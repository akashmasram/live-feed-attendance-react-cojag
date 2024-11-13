import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FaceTable = () => {
  const [faces, setFaces] = useState([]);  // Store only detected faces

  useEffect(() => {
    // Set up polling to fetch detected faces every 5 seconds
    const intervalId = setInterval(() => {
      fetchDetectedFaces();
    }, 5000); // Fetch data every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchDetectedFaces = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('https://live-feed-attendance-react-cojag.onrender.com/api/faces', {
        headers: {Authorization: `Bearer ${token}`}
      }); // Fetch detected faces
      const validFaces = response.data.filter(face => face.name !== 'Unknown Person'); // Filter out 'Unknown' faces
      setFaces(validFaces);  // Update state with valid faces
    } catch (error) {
      console.error('Error fetching face data:', error);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <table style={{
        width: "90%",
        marginTop: '30px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderCollapse: "collapse",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#222",
        color: "#fff",
        maxWidth: '1200px'
      }}>
        <thead>
          <tr>
            <th colSpan="4" style={{
              border: "1px solid #fff",
              padding: "12px",
              textAlign: "center",
              backgroundColor: "#1b263b",
              color: "white"
            }}>
              Attendance Table
            </th>
          </tr>
          <tr>
            <th style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>Name</th>
            <th style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>Date</th>
            <th style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>Time</th>
            <th style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {faces.length === 0 ? (  // If no valid faces are detected, show a message
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No faces detected</td>
            </tr>
          ) : (
            faces.map((face, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>{face.name}</td>
                <td style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>{face.date}</td>
                <td style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>{face.time}</td>
                <td style={{ border: "1px solid #fff", padding: "10px", textAlign: "center" }}>{face.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FaceTable;
