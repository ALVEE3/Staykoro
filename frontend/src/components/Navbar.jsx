import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary-600">🏠</div>
            <div className="text-xl font-bold text-gray-800">Staykoro</div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-primary-600 transition">
              Properties
            </Link>
            {isAuthenticated && user?.role === 'host' && (
              <Link to="/dashboard/host" className="text-gray-700 hover:text-primary-600 transition">
                Host Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <FaUser />
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 btn-primary"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t pt-4">
            <Link to="/" className="block py-2 text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/properties" className="block py-2 text-gray-700 hover:text-primary-600">
              Properties
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex gap-2 mt-4">
                <Link to="/login" className="flex-1 btn-outline text-center">
                  Login
                </Link>
                <Link to="/signup" className="flex-1 btn-primary text-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
