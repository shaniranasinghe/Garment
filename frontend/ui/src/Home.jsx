import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p className="text-lg">Here you can manage everything related to your system.</p>
      </div>
    </div>
  );
};

export default Home;
