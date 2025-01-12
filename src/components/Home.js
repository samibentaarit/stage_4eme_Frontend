import { Link, useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    
    try {
      await fetch('http://localhost:8080/logout', { method: 'POST', credentials: 'include' });
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center  py-5 px-10">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-3xl text-center">
        {/* Welcome Header */}
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">Welcome to Our Platform!</h1>
        <p className="text-gray-700 text-lg mb-8">
          Discover the amazing features of our app and manage your content efficiently. 
          Whether you're working with students, grades, or announcements, we provide you 
          with all the tools you need!
        </p>

        {/* Image Section */}
        <div className="mb-8">
          <img
            src="https://via.placeholder.com/600x300"
            alt="Welcome Illustration"
            className="w-full rounded-lg"
          />
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-indigo-600">Easy Management</h3>
            <p className="text-gray-600 mt-2">
              Manage your classes, students, grades, and more with just a few clicks.
            </p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-indigo-600">Stay Organized</h3>
            <p className="text-gray-600 mt-2">
              Keep track of announcements, handle reclamations, and ensure smooth workflows.
            </p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-indigo-600">Secure & Reliable</h3>
            <p className="text-gray-600 mt-2">
              Your data is stored securely, ensuring peace of mind and reliable access.
            </p>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-indigo-400 text-white text-lg rounded-lg shadow hover:bg-indigo-600 transition"
          >
            Get Started
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white text-lg rounded-lg shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Additional Section */}
      <div className="mt-12 max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our App</h2>
        <p className="text-gray-600 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque et 
          facilisis nulla, nec consequat est. Nullam fringilla urna sit amet ligula 
          auctor, a convallis eros fermentum. Fusce dictum nisi at nibh gravida, vel 
          consequat eros dapibus. Sed convallis, erat nec volutpat vulputate, magna 
          orci tempor risus, nec pellentesque mi mauris id libero.
        </p>
      </div>
    </div>
  );
}

export default HomePage;
