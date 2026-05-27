


import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Hall Booking System</h1>

          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-gray-200">
              Home
            </a>

            <a href="hall" className="hover:text-gray-200">
              Halls
            </a>

            <a href="booking" className="hover:text-gray-200">
              Bookings
            </a>

            <a href="#" className="hover:text-gray-200">
              Contact
            </a>
          </div>

          <button className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight">
              Easy Hall Booking Management
            </h2>

            <p className="mt-6 text-lg text-gray-200">
              Reserve conference halls, manage bookings, and organize events
              efficiently with our modern booking platform.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition">
                Book Now
              </button>

              <button className="border border-white px-6 py-3 rounded-xl hover:bg-white hover:text-blue-700 transition">
                Explore Halls
              </button>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1517502884422-41eaead166d4"
              alt="Hall"
              className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-14">
            System Features
          </h3>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">📅</div>

              <h4 className="text-2xl font-semibold mb-3">
                Easy Reservations
              </h4>

              <p className="text-gray-600">
                Book halls quickly using a modern and user-friendly interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">🏢</div>

              <h4 className="text-2xl font-semibold mb-3">
                Multiple Halls
              </h4>

              <p className="text-gray-600">
                Manage conference rooms and event halls from one dashboard.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">👥</div>

              <h4 className="text-2xl font-semibold mb-3">
                Participant Tracking
              </h4>

              <p className="text-gray-600">
                Track expected attendees and booking information efficiently.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition">
              <div className="text-5xl mb-4">🔒</div>

              <h4 className="text-2xl font-semibold mb-3">
                Secure Access
              </h4>

              <p className="text-gray-600">
                JWT-secured authentication for protected system access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <h2 className="text-5xl font-bold text-blue-700">20+</h2>
            <p className="mt-2 text-gray-600">Available Halls</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-blue-700">500+</h2>
            <p className="mt-2 text-gray-600">Bookings Completed</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-blue-700">1000+</h2>
            <p className="mt-2 text-gray-600">Happy Users</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-blue-700">24/7</h2>
            <p className="mt-2 text-gray-600">Support</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-700 text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 Hall Booking System. All Rights Reserved.</p>

          <div className="space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-200">
              Privacy
            </a>

            <a href="#" className="hover:text-gray-200">
              Terms
            </a>

            <a href="#" className="hover:text-gray-200">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}