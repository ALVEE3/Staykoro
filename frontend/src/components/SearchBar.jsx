import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendar, FaUsers, FaSearch } from 'react-icons/fa';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({ location, checkIn, checkOut, guests });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-full shadow-lg p-2 flex flex-wrap gap-2">
      {/* Location Input */}
      <div className="flex-1 min-w-[150px] flex items-center gap-2 px-4 py-2">
        <FaMapMarkerAlt className="text-primary-600" />
        <input
          type="text"
          placeholder="Where are you going?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Check-in Input */}
      <div className="flex-1 min-w-[150px] flex items-center gap-2 px-4 py-2 border-l">
        <FaCalendar className="text-primary-600" />
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Check-out Input */}
      <div className="flex-1 min-w-[150px] flex items-center gap-2 px-4 py-2 border-l">
        <FaCalendar className="text-primary-600" />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full outline-none"
        />
      </div>

      {/* Guests Input */}
      <div className="flex items-center gap-2 px-4 py-2 border-l">
        <FaUsers className="text-primary-600" />
        <input
          type="number"
          min="1"
          max="16"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-20 outline-none"
        />
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="bg-primary-600 hover:bg-primary-700 text-white rounded-full px-6 py-2 flex items-center gap-2 font-medium transition"
      >
        <FaSearch />
        Search
      </button>
    </form>
  );
};

export default SearchBar;
