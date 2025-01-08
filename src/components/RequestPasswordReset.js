import React, { useState } from 'react';
import axios from 'axios';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/password-reset', { email });
      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-teal-400 to-blue-600">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Request Password Reset</h2>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleRequestReset} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-md hover:from-green-500 hover:to-blue-600 transition-all"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPasswordReset;
