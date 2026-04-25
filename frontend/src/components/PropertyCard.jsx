import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';

const PropertyCard = ({ property, onWishlistToggle, isInWishlist }) => {
  return (
    <div className="card-hover bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={property.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={() => onWishlistToggle?.(property.id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500" size={18} />
          ) : (
            <FaRegHeart className="text-gray-400" size={18} />
          )}
        </button>

        {/* Rating Badge */}
        {property.rating && (
          <div className="absolute bottom-3 left-3 badge-primary flex items-center gap-1">
            <FaStar className="text-yellow-400" size={14} />
            {parseFloat(property.rating).toFixed(1)}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 truncate mb-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
          <FaMapMarkerAlt className="text-primary-600" size={14} />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {property.description}
        </p>

        {/* Details */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <FaUsers size={14} />
            <span>{property.capacity} guests</span>
          </div>
          {property.bedrooms && (
            <span>{property.bedrooms} bedrooms</span>
          )}
        </div>

        {/* Price and Button */}
        <div className="flex justify-between items-center border-t pt-4">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              ৳{property.price_per_night}
            </div>
            <span className="text-gray-600 text-sm">/night</span>
          </div>
          <Link
            to={`/property/${property.id}`}
            className="btn-primary text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
