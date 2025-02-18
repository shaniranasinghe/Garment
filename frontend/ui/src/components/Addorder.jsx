import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const generateInvoiceNumber = () => {
  const now = new Date();
  return `INV${now.getFullYear()}${("0" + (now.getMonth() + 1)).slice(-2)}${("0" + now.getDate()).slice(-2)}${now
    .toTimeString()
    .slice(0, 8)
    .replace(/:/g, "")}`;
};

const OrderForm = () => {
  const [form, setForm] = useState({
    CustomerName: "",
    Date: new Date().toLocaleString(),
    InvoiceNumber: generateInvoiceNumber(),
    Bags: [],
    GrandTotal: 0,
    LastDiscount: 0,
    SubTotal: 0,
    BilledBy: "",
  });

  const [currentBag, setCurrentBag] = useState({
    BagCode: "",
    BagColour: "",
    BagQuantity: "",
    BagPrice: "",
    BagDiscount: "",
    BagTotal: 0,
  });

  const [stockError, setStockError] = useState("");

  useEffect(() => {
    const bagTotal = currentBag.BagPrice * currentBag.BagQuantity * (1 - currentBag.BagDiscount / 100);
    setCurrentBag((prevBag) => ({
      ...prevBag,
      BagTotal: bagTotal.toFixed(2),
    }));
  }, [currentBag.BagPrice, currentBag.BagQuantity, currentBag.BagDiscount]);

  useEffect(() => {
    const grandTotal = form.Bags.reduce((acc, bag) => acc + parseFloat(bag.BagTotal || 0), 0);
    const subTotal = grandTotal - grandTotal * (form.LastDiscount / 100);
    setForm((prevForm) => ({
      ...prevForm,
      GrandTotal: grandTotal.toFixed(2),
      SubTotal: subTotal.toFixed(2),
    }));
  }, [form.Bags, form.LastDiscount]);

  const addBag = () => {
    if (stockError) {
      alert(stockError);
      return;
    }
    const updatedBags = [...form.Bags, { ...currentBag }];
    setForm((prevForm) => ({
      ...prevForm,
      Bags: updatedBags,
    }));
    setCurrentBag({
      BagCode: "",
      BagColour: "",
      BagQuantity: "",
      BagPrice: "",
      BagDiscount: "",
      BagTotal: 0,
    });
  };

  const handleInputChange = debounce((e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));

    if (name === "LastDiscount") {
      const subTotal = form.GrandTotal - form.GrandTotal * (value / 100);
      setForm((prevForm) => ({
        ...prevForm,
        SubTotal: subTotal.toFixed(2),
      }));
    }
  }, 300);

  const handleBagChange = async (e) => {
    const { name, value } = e.target;
    setCurrentBag((prevBag) => ({
      ...prevBag,
      [name]: value,
    }));

    if (name === "BagCode" || name === "BagColour" || name === "BagQuantity") {
      try {
        if (currentBag.BagCode && currentBag.BagColour) {
          const response = await axios.get(`http://localhost:4000/api/stocks/code/${currentBag.BagCode}/colour/${currentBag.BagColour}`);
          const stock = response.data;

          if (name === "BagCode" || name === "BagColour") {
            setCurrentBag((prevBag) => ({
              ...prevBag,
              BagPrice: stock.price,
            }));
            setStockError("");
          }

          if (name === "BagQuantity") {
            if (value > stock.quantity) {
              setCurrentBag((prevBag) => ({
                ...prevBag,
                BagQuantity: stock.quantity,
              }));
              toast.warn(`Only ${stock.quantity} items available in stock for this color and code.`);
            }
            setStockError("");
          }
        }
      } catch (error) {
        console.error("Error fetching stock data", error);
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
          if (error.response.status === 404) {
            setStockError("Stock not found.");
          } else {
            setStockError("Error fetching stock data");
          }
        } else if (error.request) {
          console.error('Error request:', error.request);
          setStockError("No response received from server");
        } else {
          console.error('Error message:', error.message);
          setStockError("Error setting up request");
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.CustomerName || !form.BilledBy) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      await axios.post("http://localhost:4000/api/orders", form);
      alert("Order created successfully!");
      // Update stock quantities
      for (const bag of form.Bags) {
        await axios.put(`http://localhost:4000/api/stocks/${bag.BagCode}`, {
          quantity: -bag.BagQuantity,
        });
      }
      setForm({
        CustomerName: "",
        Date: new Date().toLocaleString(),
        InvoiceNumber: generateInvoiceNumber(),
        Bags: [],
        GrandTotal: 0,
        LastDiscount: 0,
        SubTotal: 0,
        BilledBy: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create order.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl text-center text-white bg-opacity-90">
        <h2 className="text-4xl font-semibold mb-4">Order Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Name Field */}
          <div className="relative">
            <input
              type="text"
              id="CustomerName"
              name="CustomerName"
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
              required
            />
            <label
              htmlFor="CustomerName"  className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 ${
                form.CustomerName ? "top-2 text-sm text-blue-500" : ""
              }`}
            >
              Customer Name
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              id="BilledBy"
              name="BilledBy"
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
              required
            />
            <label
              htmlFor="BilledBy"
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 ${
                form.BilledBy ? "top-2 text-sm text-blue-500" : ""
              }`}
            >
              Billed By
            </label>
          </div>

          {/* Bag Details */}
          <h3 className="text-3xl font-bold text-white mb-6">Bag Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="BagCode"
                value={currentBag.BagCode}
                onChange={handleBagChange}
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bag Code"
              />
              <label
                htmlFor="BagCode"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  currentBag.BagCode && "top-1/4 text-sm"
                }`}
              >
                Bag Code
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                name="BagColour"
                value={currentBag.BagColour}
                onChange={handleBagChange}
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bag Colour"
              />
              <label
                htmlFor="BagColour"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  currentBag.BagColour && "top-1/4 text-sm"
                }`}
              >
                Bag Colour
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="BagQuantity"
                value={currentBag.BagQuantity}
                onChange={handleBagChange}
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bag Quantity"
              />
              <label
                htmlFor="BagQuantity"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  currentBag.BagQuantity && "top-1/4 text-sm"
                }`}
              >
                Bag Quantity
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="BagPrice"
                value={currentBag.BagPrice}
                onChange={handleBagChange}
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bag Price"
                readOnly
              />
              <label
                htmlFor="BagPrice"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  currentBag.BagPrice && "top-1/4 text-sm"
                }`}
              >
                Bag Price
              </label>
            </div>
            <div className="relative">
              <input
                type="number"
                name="BagDiscount"
                value={currentBag.BagDiscount}
                onChange={handleBagChange}
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bag Discount"
              />
              <label
                htmlFor="BagDiscount"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  currentBag.BagDiscount && "top-1/4 text-sm"
                }`}
              >
                Bag Discount
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={currentBag.BagTotal}
                readOnly
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bag Total"
              />
              <label
                htmlFor="BagTotal"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 top-1/4 text-sm"
              >
                Bag Total
              </label>
            </div>
          </div>
          {stockError && <p className="text-red-500">{stockError}</p>}
          <button
            type="button"
            onClick={addBag}
            className="block mt-4 w-full py-3 rounded-full bg-orange-600 hover:bg-orange-700 transition duration-300"
          >
            Add Bag
          </button>

          {/* Grand Total and Subtotal */}
          <div className="mt-10 grid grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="number"
                name="LastDiscount"
                onChange={handleInputChange}
                value={form.LastDiscount}
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Last Discount"
              />
              <label
                htmlFor="LastDiscount"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 ${
                  form.LastDiscount && "top-1/4 text-sm"
                }`}
              >
                Last Discount
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={`Subtotal: ${form.SubTotal}`}
                readOnly
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="SubTotal"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 top-1/4 text-sm"
              >
                Subtotal
              </label>
            </div>
            <div className="relative">
              <input
                type="text"
                value={`Grand Total: ${form.GrandTotal}`}
                readOnly
                className="w-full px-4 py-3 bg-transparent border border-blue-500 rounded-full text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="GrandTotal"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-300 top-1/4 text-sm"
              >
                Grand Total
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="block w-full py-3 rounded-full bg-green-600 hover:bg-green-700 text-white font-bold transition duration-300"
          >
            Submit Order
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default OrderForm;