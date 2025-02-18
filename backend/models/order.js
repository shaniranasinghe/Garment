const mongoose = require('mongoose');

const BagSchema = new mongoose.Schema({
  BagCode: {
    type: String,
    required: false,
  },
  BagColour: {
    type: String,
    required: false,
  },
  BagQuantity: {
    type: Number,
    required: false,
  },
  BagPrice: {
    type: Number,
    required: false,
  },
  BagDiscount: {
    type: Number,
    required: false,
  },
  BagTotal: {
    type: Number,
    required: false,
  },
});

const OrderSchema = new mongoose.Schema({
  Bags: [BagSchema], // Array of bag details
  CustomerName: {
    type: String,
    required: true,
  },
  InvoiceNumber: {
    type: String,
    required: true,
  },
  GrandTotal: {
    type: Number,
    required: true,
  },
  LastDiscount: {
    type: Number,
    required: true,
  },
  SubTotal: {
    type: Number,
    required: true,
  },
  BilledBy: {
    type: String,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);