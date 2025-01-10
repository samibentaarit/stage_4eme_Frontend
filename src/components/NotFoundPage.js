import React from 'react';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-300 mb-8">
        Oops! The page you are looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white text-lg font-medium rounded-md shadow-md hover:from-blue-600 hover:to-green-600 transition-all"
      >
        Go Back to Home
      </a>
    </div>
  );
}

export default NotFoundPage;
