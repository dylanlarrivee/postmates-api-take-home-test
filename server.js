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


console.log("running in ", process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
   // res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

let server = app.listen(PORT, function () {
  console.log(`Server is starting at ${PORT}`);
});

module.exports = server

