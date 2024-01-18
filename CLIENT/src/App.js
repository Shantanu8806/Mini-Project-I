import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import 'react-toastify/dist/ReactToastify.css';
import {  ToastContainer } from 'react-toastify';
import Login from "./components/Login";
import AboutUs from "./components/AboutUs"; // Add this line
import SignUpTypeSelection from "./components/SignUpTypeSelection";
import SignUpOwner from "./components/owner/SignUpOwner";
import SignUpTenant from "./components/Tenant/SignUpTenant";
import OwnerDashboard from "./components/owner/OwnerDashboard";
import Features from "../src/components/features/Features"
import OwnerLogin from "./components/owner/OwnerLogin";
import TenantLogin from "./components/Tenant/TenantLogin";
import AddParkingSpace from "./components/owner/AddParkingSpace";
import ParkingSpaceDetails from "./components/owner/getSpaceParkingDetails";
import TenantDashboard from "./components/Tenant/TenantDashboard";
import Booking from "./components/Tenant/Booking";
function App() {
  const[logged,setLogged]=useState(false);
  const[user ,setUser]=useState('');
  return (
    <div className="App">
     <Navbar logged={logged} setLogged={setLogged} user={user} setUser={setUser}/>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/signupTypeSelection" element={<SignUpTypeSelection/>} />
        <Route path="/signup/owner" element={<SignUpOwner />} />
        <Route path='/features' element={<Features/>}/>
        <Route path="/signup/tenant" element={<SignUpTenant />} />
        <Route path="/login" element={<Login setLogged={setLogged} setUser={setUser} /> } />
        <Route path="/login/owner" element={<OwnerLogin setLogged={setLogged} setUser={setUser} />}/>
        <Route path="/login/tenant" element={<TenantLogin setLogged={setLogged} setUser={setUser} />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard setLogged={setLogged} setUser={setUser}/>} />
        <Route path="/tenant-dashboard" element={<TenantDashboard setLogged={setLogged} setUser={setUser}/>} />
        <Route path="/spaceDetails/:spaceId" element={<ParkingSpaceDetails/>} />
        <Route path="/Booking/:spaceId" element={<Booking/>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/add-parkingspace" element={<AddParkingSpace/>} />
      </Routes>
    </div>

  );
}

export default App;
