import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import * as faceapi from 'face-api.js';
import axios from 'axios';

const LiveStream = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    let faceMatcher = null;

    useEffect(() => {
        const video = videoRef.current;

        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        };

        const loadKnownFaces = async () => {
             const token = localStorage.getItem('authToken')

            // Fetch users from your backend
            const response = await axios.get('https://live-feed-attendance-react-cojag.onrender.com/api/allusers',{
              headers: {Authorization: `Bearer ${token}`}
            }); // Adjust the URL if needed
            console.log(response.data); // Inspect the response
            
            const products = response.data; // Assuming your API returns an array of users

            // Create labeled face descriptors
            const labeledFaceDescriptors = await Promise.all(
                products.map(async (product) => {
                    // Ensure the product has images
                    if (!product.images || product.images.length === 0) {
                        return null; // Skip if no images
                    }

                    // Create descriptors for each image of the user
                    const descriptors = await Promise.all(
                        product.images.map(async (imgData) => {
                            const img = await faceapi.fetchImage(`data:${imgData.contentType};base64,${imgData.data}`);
                            const detection = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                                .withFaceLandmarks()
                                .withFaceDescriptor();

                            return detection ? new Float32Array(detection.descriptor) : null;
                        })
                    );

                    // Filter out any undefined descriptors
                    const validDescriptors = descriptors.filter(Boolean);
                    return validDescriptors.length > 0
                        ? new faceapi.LabeledFaceDescriptors(product.username, validDescriptors)
                        : null; // Return null if no valid descriptors
                })
            );

            // Filter out any null results (in case there were no detections)
            faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors.filter(Boolean), 0.5);
        };

        const startFaceRecognition = () => {
            const canvas = canvasRef.current;
        
            // Update the canvas size whenever the video size changes
            const updateCanvasSize = () => {
                const displaySize = { width: video.videoWidth, height: video.videoHeight };
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                faceapi.matchDimensions(canvas, displaySize);
            };
        
            video.addEventListener('loadeddata', updateCanvasSize);
            window.addEventListener('resize', updateCanvasSize);
        
            const detectAndRecognizeFaces = async () => {
              const token = localStorage.getItem('authToken')
                // Check if video has loaded correctly
                if (video.videoWidth === 0 || video.videoHeight === 0) return;
        
                // Perform face detection
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();
        
                // Ensure the canvas size matches the video size
                const displaySize = { width: video.videoWidth, height: video.videoHeight };
                faceapi.matchDimensions(canvas, displaySize);
        
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
                // Clear the canvas and redraw new detections
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
        
                if (faceMatcher && resizedDetections.length > 0) {
                    const results = resizedDetections.map((d) => faceMatcher.findBestMatch(d.descriptor));
        
                    results.forEach(async (result, i) => {
                        const box = resizedDetections[i].detection.box;
                        const name = result.label === 'unknown' ? 'Unknown Person' : result.label;
        
                        const drawBox = new faceapi.draw.DrawBox(box, { label: name });
                        drawBox.draw(canvas);

                        // Send the detection data to the backend if not "unknown"
                        await axios.post('https://live-feed-attendance-react-cojag.onrender.com/api/face/logFaceDetection', { name },{
                          headers: {Authorization: `bearer ${token}`}
                        });
                    });
                }
            };
        
            // Continuously run detection every 100ms
            setInterval(detectAndRecognizeFaces, 100);
        };

        const initializeHls = () => {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource('/proxy/stream.m3u8');
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, async () => {
                    video.play();
                    video.playbackRate = 1.15;
                    await loadModels();
                    await loadKnownFaces();
                    startFaceRecognition();
                    video.controls = true;
                });
            }
        };

        initializeHls();
    }, []);

    const handleFullScreen = () => {
        const videoContainer = videoRef.current.parentNode;
        if (!isFullScreen) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.mozRequestFullScreen) {
                videoContainer.mozRequestFullScreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        setIsFullScreen(!isFullScreen);
    };

    return (
      <div className="location-container" style={{ width: '100%', height: '100%' }}>
        {/* Livestream wrapper */}
        <div style={{ 
          position: 'relative', 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center' 
        }}>
          {/* Video Element */}
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            controls 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',  // Ensures video covers the entire area of the container
              zIndex: 1 
            }} 
          />
    
          {/* Canvas for Overlay */}
          <canvas 
            ref={canvasRef} 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',  // Ensures the canvas covers the container
              zIndex: 1
            }} 
          />
    
          {/* Fullscreen Toggle Button */}
          <button
            onClick={handleFullScreen}
            style={{
                position: 'absolute',
                width: '80px',
                fontSize : '15px',
                bottom: '15px',
                right: '10px',
                padding: '5px 3px',
                zIndex: 1000, 
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
          >
            {isFullScreen ? 'Minimize' : 'Maximize'}
          </button>
    
          {/* Media Queries for Button Adjustments */}
          <style>
            {`
              @media (max-width: 768px) {
                button {
                  width: 70px;
                  font-size: 12px;
                  padding: 8px;
                  bottom: 10px;
                  right: 10px;
                }
              }
    
              @media (max-width: 480px) {
                button {
                  width: 60px;
                  font-size: 10px;
                  padding: 6px;
                  bottom: 8px;
                  right: 8px;
                }
              }
            `}
          </style>
        </div>
      </div>
    );
};

export default LiveStream;
