"use strict";
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

//set up port constants --
const PORT = (process.env.PORT || 8080);

const deliveryRoutes = require("./routes/deliveryRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logger
app.use(morgan("tiny"));

// Body parser
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

app.use("/api", deliveryRoutes);

let server = app.listen(PORT, function () {
  console.log(`Server is starting at ${PORT}`);
});

module.exports = server

