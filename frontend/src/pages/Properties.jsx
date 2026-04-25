import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { FaSliders } from 'react-icons/fa6';
import { propertiesAPI } from '../services/api';

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    capacity: searchParams.get('capacity') || '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [filters, searchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await propertiesAPI.getAll(filters);
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Find Your Perfect Stay</h1>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg p-6 sticky top-20">
              <div className="flex items-center gap-2 mb-6">
                <FaSliders />
                <h2 className="font-bold text-lg">Filters</h2>
              </div>

              {/* Location Filter */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Search location..."
                  className="input-field"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2">Price Range</label>
                <div className="space-y-3">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min price"
                    className="input-field"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max price"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div className="mb-6">
                <label className="block font-semibold text-gray-700 mb-2">Guests</label>
                <select
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange('capacity', e.target.value)}
                  className="input-field"
                >
                  <option value="">Any</option>
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="4">4 guests</option>
                  <option value="6">6+ guests</option>
                </select>
              </div>

              <button
                onClick={() => setFilters({ location: '', minPrice: '', maxPrice: '', capacity: '' })}
                className="w-full btn-outline"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Properties Grid */}
          <main className="flex-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn-outline mb-6"
            >
              <FaSliders className="inline mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin">⚙️</div>
                <span className="ml-3">Loading properties...</span>
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-xl text-gray-600">No properties found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Properties;
