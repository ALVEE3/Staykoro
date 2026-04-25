import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaHome, FaCalendar, FaDollarSign } from 'react-icons/fa';
import { usersAPI } from '../services/api';

const HostDashboard = () => {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHostData();
  }, []);

  const fetchHostData = async () => {
    try {
      const statsResponse = await usersAPI.getStats();
      setStats(statsResponse.data);

      const propertiesResponse = await usersAPI.getProperties();
      setProperties(propertiesResponse.data);
    } catch (error) {
      console.error('Error fetching host data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Host Dashboard</h1>
          <Link to="/property/add" className="btn-primary flex items-center gap-2">
            <FaPlus />
            Add New Property
          </Link>
        </div>

        {/* Host Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <FaHome className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.hostStats?.total_properties || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-4">
                <FaHome className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.hostStats?.approved_properties || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 rounded-lg p-4">
                <FaCalendar className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Bookings</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.bookingStats?.total_bookings || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 rounded-lg p-4">
                <FaDollarSign className="text-purple-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-800">
                  ৳{stats?.spendStats?.total_spent || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Properties</h2>

          {properties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price/Night</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(property => (
                    <tr key={property.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{property.title}</td>
                      <td className="py-3 px-4">{property.location}</td>
                      <td className="py-3 px-4">৳{property.price_per_night}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          property.status === 'approved' ? 'bg-green-100 text-green-700' :
                          property.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Link to={`/property/${property.id}/edit`} className="text-primary-600 hover:underline">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No properties yet. <Link to="/property/add" className="text-primary-600 hover:underline">Add your first property</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;
