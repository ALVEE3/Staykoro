import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaHeart, FaUser, FaCog } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, usersAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const bookingsResponse = await bookingsAPI.getMyBookings({ limit: 10 });
      setBookings(bookingsResponse.data);

      const statsResponse = await usersAPI.getStats();
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Welcome, {user?.name}! 👋
        </h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 rounded-lg p-4">
                <FaBook className="text-primary-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.bookingStats?.total_bookings || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 rounded-lg p-4">
                <FaBook className="text-green-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats?.bookingStats?.completed_bookings || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <FaUser className="text-blue-600 text-2xl" />
              </div>
              <div>
                <p className="text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-800">
                  ৳{stats?.spendStats?.total_spent || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>

              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">{booking.title}</h3>
                          <p className="text-gray-600 text-sm">
                            {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-lg font-bold text-gray-800">৳{booking.total_price}</p>
                        <Link to={`/bookings/${booking.id}`} className="btn-outline text-sm">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No bookings yet. <Link to="/properties" className="text-primary-600 hover:underline">Start exploring properties</Link></p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
              <Link to="/dashboard" className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg text-primary-600 font-semibold">
                <FaUser />
                My Profile
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg text-gray-700 font-semibold transition">
                <FaHeart />
                Wishlist
              </Link>
              <Link to="/account/settings" className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg text-gray-700 font-semibold transition">
                <FaCog />
                Settings
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
