import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SideNav = ({ token, setToken }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Log the token value to help with debugging
  useEffect(() => {
    console.log('Token value:', token);
  }, [token]);

  const handleLogout = () => {
    console.log('Logging out');
    setToken('');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Logout button positioned at the top left */}
      {token && (
        <button
          onClick={handleLogout}
          className="fixed top-4 left-4 z-50 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg focus:outline-none"
        >
          Logout 👋
        </button>
      )}

      {/* Hamburger menu for toggling side navigation */}
      <button
        className="fixed top-16 left-4 z-50 text-white focus:outline-none"
        onClick={toggleNav}
      >
        {isOpen ? (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        )}
      </button>

      {/* Side navigation */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-40`}
      >
        <nav className="flex flex-col items-center mt-20 space-y-6">
          <ul className="text-lg text-white space-y-4">
            {!token ? (
              <>
                <li>
                  <Link to="/" className="block px-6 py-3 rounded-lg hover:bg-gray-700">
                    Register 🩷
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="block px-6 py-3 rounded-lg hover:bg-gray-700">
                    Login 🩵
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/chat" className="block px-6 py-3 rounded-lg hover:bg-gray-700">
                    Chat 🗯️
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideNav;


