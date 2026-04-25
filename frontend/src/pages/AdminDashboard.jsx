import React, { useState, useEffect } from 'react';
import { FaUsers, FaHome, FaBook, FaDollarSign, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { adminAPI } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const statsResponse = await adminAPI.getStats();
      setStats(statsResponse.data);

      const pendingResponse = await adminAPI.getPendingProperties();
      setPendingProperties(pendingResponse.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId) => {
    try {
      await adminAPI.approveProperty(propertyId);
      setPendingProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error approving property:', error);
    }
  };

  const handleReject = async (propertyId) => {
    try {
      await adminAPI.rejectProperty(propertyId, { reason: 'Does not meet quality standards' });
      setPendingProperties(prev => prev.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error rejecting property:', error);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.totalUsers?.[0]?.count || 0}
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
                <p className="text-gray-600">Total Properties</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.totalProperties?.[0]?.count || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 rounded-lg p-4">
                <FaBook className="text-yellow-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.totalBookings?.[0]?.count || 0}
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
                <p className="text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">
                  ৳{stats?.totalRevenue?.[0]?.total || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Properties */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Property Approvals</h2>

          {pendingProperties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Property</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Host</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Price/Night</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProperties.map(property => (
                    <tr key={property.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{property.title}</td>
                      <td className="py-3 px-4">{property.host_name}</td>
                      <td className="py-3 px-4">{property.location}</td>
                      <td className="py-3 px-4">৳{property.price_per_night}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(property.id)}
                            className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium"
                          >
                            <FaCheckCircle /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(property.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                          >
                            <FaTimesCircle /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No pending properties for approval
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
