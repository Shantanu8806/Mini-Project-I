import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { Link } from 'react-router-dom';
const TenantDashboard = () => {
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [parkingSpaces, setParkingSpaces] = useState([]);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/mapbox/mapbox-token');
        setMapboxToken(response.data.mapboxToken);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };

    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserCoordinates({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const fetchParkingSpaces = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/parking-space/parking-spaceNotOccupied');
        
        // Check if the response has the expected structure
        if (response.data && Array.isArray(response.data.parkingSpaces)) {
          setParkingSpaces(response.data.parkingSpaces);
        } else {
          console.error('Invalid response format. Expected an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching parking spaces:', error);
      }
    };

    const fetchLocationAndParkingSpaces = async () => {
      try {
        await fetchMapboxToken();
        fetchUserLocation();
        await fetchParkingSpaces();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchLocationAndParkingSpaces();
  }, []);

  useEffect(() => {
    if (!mapboxToken || !userCoordinates) {
      return;
    }

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [userCoordinates.longitude, userCoordinates.latitude],
      zoom: 12,
      accessToken: mapboxToken,
    });

    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([userCoordinates.longitude, userCoordinates.latitude])
      .addTo(map);

    parkingSpaces.forEach((space) => {
      const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([space.longitude, space.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${space.name}</h3><p>${space.description}</p>`))
        .addTo(map);

      marker.getElement().addEventListener('click', () => handleParkingSpaceClick(space));
    });

    return () => map.remove();
  }, [userCoordinates, parkingSpaces, mapboxToken]);

  const handleParkingSpaceClick = async (parkingSpace) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/parking-space/spaceDetails/${parkingSpace._id}`);
      console.log(parkingSpace);
      setSelectedParkingSpace(parkingSpace);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching parking space details:', error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">PARKIT: Find Parking Spaces near you</h1>
      <div id="map" className="w-11/12 h-80 mb-4 rounded rounded-md" />

      {showModal && selectedParkingSpace && (
        <div className="modal bg-white p-4 rounded-md shadow-md w-96">
          <img
            src={selectedParkingSpace.parkingSpaceImage}
            alt="Parking Space"
            className="mb-2 w-full h-48 object-cover rounded-md"
          />
          <p>{selectedParkingSpace.address}</p>
          <p>Hourly Cost: {selectedParkingSpace.hourlyCost}</p>
          <p>Daily Cost: {selectedParkingSpace.dailyCost}</p>
          <p>Weekly Cost: {selectedParkingSpace.weeklyCost}</p>
          <p>Monthly Cost: {selectedParkingSpace.monthlyCost}</p>
          <div className="flex justify-end mt-2">
            <button className="bg-blue-500 text-white p-2 mr-2" onClick={() => setShowModal(false)}>
              Close
            </button>
            <Link to={`/Booking/${selectedParkingSpace._id}`}>
            <button className="bg-green-500 text-white p-2">
              Book Now
            </button>
            </Link>
          </div>
        </div>
      )}

      <button className="bg-green-500 text-white p-2 mt-4">Search Location</button>
    </div>
  );
};

export default TenantDashboard;
