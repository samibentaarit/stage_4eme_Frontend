// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="bg-yellow-400 w-64 h-screen p-5 flex flex-col justify-between">
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
                    to="/reclamations"
                    className="block py-2 px-4 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Manage reservations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/classes"
                    className="block py-2 px-4 text-black rounded hover:bg-yellow-300"
                  >
                    Manage availability
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-annance"
                    className="block py-2 px-4 text-black rounded hover:bg-yellow-300"
                  >
                    Manage option#3
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-reclamation"
                    className="block py-2 px-4 text-black rounded hover:bg-yellow-300"
                  >
                    Manage option#4
                  </Link>
                </li>
                <li>
                  <Link
                    to="/grades"
                    className="block py-2 px-4 text-black rounded hover:bg-yellow-300"
                  >
                    Manage option#5
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
