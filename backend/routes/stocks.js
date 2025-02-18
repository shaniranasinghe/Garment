const express = require('express');
const router = express.Router();
const Stock = require("../models/stock");

// Test route
router.get("/test", (req, res) => res.send("Stock routes working..."));

// Create new stock
router.post("/", (req, res) => {
  Stock.create(req.body)
    .then(() => res.json({ msg: "Bag added successfully..." }))
    .catch(() => res.status(400).json({ msg: "Bag addition failed..." }));
});

// Fetch all stocks
router.get("/", (req, res) => {
  Stock.find()
    .then(stocks => res.json(stocks))
    .catch(() => res.status(400).json({ msg: "Failed to fetch stocks..." }));
});

// Fetch stock by ID
router.get("/:id", (req, res) => {
  Stock.findById(req.params.id)
    .then(stock => res.json(stock))
    .catch(() => res.status(400).json({ msg: "Failed to fetch stock..." }));
});

// Fetch stock by code and color
router.get("/code/:code/colour/:colour", (req, res) => {
  Stock.findOne({ code: req.params.code, colour: req.params.colour })
    .then(stock => {
      if (!stock) {
        return res.status(404).json({ msg: "Stock not found." });
      }
      res.json(stock);
    })
    .catch(() => res.status(400).json({ msg: "Failed to fetch stock..." }));
});

// Update stock by ID
router.put("/:id", (req, res) => {
  Stock.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({ msg: "Update successful..." }))
    .catch(() => res.status(400).json({ msg: "Failed to update stock..." }));
});

// Delete stock by ID
router.delete("/:id", (req, res) => {
  Stock.findByIdAndDelete(req.params.id)
    .then(() => res.json({ msg: "Deleted successfully..." }))
    .catch(() => res.status(400).json({ msg: "Failed to delete stock..." }));
});

module.exports = router;