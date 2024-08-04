import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { account } from '../utils/appwrite'; // Import your Appwrite account instance

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession('current'); // Log out the current session
      navigate('/login'); // Redirect to the login page or another page after logout
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/home" className="text-white">Home</Link>
        <Link to="/add-product" className="text-white">Add Product</Link>
        <Link to="/cart" className="text-white">Cart</Link>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
