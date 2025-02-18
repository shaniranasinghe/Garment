import React, { useState } from 'react';
import axios from 'axios';

const AddBagForm = () => {
  const [formData, setFormData] = useState({
    code: '',
    colour: '',
    quantity: '',
    price: ''
  });
  const [loading, setLoading] = useState(false); // To manage loading state
  const [error, setError] = useState(''); // To manage error messages

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      // Send POST request to the backend to add a new bag
      const response = await axios.post('http://localhost:4000/api/stocks', formData);
      console.log('Bag added successfully:', response.data);

      // Clear the form after successful submission
      setFormData({
        code: '',
        colour: '',
        quantity: '',
        price: ''
      });

      // Optionally, show a success message
      alert('Bag added successfully!');
    } catch (error) {
      console.error('Error adding the bag:', error);
      setError('Failed to add the bag. Please try again.');
    } finally {
      setLoading(false); // End the loading state
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm text-center text-white bg-opacity-90">
        <h2 className="text-3xl font-semibold mb-4">Add New Bag</h2>
        <p className="mb-6 text-gray-400">Please enter the bag details below!</p>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Code"
              required
            />
            <label
              htmlFor="code"
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                formData.code && 'top-1/4 text-sm'
              }`}
            >
              Code
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="colour"
              name="colour"
              value={formData.colour}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Colour"
              required
            />
            <label
              htmlFor="colour"
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                formData.colour && 'top-1/4 text-sm'
              }`}
            >
              Colour
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quantity"
              required
            />
            <label
              htmlFor="quantity"
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                formData.quantity && 'top-1/4 text-sm'
              }`}
            >
              Quantity
            </label>
          </div>

          <div className="relative">
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Price"
              required
            />
            <label
              htmlFor="price"
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                formData.price && 'top-1/4 text-sm'
              }`}
            >
              Price
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full bg-orange-600 hover:bg-orange-700 transition duration-300 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Adding...' : 'Add to Stock'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBagForm;