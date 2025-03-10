import React from 'react';

const UserDetails = ({ user }) => {

  const defaultUser = {
    name: 'Guest User',
    email: 'guest@example.com',
    imageUrl: 'https://via.placeholder.com/150', // Replace with a default image URL
  };

  // Use the provided user object, or the default if none is provided
  const currentUser = user || defaultUser;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Image */}
      <div className="flex justify-center mb-4">
        <img
          src={currentUser.imageUrl}
          alt={`Profile of ${currentUser.name}`}
          className="rounded-full h-24 w-24 object-cover border-2 border-gray-300"
        />
      </div>

      {/* Name */}
      <h3 className="text-xl font-semibold text-gray-800 text-center mb-2">
        {currentUser.name}
      </h3>

      {/* Email */}
      <p className="text-gray-600 text-center mb-4">
        {currentUser.email}
      </p>

      {/* Optional: Other details (e.g., role, location) */}
      {/* Example:
      <p className="text-gray-600 text-center">
        Role: {currentUser.role || 'N/A'}
      </p>
      */}
    </div>
  );
};

export default UserDetails;