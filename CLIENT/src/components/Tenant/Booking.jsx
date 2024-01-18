import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const [numberOfHours, setNumberOfHours] = useState(0); 
  const navigate = useNavigate();
  const { spaceId } = useParams();
  const [parkingSpace, setParkingSpace] = useState(null);
  const [selectedBookingType, setSelectedBookingType] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingCost, setBookingCost] = useState(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/mapbox/mapbox-token');
        setMapboxToken(response.data.mapboxToken);
  
        // Get the user's current location using the Geolocation API
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([longitude, latitude]);
  
            // Fetch and set parking space details
            try {
              const parkingSpaceResponse = await axios.get(`http://localhost:4000/api/v1/parking-space/spaceDetails/${spaceId}`);
              setParkingSpace(parkingSpaceResponse.data.parkingSpaceDetails);
  
              // Initialize the map with Mapbox access token
              mapboxgl.accessToken = response.data.mapboxToken;
  
              const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude], // Center on the user's location
                zoom: 12,
              });
  
              // Add a blue marker for the user's current location
              const userMarker = new mapboxgl.Marker({ color: 'blue' })
                .setLngLat([longitude, latitude])
                .addTo(map);
  
              // Add a red marker for the parking space location
              const parkingSpaceMarker = new mapboxgl.Marker({ color: 'red' })
                .setLngLat([parkingSpaceResponse.data.parkingSpaceDetails.longitude, parkingSpaceResponse.data.parkingSpaceDetails.latitude])
                .addTo(map);
  
              // Fetch the route between user location and parking space
              const directionsResponse = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${longitude},${latitude};${parkingSpaceResponse.data.parkingSpaceDetails.longitude},${parkingSpaceResponse.data.parkingSpaceDetails.latitude}`,
                {
                  params: {
                    access_token: response.data.mapboxToken,
                    overview: 'full',
                    steps: true,
                  },
                }
              );
  
              const route = directionsResponse.data.routes[0].geometry;
              
              // Add the route layer to the map
              map.on('load', () => {
                map.addSource('route', {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: route,
                  },
                });
  
                map.addLayer({
                  id: 'route',
                  type: 'line',
                  source: 'route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                  },
                  paint: {
                    'line-color': 'black',
                    'line-width': 4,
                  },
                });
              });
  
              // Update the route and markers as the user moves
              const updateRoute = async () => {
                const newPosition = [userMarker.getLngLat().lng, userMarker.getLngLat().lat];
                const directionsResponse = await axios.get(
                  `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${newPosition[0]},${newPosition[1]};${parkingSpaceMarker.getLngLat().lng},${parkingSpaceMarker.getLngLat().lat}`,
                  {
                    params: {
                      access_token: response.data.mapboxToken,
                      overview: 'full',
                      steps: true,
                      geometries: 'geojson', // Specify the geometries format
                    },
                  }
                );
              
                const newRoute = directionsResponse.data.routes[0].geometry;
              
                // Convert the route to a valid GeoJSON LineString
                const geojson = {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: newRoute.coordinates,
                  },
                };
              
                map.getSource('route').setData(geojson);
              };
            
              // Update the route when the user moves
              map.on('move', updateRoute);
            } catch (error) {
              console.error('Error fetching parking space details:', error);
            }
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      }
    };
  
    fetchMapboxToken();
  }, [spaceId, mapboxToken]);
  
  
  

  useEffect(() => {
    // Update cost based on the selected booking type and number of hours
    switch (selectedBookingType) {
      case 'hourly':
        setBookingCost(parkingSpace?.hourlyCost * numberOfHours);
        break;
      case 'daily':
        setBookingCost(parkingSpace?.dailyCost);
        break;
      case 'weekly':
        setBookingCost(parkingSpace?.weeklyCost);
        break;
      case 'monthly':
        setBookingCost(parkingSpace?.monthlyCost);
        break;
      default:
        setBookingCost(null);
    }
  }, [selectedBookingType, parkingSpace, numberOfHours]);

  const handleNumberOfHoursChange = (event) => {
    const hours = parseInt(event.target.value, 10);
    setNumberOfHours(isNaN(hours) ? 0 : hours); // Set to 0 if input is not a valid number
  };

  const handleBookingTypeChange = (event) => {
    setSelectedBookingType(event.target.value);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleProceedToPayment = () => {
    // Implement redirection to payment page or any other logic based on selectedBookingType, selectedTime, and bookingCost
    // You may use react-router-dom history for navigation or any other navigation method
    // Example: history.push('/payment');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Booking Details</h1>
      <div id="map" className="w-full h-80 mb-4" />
  
      {parkingSpace && (
        <div className="bg-white p-8 rounded-md shadow-md w-[80%] max-w-xl">
          <img
            src={parkingSpace.parkingSpaceImage}
            alt="Parking Space"
            className="mb-4 mx-auto object-cover rounded-md w-full h-[40%]"
          />
  
          <div className="text-center mb-4">
            <p className="text-lg font-bold">{parkingSpace.address}</p>
            <p>Hourly Cost: {parkingSpace.hourlyCost}</p>
            <p>Daily Cost: {parkingSpace.dailyCost}</p>
            <p>Weekly Cost: {parkingSpace.weeklyCost}</p>
            <p>Monthly Cost: {parkingSpace.monthlyCost}</p>
          </div>
  
          <div className="flex flex-col items-center mb-4">
            <label htmlFor="bookingType" className="mb-2 text-lg font-bold">
              Select Booking Type:
            </label>
            <select
              id="bookingType"
              onChange={handleBookingTypeChange}
              value={selectedBookingType}
              className="border p-2 rounded-md"
            >
              <option value="">Select Booking Type</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
  
          {selectedBookingType === 'hourly' && (
            <div className="mb-4">
              <label htmlFor="selectedTime" className="text-lg font-bold mb-2">
                Select Time:
              </label>
              <TimePicker
                id="selectedTime"
                onChange={handleTimeChange}
                value={selectedTime}
                format="h:mm a"
                disableClock={true}
                clearIcon={null}
              />
            </div>
          )}
  
          {selectedBookingType === 'hourly' && (
            <div className="mb-4">
              <label htmlFor="numberOfHours" className="text-lg font-bold mb-2">
                Number of Hours:
              </label>
              <input
                type="number"
                id="numberOfHours"
                min="0"
                value={numberOfHours}
                onChange={handleNumberOfHoursChange}
                className="border p-2 rounded-md"
              />
            </div>
          )}
  
          {selectedBookingType && (
            <div className="text-lg font-bold mb-2">
              Booking Cost: {bookingCost}
            </div>
          )}
  
          {selectedBookingType && (
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 text-white p-2 rounded-md"
                onClick={handleProceedToPayment}
                disabled={!selectedTime || !bookingCost}
              >
                Proceed to Payment
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={handleGoBack}
              >
                Go Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
  
};

export default Booking;
