import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ShowOrder = () => {
  const { InvoiceNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching order for invoice number:", InvoiceNumber);
    if (InvoiceNumber) {
      axios.get(`http://localhost:4000/api/orders/invoice/${InvoiceNumber}`)
        .then(response => {
          console.log("Order data:", response.data);
          setOrder(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the order details!", error);
          setError("There was an error fetching the data.");
        });
    }
  }, [InvoiceNumber]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Invoice Number: ${order.InvoiceNumber}`, 10, 10);
    doc.text(`Customer Name: ${order.CustomerName}`, 10, 20);
    doc.text(`Date: ${order.Date}`, 10, 30);

    const tableColumn = ["Bag Code", "Bag Colour", "Bag Quantity", "Bag Price", "Bag Discount", "Bag Total"];
    const tableRows = [];

    order.Bags.forEach(bag => {
      const bagData = [
        bag.BagCode,
        bag.BagColour,
        bag.BagQuantity,
        bag.BagPrice,
        bag.BagDiscount,
        bag.BagTotal
      ];
      tableRows.push(bagData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 40 });

    doc.text(`Billed By: ${order.BilledBy}`, 10, doc.autoTable.previous.finalY + 10);
    doc.text(`Grand Total: ${order.GrandTotal}`, 10, doc.autoTable.previous.finalY + 20);
    doc.text(`Last Discount: ${order.LastDiscount}`, 10, doc.autoTable.previous.finalY + 30);
    doc.text(`Sub Total: ${order.SubTotal}`, 10, doc.autoTable.previous.finalY + 40);

    doc.save('order_details.pdf');
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Details</h1>
      <button
        onClick={downloadPDF}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        style={{ alignSelf: 'flex-end' }}
      >
        Download PDF
      </button>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Invoice Number: {order.InvoiceNumber}</h2>
          <p>Customer Name: {order.CustomerName}</p>
          <p>Date: {order.Date}</p>
        </div>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Bag Code</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Bag Colour</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Bag Quantity</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Bag Price</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Bag Discount</th>
              <th className="py-3 px-6 text-left text-xs font-medium uppercase tracking-wider">Bag Total</th>
            </tr>
          </thead>
          <tbody>
            {order.Bags.map((bag, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                <td className="py-4 px-6 text-gray-700">{bag.BagCode}</td>
                <td className="py-4 px-6 text-gray-700">{bag.BagColour}</td>
                <td className="py-4 px-6 text-gray-700">{bag.BagQuantity}</td>
                <td className="py-4 px-6 text-gray-700">{bag.BagPrice}</td>
                <td className="py-4 px-6 text-gray-700">{bag.BagDiscount}</td>
                <td className="py-4 px-6 text-gray-700">{bag.BagTotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-8">
          <div>
            <p className="font-bold">Billed By: {order.BilledBy}</p>
          </div>
          <div className="text-right">
            <p>Grand Total: {order.GrandTotal}</p>
            <p>Last Discount: {order.LastDiscount}</p>
            <p>Sub Total: {order.SubTotal}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowOrder;