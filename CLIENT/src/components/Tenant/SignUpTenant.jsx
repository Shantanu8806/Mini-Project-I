import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignUpTenant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    address: '',
    vehicle: '',
    vehicleType: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    profilePic: null,
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? e.target.files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      setPasswordsMatch(false);
      return;
    }
    try {
      const formDataForBackend = new FormData();
      for (const key in formData) {
        formDataForBackend.append(key, formData[key]);
      }

      const response = await axios.post('http://localhost:4000/api/v1/auth/signup/tenant', formDataForBackend);
      console.log(response.data);
      toast.success('User created successfully');
      navigate('/login/tenant');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error creating user');
      // Optionally, handle error response (e.g., display an error message)
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="bg-white p-8 rounded shadow-md w-full max-w-screen-xl mb-8">
        <h1 className="text-3xl font-bold mb-4">Tenant Sign Up</h1>
        <form onSubmit={handleSubmit}>
        {formData.profilePic && (
          <div className="mb-4">
            <div className="relative rounded-full mb-4 w-60 h-60 overflow-hidden mx-auto">
              <img
                src={URL.createObjectURL(formData.profilePic)}
                alt="Profile Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-bold mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your full name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email address"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-700 text-sm font-bold mb-2">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
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
              placeholder="Enter your address"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="vehicle" className="block text-gray-700 text-sm font-bold mb-2">
              Vehicle
            </label>
            <input
              type="text"
              id="vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your vehicle"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="vehicleType" className="block text-gray-700 text-sm font-bold mb-2">
              Vehicle Type
            </label>
            <select
              id="vehicleType"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select vehicle type</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="bike">Bike</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm your password"
            />
            {!passwordsMatch && ( // Display an error toast if passwords don't match
              <p className="text-red-500 text-xs italic">Passwords do not match.</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="contactNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Contact Number
            </label>
            <input
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your contact number"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="profilePic" className="block text-gray-700 text-sm font-bold mb-2">
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              onChange={handleInputChange}
              className="appearance-none block w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 rounded shadow"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              disabled={!passwordsMatch}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                !passwordsMatch && 'opacity-50 cursor-not-allowed'
              }`}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <ToastContainer /> {/* ToastContainer must be rendered once in the root component */}
    </div>
  );
};

export default SignUpTenant;
