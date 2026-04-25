import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaBed, FaBath, FaStar, FaWifi, FaUtensils } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { propertiesAPI, bookingsAPI, reviewsAPI } from '../services/api';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const propertyResponse = await propertiesAPI.getOne(id);
      setProperty(propertyResponse.data);

      const reviewsResponse = await reviewsAPI.getPropertyReviews(id);
      setReviews(reviewsResponse.data.reviews);
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await bookingsAPI.create({
        property_id: parseInt(id),
        check_in: checkIn,
        check_out: checkOut,
        guests: parseInt(guests)
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!property) return <div className="text-center py-20">Property not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Image Gallery */}
        <div className="bg-white rounded-lg overflow-hidden mb-8 shadow-md">
          <div className="w-full h-96 bg-gray-300">
            <img
              src={property.image_url || 'https://via.placeholder.com/800x400'}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{property.title}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-primary-600" />
                  {property.location}
                </div>
                {property.rating && (
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {parseFloat(property.rating).toFixed(1)}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{property.description}</p>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <FaUsers className="text-2xl text-primary-600 mb-2" />
                  <p className="font-semibold">{property.capacity} Guests</p>
                </div>
                {property.bedrooms && (
                  <div className="text-center">
                    <FaBed className="text-2xl text-primary-600 mb-2" />
                    <p className="font-semibold">{property.bedrooms} Bedrooms</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="text-center">
                    <FaBath className="text-2xl text-primary-600 mb-2" />
                    <p className="font-semibold">{property.bathrooms} Bathrooms</p>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map(amenity => (
                    <div key={amenity.id} className="flex items-center gap-2">
                      <FaWifi className="text-primary-600" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between mb-2">
                        <p className="font-semibold">{review.name}</p>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet</p>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <aside>
            <div className="bg-white rounded-lg p-6 sticky top-20 shadow-md">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-800">৳{property.price_per_night}</p>
                <p className="text-gray-600">/night</p>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Guests</label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="input-field"
                  >
                    {[...Array(property.capacity)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-primary w-full py-3 font-bold">
                  Book Now
                </button>
              </form>

              <p className="text-center text-gray-600 text-sm mt-4">
                You won't be charged yet
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
