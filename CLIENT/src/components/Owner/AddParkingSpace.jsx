import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';

// Replace 'YOUR_MAPBOX_TOKEN' with your actual Mapbox access token

const AddParkingSpace = ({logged,user,setUser,setLogged}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState('');
  const [formData, setFormData] = useState({
    ownerId: '', // Replace with actual user ID
    parkingNumber: '',
    parkingAreaDescription: '',
    hourlyCost: '',
    dailyCost: '',
    weeklyCost: '',
    monthlyCost: '',
    latitude: '',
    longitude: '',
    address: '',
    parkingSpaceImage: null,
  });

  const [uploadedImage, setUploadedImage] = useState(null);

  useEffect(() => {
    if (!logged) {
      navigate('/login/owner');
    }
    if(user!=='Owner'){
      navigate('/login/owner');
    }
    const token = sessionStorage.getItem('token');
    if (token) {
      // Decode the token to get the ownerId
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setFormData((prevData) => ({
        ...prevData,
        ownerId: decodedToken.userId, // Assuming userId is present in the token payload
      }));
    } else {
      // Handle the case when the token is not present
      navigate('/login'); // Redirect to the login page if the user is not logged in
    }

    if (formData.parkingSpaceImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(formData.parkingSpaceImage);
    } else {
      setUploadedImage(null);
    }
  }, [formData.parkingSpaceImage, navigate,user,logged]);

  useEffect(() => {
    const initializeMap = () => {

      if (!mapboxToken) {
        // If mapboxToken is not available, do not initialize the map
        return;
      }

      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [0, 0],
        zoom: 2,
        accessToken: mapboxToken,
      });
      // Add a fixed blue marker to represent the user's current location
      const userMarker = new mapboxgl.Marker({
        color: '#007BFF', // Blue color
        draggable: false,
      });
  
      // Add a draggable red marker to select the location of the parking space
      const parkingSpaceMarker = new mapboxgl.Marker({
        color: '#FF0000', // Red color
        draggable: true,
      })
        .setLngLat([0, 0])
        .addTo(map);
  
      parkingSpaceMarker.on('dragend', () => {
        const { lng, lat } = parkingSpaceMarker.getLngLat();
        setFormData((prevData) => ({
          ...prevData,
          longitude: lng.toFixed(6),
          latitude: lat.toFixed(6),
        }));
      });
  
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        parkingSpaceMarker.setLngLat([lng, lat]);
        setFormData((prevData) => ({
          ...prevData,
          longitude: lng.toFixed(6),
          latitude: lat.toFixed(6),
        }));
      });
  
      // Get user's current location and set the map center
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          map.setCenter([longitude, latitude]);
          userMarker.setLngLat([longitude, latitude]).addTo(map);
          setFormData((prevData) => ({
            ...prevData,
            longitude: longitude.toFixed(6),
            latitude: latitude.toFixed(6),
          }));
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    };

    const fetchMapboxToken = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/mapbox/mapbox-token');
        setMapboxToken(response.data.mapboxToken);
        console.log('Mapbox token:', response.data.mapboxToken);
      } catch (error) {
        console.error('Error fetching Mapbox token:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMapboxToken(); // Fetch the Mapbox token
    initializeMap(); // Initialize the map
  }, [mapboxToken]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    const file = files && files[0]; // Get the first file if multiple files are selected
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? file : value, // Store the file object if it's a file input, otherwise store the value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const formDataWithImage = new FormData();

      for (const key in formData) {
        formDataWithImage.append(key, formData[key]);
      }

      formDataWithImage.append('token', token);
      formDataWithImage.append('parkingSpaceImage', formData.parkingSpaceImage);
      const response = await axios.post(
        'http://localhost:4000/api/v1/parking-space/addparking-space',
        formDataWithImage,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success('Uploading Image');
      setUploadedImage(response.data.parkingSpaceImage);
      toast.success('Parking Space registered successfully');
      console.log('Parking space added successfully:', response.data);
      navigate('/owner-dashboard');
    } catch (error) {
      toast.error('Error adding parking space');
      console.error('Error adding parking space:', error);
      console.log(formData);
    }
  };


  if(loading){
    return (<div
      className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status">
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
      >Loading...</span>
    </div>);
  }

  else return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded shadow-md w-full max-w-screen-xl mb-8">
      <h1 className="text-3xl font-bold mb-4">Add Parking Space</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            {uploadedImage && (
              <div className="rounded-full h-20 w-20 overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Uploaded Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="parkingNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Parking Number
            </label>
            <input
              type="text"
              id="parkingNumber"
              name="parkingNumber"
              value={formData.parkingNumber}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter parking number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="parkingAreaDescription" className="block text-gray-700 text-sm font-bold mb-2">
              Parking Area Description
            </label>
            <textarea
              id="parkingAreaDescription"
              name="parkingAreaDescription"
              value={formData.parkingAreaDescription}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter parking area description"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="monthlyCost" className="block text-gray-700 text-sm font-bold mb-2">
              Monthly Cost
            </label>
            <input
              type="number"
              id="monthlyCost"
              name="monthlyCost"
              value={formData.monthlyCost}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter monthly cost"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="weeklyCost" className="block text-gray-700 text-sm font-bold mb-2">
              Weekly Cost
            </label>
            <input
              type="number"
              id="weeklyCost"
              name="weeklyCost"
              value={formData.weeklyCost}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter weekly cost"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dailyCost" className="block text-gray-700 text-sm font-bold mb-2">
              Daily Cost
            </label>
            <input
              type="number"
              id="dailyCost"
              name="dailyCost"
              value={formData.dailyCost}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter daily cost"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="hourlyCost" className="block text-gray-700 text-sm font-bold mb-2">
              Hourly Cost
            </label>
            <input
              type="number"
              id="hourlyCost"
              name="hourlyCost"
              value={formData.hourlyCost}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter hourly cost"
            />
          </div>
          {/* Add other cost input fields (daily, weekly, monthly) */}
          <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Select Location</h2>
          <div id="map" style={{ width: '100%', height: '500px' }} />
        </div>
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter address"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="parkingSpaceImage" className="block text-gray-700 text-sm font-bold mb-2">
              Parking Space Image
            </label>
            <input
              type="file"
              id="parkingSpaceImage"
              name="parkingSpaceImage"
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Parking Space
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddParkingSpace;
