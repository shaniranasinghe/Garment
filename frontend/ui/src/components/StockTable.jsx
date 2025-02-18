import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const StockTable = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/stocks')
      .then(response => {
        setStocks(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the stocks!", error);
        setError("There was an error fetching the data.");
      });
  }, []);

  // Function to handle delete action
  const handleDelete = (id) => {
    axios.delete(`http://localhost:4000/api/stocks/${id}`)
      .then(() => {
        setStocks(stocks.filter(stock => stock._id !== id));
        alert('Stock deleted successfully');
      })
      .catch(error => {
        console.error("There was an error deleting the stock!", error);
        alert('Error deleting stock');
      });
  };

  // Function to navigate to update page with stock data
  const handleUpdate = (id) => {
    navigate(`/update-stock/${id}`);
  };

  // Function to download table data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Stock Inventory", 14, 16);
    doc.setFontSize(12);

    // Define table columns and rows
    const columns = ["Code", "Colour", "Quantity", "Price"];
    const rows = stocks.map(stock => [
      stock.code,
      stock.colour,
      stock.quantity,
      `Rs. ${parseFloat(stock.price).toFixed(2)}`
    ]);

    // Generate the table with margins
    doc.autoTable({
      startY: 24,
      head: [columns],
      body: rows,
      margin: { top: 24, left: 14, right: 14 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [88, 102, 117] },
    });

    doc.save("stock-data.pdf");
  };

  // Function to filter stocks by code based on search query
  const filteredStocks = stocks.filter(stock =>
    stock.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Stock Inventory</h1>
      <input
        type="text"
        placeholder="Search by Code"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg w-full max-w-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button
        onClick={downloadPDF}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        Download PDF
      </button>
      <div id="stock-table" className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Code</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Colour</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Quantity</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Price</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {error ? (
              <tr>
                <td colSpan="5" className="py-4 px-6 text-center text-red-500">{error}</td>
              </tr>
            ) : (
              filteredStocks.length > 0 ? (
                filteredStocks.map((stock, index) => (
                  <tr key={stock._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td className="py-4 px-6 text-gray-700">{stock.code}</td>
                    <td className="py-4 px-6 text-gray-700">{stock.colour}</td>
                    <td className="py-4 px-6 text-gray-700">{stock.quantity}</td>
                    <td className="py-4 px-6 text-gray-700">Rs. {parseFloat(stock.price).toFixed(2)}</td>
                    <td className="py-4 px-6 text-gray-700">
                      <button
                        onClick={() => handleUpdate(stock._id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(stock._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 px-6 text-center text-gray-700">No stocks match your search</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
