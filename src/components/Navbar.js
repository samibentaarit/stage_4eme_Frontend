import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faBullhorn,
  faFileAlt,
  faUserGraduate,
  faClipboard,
  faChalkboardTeacher,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/logout', { method: 'POST', credentials: 'include' });
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userId = localStorage.getItem('id');

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
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faHome} />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/announcements"
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/announcements")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faBullhorn} />
                Announcements
              </Link>
            </li>
            <li>
              <Link
                to="/reclamations"
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/reclamations")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faFileAlt} />
                Reclamations
              </Link>
            </li>
            {/* <li>
              <Link
                to="/create-announcement"
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/create-announcement")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
                Create Announcement
              </Link>
            </li> */}
           {/*  <li>
              <Link
                to="/create-reclamation"
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/create-reclamation")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faPlusCircle} />
                Create Reclamation
              </Link>
            </li> */}
            <li>
              <Link
                to="/students"
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/students")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faUserGraduate} />
                Students
              </Link>
            </li>
            <li>
              <Link
                to="/grades"
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/grades")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faClipboard} />
                Grades
              </Link>
            </li>
            <li>
              <Link
                to="/classes"
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition duration-300 ${
                  isActive("/classes")
                    ? "bg-indigo-700 text-white"
                    : "text-white hover:bg-indigo-600"
                }`}
              >
                <FontAwesomeIcon icon={faChalkboardTeacher} />
                Classes
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Profile Section */}
      {userId && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="rounded-full"
            />
            <span className="text-white font-semibold">Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-500 text-white py-1 px-3 rounded-lg transition duration-300 hover:bg-red-700 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
