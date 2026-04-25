import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import { FaCheckCircle, FaShieldAlt, FaGlobeAsia } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties] = useState([
    {
      id: 1,
      title: 'Cozy Apartment in Dhaka',
      description: 'Beautiful modern apartment in the heart of Dhaka',
      price_per_night: 2500,
      location: 'Dhaka',
      capacity: 4,
      bedrooms: 2,
      rating: 4.8,
      image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Beach Villa in Cox\'s Bazar',
      description: 'Stunning beachfront villa with ocean views',
      price_per_night: 4500,
      location: 'Cox\'s Bazar',
      capacity: 6,
      bedrooms: 3,
      rating: 4.9,
      image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Mountain Retreat in Sylhet',
      description: 'Peaceful retreat surrounded by tea gardens',
      price_per_night: 3000,
      location: 'Sylhet',
      capacity: 5,
      bedrooms: 2,
      rating: 4.7,
      image_url: 'https://images.unsplash.com/photo-1564501049714-30e1141a940d?w=500&h=300&fit=crop'
    },
  ]);

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams(searchParams);
    navigate(`/properties?${params}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">Welcome to Staykoro</h1>
            <p className="text-xl text-primary-100 mb-8">
              Discover amazing properties and unforgettable experiences across Bangladesh
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-5xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Explore Popular Categories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: 'Apartments', emoji: '🏢', count: '234' },
              { name: 'Villas', emoji: '🏡', count: '156' },
              { name: 'Hotels', emoji: '🏨', count: '89' },
              { name: 'Cottages', emoji: '🏠', count: '102' },
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => navigate(`/properties?category=${cat.name}`)}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition card-hover"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="font-semibold text-gray-800 mb-1">{cat.name}</h3>
                <p className="text-gray-600 text-sm">{cat.count} listings</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Featured Properties
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Handpicked selections from our best hosts
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/properties"
              className="btn-primary inline-block text-lg px-8 py-3"
            >
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Locations */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Explore Popular Locations in Bangladesh
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Dhaka', count: '450' },
              { name: 'Cox\'s Bazar', count: '320' },
              { name: 'Sylhet', count: '180' },
              { name: 'Chittagong', count: '220' },
              { name: 'Khulna', count: '95' },
              { name: 'Rajshahi', count: '140' },
            ].map((loc) => (
              <button
                key={loc.name}
                onClick={() => navigate(`/properties?location=${loc.name}`)}
                className="bg-white rounded-lg p-6 border border-gray-200 hover:border-primary-600 hover:shadow-md transition text-left"
              >
                <h3 className="font-semibold text-gray-800 mb-1">{loc.name}</h3>
                <p className="text-gray-600 text-sm">{loc.count} properties available</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
            Why Choose Staykoro?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center">
              <FaCheckCircle className="text-primary-600 text-4xl mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-800 mb-3">
                Verified Properties
              </h3>
              <p className="text-gray-600">
                All properties are verified by our team to ensure quality and authenticity
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center">
              <FaShieldAlt className="text-primary-600 text-4xl mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-800 mb-3">
                Secure Bookings
              </h3>
              <p className="text-gray-600">
                Your payments are secure with our encrypted payment system
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 text-center">
              <FaGlobeAsia className="text-primary-600 text-4xl mx-auto mb-4" />
              <h3 className="font-bold text-lg text-gray-800 mb-3">
                Bangladesh Focus
              </h3>
              <p className="text-gray-600">
                Dedicated to serving local travelers and hosts across Bangladesh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to List Your Property?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of hosts earning income by sharing their properties
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-primary-600 hover:bg-primary-50 px-8 py-3 rounded-lg font-bold transition"
          >
            Become a Host
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Staykoro</h3>
              <p className="text-sm">
                Your trusted marketplace for accommodations in Bangladesh
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="text-sm space-y-2">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/properties" className="hover:text-white">Properties</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2024 Staykoro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
