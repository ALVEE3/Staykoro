import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'guest',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...data } = formData;
      await register(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Join Staykoro</h1>
        <p className="text-center text-gray-600 mb-8">Create your account to get started</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <FaUser className="text-gray-400 mr-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <FaPhone className="text-gray-400 mr-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880XXXXXXXXXX"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="guest">Guest (looking to book)</option>
              <option value="host">Host (listing properties)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full outline-none"
                required
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">Min 8 chars, uppercase, lowercase, and number</p>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2">
              <FaLock className="text-gray-400 mr-3" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 font-bold disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
