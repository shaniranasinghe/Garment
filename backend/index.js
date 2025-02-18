const express = require('express');
const dbConnection = require("./config/db");
const stockRoutes = require("./routes/stocks");
const orderRoutes = require("./routes/orders");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true, credentials: true }));

// Connect to the database
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello world!"));

// Use different routes for stocks and orders
app.use("/api/stocks", stockRoutes);
app.use("/api/orders", orderRoutes);

const PORT = 4000;

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
