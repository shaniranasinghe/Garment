import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed top-24 left-0 h-full w-64 bg-black text-white flex flex-col items-start p-6 border-4 border-blue-300 rounded-lg shadow-lg z-40"> {/* Adjusted top to be below the navbar */}
      <h2 className="text-3xl font-bold mb-8">Menu</h2>
      <nav className="flex flex-col space-y-4">
        <Link
          to="/dashboard"
          className="w-full flex items-center text-left px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 6h18M3 14h18M3 18h18"
            />
          </svg>
          Dashboard
        </Link>

        <Link
          to="/add-new-bag"
          className="w-full flex items-center text-left px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Bag
        </Link>

        <Link
          to="/bags-list"
          className="w-full flex items-center text-left px-4 py-2 rounded-full hover:bg-orange-500 hover:text-white transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
            />
          </svg>
          Bags List
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;