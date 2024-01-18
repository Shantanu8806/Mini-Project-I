import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TenantDashboard from './TenantDashboard'; // Import TenantDashboard component

const TenantLogin = ({logged,User,setLogged, setUser }) => {
  const navigate = useNavigate(); // Access the navigate function from react-router-dom

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Simulate login logic with API call (replace with actual API call)
      const response = await fetch('http://localhost:4000/api/v1/auth/login/tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Store token in session storage
        sessionStorage.setItem('token', data.token);
        setLogged(true);
        setUser('Tenant');
        toast.success('Login successful!');
        // Redirect to tenant dashboard using navigate function
        navigate('/tenant-dashboard'); // Navigate to tenant dashboard
      } else {
        // Handle login failure
        console.log(email, password);
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <ToastContainer />
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
      <Routes>
        <Route path="/tenant-dashboard" element={<TenantDashboard />} />
      </Routes>
    </div>
  );
};

export default TenantLogin;
