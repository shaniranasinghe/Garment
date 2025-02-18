import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/orders')
      .then(response => {
        // Sort orders by date in descending order to show latest orders first
        const sortedOrders = response.data.sort((a, b) => new Date(b.Date) - new Date(a.Date));
        setOrders(sortedOrders);
      })
      .catch(error => {
        console.error("There was an error fetching the orders!", error);
        setError("There was an error fetching the data.");
      });
  }, []);

  // Function to navigate to order details page
  const handleShow = (invoiceNumber) => {
    navigate(`/order-details/${invoiceNumber}`);
  };

  // Function to delete an order by invoice number
  const handleDelete = (invoiceNumber) => {
    axios.delete(`http://localhost:4000/api/orders/invoice/${invoiceNumber}`)
      .then(response => {
        // Remove the deleted order from the state
        setOrders(orders.filter(order => order.InvoiceNumber !== invoiceNumber));
      })
      .catch(error => {
        console.error("There was an error deleting the order!", error);
        setError("There was an error deleting the order.");
      });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Table</h1>
      <div id="order-table" className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Invoice Number</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Customer Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Date</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan="4" className="py-4 px-6 text-center text-red-500">{error}</td>
              </tr>
            ) : (
              orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="py-4 px-6 text-gray-700">{order.InvoiceNumber}</td>
                    <td className="py-4 px-6 text-gray-700">{order.CustomerName}</td>
                    <td className="py-4 px-6 text-gray-700">{order.Date}</td>
                    <td className="py-4 px-6 text-gray-700">
                      <button
                        onClick={() => handleShow(order.InvoiceNumber)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
                      >
                        Show
                      </button>
                      <button
                        onClick={() => handleDelete(order.InvoiceNumber)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-4 px-6 text-center text-gray-700">No orders found</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderTable;