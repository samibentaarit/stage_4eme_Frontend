import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Helper function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-indigo-500 w-64 h-screen p-5 flex flex-col justify-between fixed top-0 left-0 transition duration-300">
      <div>
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-white">The LOGO</h1>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block py-2 px-4 rounded-lg  transition duration-300 ${
                  isActive("/")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/reclamations"
                className={`block py-2 px-4 rounded-lg  transition duration-300 ${
                  isActive("/reclamations")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                Reclamations
              </Link>
            </li>
            <li>
              <Link
                to="/create-annance"
                className={`block py-2 px-4 rounded-lg  transition duration-300 ${
                  isActive("/create-annance")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                Create Annonce
              </Link>
            </li>
            <li>
              <Link
                to="/create-reclamation"
                className={`block py-2 px-4 rounded-lg  transition duration-300 ${
                  isActive("/create-reclamation")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                Create Reclamation
              </Link>
            </li>
            <li>
              <Link
                to="/students"
                className={`block py-2 px-4 rounded-lg  transition duration-300 ${
                  isActive("/students")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                Students
              </Link>
            </li>
            <li>
              <Link
                to="/grades"
                className={`block py-2 px-4 rounded-lg  transition duration-300 ${
                  isActive("/grades")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                Grades
              </Link>
            </li>
            <li>
              <Link
                to="/classes"
                className={`block py-2 px-4 rounded-lg  transition duration-300 ${
                  isActive("/classes")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                Classes
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-2">
        <img
          src="https://via.placeholder.com/40"
          alt="Profile"
          className="rounded-full"
        />
        <span className="text-white font-semibold">Admin</span>
      </div>
    </div>
  );
};

export default Navbar;
