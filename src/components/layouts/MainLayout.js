import React from 'react';
import Navbar from '../Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 py-5 px-10 ml-64">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
