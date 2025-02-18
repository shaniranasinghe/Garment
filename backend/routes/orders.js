const express = require('express');
const router = express.Router();
const Order = require("../models/order");

// Test route
router.get("/test", (req, res) => res.send("Order routes working..."));

// Create new order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ msg: "Order added successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Order addition failed." });
  }
});

// Fetch all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Failed to fetch orders." });
  }
});

// Fetch a single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: "Order not found." });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Failed to fetch order." });
  }
});

// Fetch a single order by InvoiceNumber
router.get("/invoice/:invoiceNumber", async (req, res) => {
  try {
    const order = await Order.findOne({ InvoiceNumber: req.params.invoiceNumber });
    if (!order) return res.status(404).json({ msg: "Order not found." });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Failed to fetch order." });
  }
});

// Update an order by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) return res.status(404).json({ msg: "Order not found." });
    res.json({ msg: "Update successful.", updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Failed to update order." });
  }
});

// Delete an order by ID
router.delete("/invoice/:invoiceNumber", async (req, res) => {
  try {
    const deletedOrder = await Order.findOneAndDelete({ InvoiceNumber: req.params.invoiceNumber });
    if (!deletedOrder) return res.status(404).json({ msg: "Order not found." });
    res.json({ msg: "Deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Failed to delete order." });
  }
});

module.exports = router;