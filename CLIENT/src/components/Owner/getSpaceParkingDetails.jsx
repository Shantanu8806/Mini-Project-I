import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const ParkingSpaceDetails = ({logged,user,setUser,setLogged}) => {
  const { spaceId } = useParams();
  const [spaceDetails, setSpaceDetails] = useState({});
  const [latestBooking, setLatestBooking] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!logged) {
      navigate('/login/owner');
    }
    if(user!=='Owner'){
      navigate('/login/owner');
    }
    const fetchParkingSpaceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/parking-space/spaceDetails/${spaceId}`);
        setSpaceDetails(response.data.parkingSpaceDetails);
        console.log(response.data.parkingSpaceDetails);
      } catch (error) {
        console.error('Error fetching parking space details:', error);
        console.log(spaceId);
      }
    };

    const fetchLatestBooking = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/parking-space/latest/${spaceId}`);
        setLatestBooking(response.data.latestBooking);
      } catch (error) {
        console.error('Error fetching latest booking details:', error);
      }
    };

    fetchParkingSpaceDetails();
    fetchLatestBooking();
  }, [spaceId,user,logged,navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96 mb-8">
        <h1 className="text-3xl font-bold mb-4">Parking Space Details</h1>
        <div className="mb-4">
          {/* Display parking space details on the left */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Parking Space Information</h2>
            <img
              src={spaceDetails.parkingSpaceImage}
              alt="Parking Space"
              className="mb-4 rounded"
              style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }}
            />
            <p>{`Parking Number: ${spaceDetails.parkingNumber}`}</p>
            {/* <p>{`Address: ${spaceDetails.owner.ownerAddress}`}</p> */}
            <p>{`Parking Area Description: ${spaceDetails.parkingAreaDescription}`}</p>
            <p>{`Hourly Cost: ₹${spaceDetails.hourlyCost}`}</p>
            <p>{`Daily Cost: ₹${spaceDetails.dailyCost}`}</p>
            <p>{`Weekly Cost: ₹${spaceDetails.weeklyCost}`}</p>
            <p>{`Monthly Cost: ₹${spaceDetails.monthlyCost}`}</p>
          </div>
          {/* Display latest booking details on the right */}
          {latestBooking && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Latest Booking Information</h2>
              <p>{`Type of Booking: ${latestBooking.typeofBooking}`}</p>
              <p>{`Start Time: ${latestBooking.startTime}`}</p>
              <p>{`End Time: ${latestBooking.endTime}`}</p>
              <p>{`Status: ${latestBooking.status}`}</p>
              <p>{`Payment Status: ${latestBooking.paymentStatus}`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkingSpaceDetails;
