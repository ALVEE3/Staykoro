import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesAPI } from '../services/api';

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_night: '',
    location: '',
    capacity: '',
    bedrooms: '',
    bathrooms: '',
  });
  const [amenities, setAmenities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const districts = [
    'Dhaka', 'Chittagong', 'Sylhet', 'Cox\'s Bazar', 'Khulna', 'Rajshahi',
    'Barisal', 'Rangpur', 'Mymensingh', 'Jashore', 'Comilla', 'Narayanganj'
  ];

  const amenitiesList = [
    'WiFi', 'Kitchen', 'Air Conditioning', 'Heating', 'Washer', 'Dryer',
    'Parking', 'Pool', 'Hot Tub', 'Gym', 'BBQ Grill', 'Patio'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await propertiesAPI.create({
        ...formData,
        price_per_night: parseFloat(formData.price_per_night),
        capacity: parseInt(formData.capacity),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        amenities: amenities,
      });
      navigate('/dashboard/host');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Add New Property</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Property Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Cozy Apartment in Dhaka"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your property..."
                  rows="5"
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Price per Night (৳)</label>
                  <input
                    type="number"
                    name="price_per_night"
                    value={formData.price_per_night}
                    onChange={handleChange}
                    placeholder="2500"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Location</label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select a district</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="mb-6 pb-6 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-6">Property Details</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Guests</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="4"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="2"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="1"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6 pb-6 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-6">Amenities</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 font-bold disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Property'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/host')}
              className="btn-outline px-8 py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
