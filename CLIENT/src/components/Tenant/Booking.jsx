import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import mapboxgl from 'mapbox-gl';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Booking = ({ logged, user, setUser, setLogged }) => {
  const [numberOfHours, setNumberOfHours] = useState(0);
  const navigate = useNavigate();
  const { spaceId } = useParams();
  const [parkingSpace, setParkingSpace] = useState(null);
  const [selectedBookingType, setSelectedBookingType] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookingCost, setBookingCost] = useState(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [tenantId, setTenantId] = useState(null);

  useEffect(() => {
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

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([longitude, latitude]);

            try {
              const parkingSpaceResponse = await axios.get(`http://localhost:4000/api/v1/parking-space/spaceDetails/${spaceId}`);
              setParkingSpace(parkingSpaceResponse.data.parkingSpaceDetails);

              mapboxgl.accessToken = response.data.mapboxToken;

              const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 12,
              });

              const userMarker = new mapboxgl.Marker({ color: 'blue' })
                .setLngLat([longitude, latitude])
                .addTo(map);

              const parkingSpaceMarker = new mapboxgl.Marker({ color: 'red' })
                .setLngLat([parkingSpaceResponse.data.parkingSpaceDetails.longitude, parkingSpaceResponse.data.parkingSpaceDetails.latitude])
                .addTo(map);

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

              const updateRoute = async () => {
                const newPosition = [userMarker.getLngLat().lng, userMarker.getLngLat().lat];
                const directionsResponse = await axios.get(
                  `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${newPosition[0]},${newPosition[1]};${parkingSpaceMarker.getLngLat().lng},${parkingSpaceMarker.getLngLat().lat}`,
                  {
                    params: {
                      access_token: response.data.mapboxToken,
                      overview: 'full',
                      steps: true,
                      geometries: 'geojson',
                    },
                  }
                );

                const newRoute = directionsResponse.data.routes[0].geometry;

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
  }, [spaceId, mapboxToken, logged, user, navigate]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('User not authenticated.');
      return;
    }
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    setTenantId(userId);

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
    setNumberOfHours(isNaN(hours) ? 0 : hours);
  };

  const handleBookingTypeChange = (event) => {
    const selectedType = event.target.value;
    setSelectedBookingType(selectedType);

    switch (selectedType) {
      case 'hourly':
        const hours = parseInt(event.target.value, 10);
        setNumberOfHours(isNaN(hours) ? 0 : hours);
        break;
      case 'daily':
        setNumberOfHours(24);
        break;
      case 'weekly':
        setNumberOfHours(24 * 7);
        break;
      case 'monthly':
        setNumberOfHours(24 * 30);
        break;
      default:
        setNumberOfHours(0);
    }
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const initiateBookingAfterPayment = async () => {
    try {
      navigate('/tenant-dashboard');
      toast.success("Payment Successful");
      toast.success("Parking Space Booked Successfully");
    } catch (error) {
      console.error('Error during payment verification and booking initiation:', error);
      toast.error("Error during payment verification and booking initiation");
    }
  };

  const checkouthandler = async (amount, selectedTime) => {
    try {
      if (window.razorpay) {
        window.razorpay.close();
      }
  
      const { data: { key } } = await axios.get("http://localhost:4000/api/v1/booking/getRazorpayKey");
      const bookingDataString = JSON.stringify({
        tenantId,
        parkingSpaceId: spaceId,
        typeofBooking: selectedBookingType,
        totalTimeInHours: numberOfHours,
      });
      const encodedBookingData = encodeURIComponent(bookingDataString);
  
      const { data: { order } } = await axios.post(`http://localhost:4000/api/v1/booking/createOrder`, { amount, selectedTime });
  
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "PARKIT",
        description: "Razorpay tutorial",
        image: "https://res.cloudinary.com/dnmlmaz3l/image/upload/v1704824872/Parking/ef9oahebfnru5ca35teh.jpg",
        order_id: order.id,
        handler: async function (response) {
          const body = {
            ...response,
          };
  
          try {
            const verificationUrl = `http://localhost:4000/api/v1/booking/paymentVerification?bookingData=${encodedBookingData}`;
            const validateRes = await axios.post(verificationUrl, body);
            console.log(validateRes.data); // Log the server response
  
            // Initiate booking after payment
            await initiateBookingAfterPayment();
          } catch (error) {
            console.error('Error during payment verification and booking initiation:', error);
            toast.error("Error during payment verification and booking initiation");
          }
        },
        prefill: {
          name: "Shantanu kantak",
          email: "kantakshantanu20@gmail.com",
          contact: "9372271678"
        },
        notes: {
          address: "Razorpay official",
          time: selectedTime
        },
        theme: {
          "color": "#3399cc"
        }
      };
  
      const razor = new window.Razorpay(options);
  
      // Attach a callback function to handle payment success
      razor.on('payment.success', async function (successResponse) {
        try {
          // Initiate booking after payment
          await initiateBookingAfterPayment();
        } catch (error) {
          console.error('Error during booking initiation after payment:', error);
          toast.error("Error during booking initiation after payment");
        }
      });
  
      razor.open();
      window.razorpay = razor;
    } catch (error) {
      console.error('Error during Razorpay checkout:', error);
      toast.error("Error during Razorpay checkout");
    }
  };
  
  

  const handleProceedToPayment = async () => {
    if (!selectedTime || !bookingCost || !parkingSpace) {
      return;
    }

    const totalAmountInPaise = bookingCost;

    try {
      await checkouthandler(totalAmountInPaise, selectedTime);
    } catch (error) {
      console.error('Error during Razorpay checkout:', error);
      toast.error("Error during Razorpay checkout");
    }
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
