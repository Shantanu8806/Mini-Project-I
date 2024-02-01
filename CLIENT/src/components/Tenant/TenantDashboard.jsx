import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const TenantDashboard = ({ logged, user, setUser, setLogged }) => {
  const navigate = useNavigate();
  const [mapboxToken, setMapboxToken] = useState('');
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [parkingSpaces, setParkingSpaces] = useState([]);
  const [activeBooking, setActiveBooking] = useState([]);
  const [tenantId, setTenantId] = useState('');
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('User not authenticated.');
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    setTenantId(userId);
    if (!logged) {
      navigate('/login/tenant');
    }
    if (user !== 'Tenant') {
      navigate('/login/tenant');
    }
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
    const fetchActiveBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/booking/getActiveBookingsByTenantId?tenantId=659d3d32805742c80fe5a60e`);
        setActiveBooking(response.data);
      } catch (error) {
        console.error('Error fetching active bookings:', error);
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
    fetchActiveBookings();
    fetchLocationAndParkingSpaces();
  }, [logged, user, tenantId, navigate]);

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
      console.log(response.data.parkingSpaceDetails);
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
            <button className="bg-blue-500 text-white p-2 mr-2 rounded-lg" onClick={() => setShowModal(false)}>
              Close
            </button>
            <Link to={`/Booking/${selectedParkingSpace._id}`}>
              <button className="bg-green-500 text-white p-2 rounded-lg">
                Book Now
              </button>
            </Link>
          </div>
        </div>
      )}

      <button className="bg-green-500 text-white p-2 mt-4 rounded-lg">Search Location</button>
      {/* Active Bookings Section */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Active Bookings</h2>
        {activeBooking.map((booking) => (
          <div key={booking._id} className="bg-white rounded-md shadow-md p-4 mb-4">
            <img
              src={booking.parkingSpace.parkingSpaceImage}
              alt="Parking Space"
              className="w-18 h-18 rounded-md mt-2"
            />

            <h3 className="text-xl font-bold mb-2">Booking Information</h3>
            <p>{`Parking Number: ${booking.parkingSpace.parkingNumber}`}</p>
            <p>{`Area Description: ${booking.parkingSpace.parkingAreaDescription}`}</p>
            <p>{`Amount Paid: ₹${booking.amountPaid}`}</p>
            <p>{`Addres: ${booking.parkingSpace.address}`}</p>
            {/* Add more details as needed */}
          </div>
        ))}
      </div>

      {/* Button to navigate to Previous Bookings component */}
      <Link to="/previous-bookings">
        <button className="bg-blue-500 text-white p-2 mt-4 rounded-lg">Previous Bookings</button>
      </Link>
    </div>
  );
};

export default TenantDashboard;
