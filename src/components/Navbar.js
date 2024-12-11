import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Helper function to check if a route is active
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-yellow-400 w-64 h-screen p-5 flex flex-col justify-between fixed top-0 left-0">
      <div>
        {/* Logo Section */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-black">The LOGO</h1>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className={`block py-2 px-4 rounded ${
                  isActive("/") ? "bg-black text-white" : "text-black hover:bg-yellow-300"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/reclamations"
                className={`block py-2 px-4 rounded ${
                  isActive("/reclamations")
                    ? "bg-black text-white"
                    : "text-black hover:bg-yellow-300"
                }`}
              >
                Reclamations
              </Link>
            </li>
            <li>
              <Link
                to="/create-annance"
                className={`block py-2 px-4 rounded ${
                  isActive("/create-annance")
                    ? "bg-black text-white"
                    : "text-black hover:bg-yellow-300"
                }`}
              >
                Create Annonce
              </Link>
            </li>
            <li>
              <Link
                to="/create-reclamation"
                className={`block py-2 px-4 rounded ${
                  isActive("/create-reclamation")
                    ? "bg-black text-white"
                    : "text-black hover:bg-yellow-300"
                }`}
              >
                Create Reclamation
              </Link>
            </li>
            <li>
              <Link
                to="/students"
                className={`block py-2 px-4 rounded ${
                  isActive("/students")
                    ? "bg-black text-white"
                    : "text-black hover:bg-yellow-300"
                }`}
              >
                Students
              </Link>
            </li>
            <li>
              <Link
                to="/grades"
                className={`block py-2 px-4 rounded ${
                  isActive("/grades")
                    ? "bg-black text-white"
                    : "text-black hover:bg-yellow-300"
                }`}
              >
                Grades
              </Link>
            </li>
            <li>
              <Link
                to="/classes"
                className={`block py-2 px-4 rounded ${
                  isActive("/classes")
                    ? "bg-black text-white"
                    : "text-black hover:bg-yellow-300"
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
        <span className="text-black font-semibold">Admin</span>
      </div>
    </div>
  );
};

export default Navbar;
