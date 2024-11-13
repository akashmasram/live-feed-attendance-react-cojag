import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Set leaflet icon images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMap = () => {
  const [location, setLocation] = useState({ lat: 18.558451779645843, lng: 73.77725723862306 });
  const [zoom, setZoom] = useState(18);
  const [isMaximized, setIsMaximized] = useState(false);
  const mapContainerRef = useRef();

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
    };
    // Uncomment the following line if you want to get the user's current location
    // getLocation();
  }, []);

  useEffect(() => {
    const mapContainer = mapContainerRef.current;

    if (isMaximized) {
      if (mapContainer.requestFullscreen) {
        mapContainer.requestFullscreen();
      } else if (mapContainer.mozRequestFullScreen) {
        mapContainer.mozRequestFullScreen();
      } else if (mapContainer.webkitRequestFullscreen) {
        mapContainer.webkitRequestFullscreen();
      } else if (mapContainer.msRequestFullscreen) {
        mapContainer.msRequestFullscreen();
      }
    } else {
      if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
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
    }
  }, [isMaximized]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  return (
    <div
      ref={mapContainerRef}
      className={`responsive-map-container ${isMaximized ? 'fullscreen-map' : ''}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}  
      >
        <TileLayer  
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            Your Location: <br /> {location.lat}, {location.lng}
          </Popup>  
        </Marker>
      </MapContainer>

      <button
        onClick={toggleMaximize}
        style={{
          position: 'absolute',
          width: '80px',
          fontSize: '15px',
          bottom: '5px',
          right: '5px',
          padding: '5px 3px',
          zIndex: 1000,
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isMaximized ? 'Minimize' : 'Maximize'}
      </button>
    </div>
  );
};

export default LocationMap;
