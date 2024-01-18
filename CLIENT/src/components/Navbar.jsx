import logo from '../images/logo.png';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ logged, setLogged,user,setUser }) {
  const location = useLocation();
// const [userType,setUsertype]=useState("");
  return (
    <div className='flex flex-row bg-gradient-to-r from-indigo-900 via-purple-700 to-blue-500 text-white font-bold p-6 text-lg'>
      <div className='ml-20'>
        <img src={logo} width={140} height={20} loading='lazy' alt='Logo' />
      </div>
      <div className='flex flex-row gap-20 mt-2'>
        <Link to='/Home' className={`ml-96 ${location.pathname === '/' ? 'underline' : ''}`}>
          Home
        </Link>
        <Link to='/about' className={`${location.pathname === '/about' ? 'underline' : ''}`}>
          About
        </Link>
        <Link to='/features' className={`${location.pathname === '/features' ? 'underline' : ''}`}>
          Features
        </Link>
        {logged && user==="Owner"&& (
          <Link to='/owner-dashboard'>
            OwnerDashboard
          </Link>
        )}
        {logged && user==="Tenant"&& (
          <Link to='/tenant-dashboard'>
            TenantDashboard
          </Link>
        )}

      </div>
      <div className='flex flex-row gap-10 ml-96 mt-2'>
        {!logged && (
          <Link to='/login' >
            <button className={`${location.pathname === '/login' ? 'underline' : ''}`}>Login</button>
          </Link>
        )}

        {!logged && (
          <Link to='/signupTypeSelection' >
            <button className={`${location.pathname === '/signupTypeSelection' ? 'underline' : ''}`}>Signup</button>
          </Link>
        )}

        {logged &&  (
          <Link to='/' onClick={() => setLogged(false)}>
            <button>LogOut</button>
          </Link>
        )}



        
      </div>
    </div>
  );
}

export default Navbar;