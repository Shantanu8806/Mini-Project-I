import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';
// Replace 'YOUR_MAPBOX_TOKEN' with your actual Mapbox access token


const OwnerDashboard = ({logged,user,setUser,setLogged}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [registeredSpaces, setRegisteredSpaces] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  useEffect(() => {
    console.log(logged,user);
    if (!logged) {
      navigate('/login/owner');
    }
    if(user!=='Owner'){
      navigate('/login/owner');
    }
    const fetchMapboxToken = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/mapbox/mapbox-token');
        setMapboxToken(response.data.mapboxToken);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRegisteredSpaces = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error('User not authenticated.');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(`http://localhost:4000/api/v1/parking-space/getparking-space-owner/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRegisteredSpaces(response.data.parkingSpaces);
      } catch (error) {
        console.error('Error fetching registered parking spaces:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        }, (error) => {
          console.error('Error getting current location:', error);
        });
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    fetchCurrentLocation();
    fetchMapboxToken();
    fetchRegisteredSpaces();
  }, [logged,user,navigate]);

  useEffect(() => {
    if (!mapboxToken || !currentLocation) {
      return; // Skip initialization if token or location is not available
    }

    // Initialize Mapbox map
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [currentLocation?.longitude || 0, currentLocation?.latitude || 0], // starting position
      zoom: 12, // starting zoom
      accessToken: mapboxToken, // Use the token fetched from Axios
    });

    // Add marker for current location
    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([currentLocation?.longitude || 0, currentLocation?.latitude || 0])
      .addTo(map);

    // Add markers for registered parking spaces
    registeredSpaces.forEach((space) => {
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat([space.longitude, space.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${space.parkingNumber}</h3><p>${space.parkingAreaDescription}</p>`))
        .addTo(map);
    });

    // Cleanup map on component unmount
    return () => map.remove();
  }, [currentLocation, registeredSpaces, mapboxToken]);


  if (loading) {
    return (<div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >Loading...</span>
    </div>);
  }
   return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded shadow-md w-full max-w-screen-xl mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard</h1>
        <div className="mb-4">
          {/* Map component goes here */}
          <div id="map" style={{ height: '300px' }}></div>
        </div>

        <div className="flex flex-wrap justify-center">
          {/* Display registered parking spaces as cards */}
          {registeredSpaces.map((space) => (
             <div key={space.id} className="bg-white rounded-lg shadow-md m-2 p-4 w-96">
             {/* ... (card content) */}
              <img
                src={space.parkingSpaceImage}
                alt="Parking Space"
                className="mb-2 w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mb-2 leading-tight">{`Parking ${space.parkingNumber}`}</h3>
              <p className="text-sm mb-2">{space.parkingAreaDescription}</p>
              <p className="text-sm mb-2">{`Hourly Cost: ₹${space.hourlyCost}`}</p>
              <p className="text-sm mb-2">{`Daily Cost: ₹${space.dailyCost}`}</p>
              <Link
                to={`/spaceDetails/${space._id}`}
                className="mt-2 block text-blue-500 hover:underline text-sm font-semibold"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
      <Link
        to="/add-parkingspace"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8 focus:outline-none focus:shadow-outline"
      >
        Add a new Parking Space
      </Link>
    </div>
  );
};

export default OwnerDashboard;
