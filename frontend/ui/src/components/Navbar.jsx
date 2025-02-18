import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false); // Update the state to reflect logout
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black text-white px-8 py-4 shadow-lg z-50 border-b-4 border-blue-300"> {/* Corrected light blue border */}
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold cursor-pointer hover:text-orange-500 transition">
          Dmax Lanka PVT LTD
        </div>
        <div className="hidden md:flex space-x-8">
          <Link
            to="/home"
            className={`hover:bg-orange-500 hover:text-white rounded-full px-3 py-1 transition ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ pointerEvents: !isLoggedIn ? 'none' : 'auto' }}
          >
            Home
          </Link>
          <Link
            to="/create-order"
            className={`hover:bg-orange-500 hover:text-white rounded-full px-3 py-1 transition ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ pointerEvents: !isLoggedIn ? 'none' : 'auto' }}
          >
            Create Order
          </Link>
          <Link
            to="/orders-list"
            className={`hover:bg-orange-500 hover:text-white rounded-full px-3 py-1 transition ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ pointerEvents: !isLoggedIn ? 'none' : 'auto' }}
          >
            Orders List
          </Link>
          <Link
            to="/contact"
            className={`hover:bg-orange-500 hover:text-white rounded-full px-3 py-1 transition ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ pointerEvents: !isLoggedIn ? 'none' : 'auto' }}
          >
            Contact
          </Link>
        </div>
        <div className="hidden md:block">
          <button
            onClick={handleLogout}
            className={`bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition ${isLoggedIn ? '' : 'opacity-50 cursor-not-allowed'}`}
            style={{ pointerEvents: isLoggedIn ? 'auto' : 'none' }}
          >
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;