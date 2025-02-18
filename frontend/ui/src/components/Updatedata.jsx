import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateData = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState({
    code: '',
    colour: '',
    quantity: '',
    price: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/stocks/${id}`)
      .then(response => {
        setStock(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the stock data!", error);
        setError("There was an error fetching the data.");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:4000/api/stocks/${id}`, stock)
      .then(() => {
        alert('Stock updated successfully');
        navigate('/bags-list'); // Redirect to the Baglist page
      })
      .catch(error => {
        console.error("There was an error updating the stock!", error);
        setError("There was an error updating the data.");
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Stock</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 shadow-lg rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
            Code
          </label>
          <input
            type="text"
            name="code"
            value={stock.code}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="colour">
            Colour
          </label>
          <input
            type="text"
            name="colour"
            value={stock.colour}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={stock.quantity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={stock.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Stock
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateData;
