"use strict";
const express = require("express");
const router = express.Router();
const axios = require('axios');
const qs = require('querystring')

require('dotenv').config()

const POSTMATES_SANDBOX_API_KEY = process.env.POSTMATES_SANDBOX_API_KEY; 
const POSTMATES_CUSTOMER_ID = process.env.POSTMATES_CUSTOMER_ID; 

router.post("/create-delivery-quote", (req, res) => {
  const order_dropoff_address = req.body.dropoff.address;
  const order_pickup_address = req.body.pickup.address;
  let payload = {
        dropoff_address: order_dropoff_address,
        pickup_address: order_pickup_address
  };

  axios({
    url:
      "https://api.postmates.com/v1/customers/" +
      POSTMATES_CUSTOMER_ID +
      "/delivery_quotes",
    method: "POST",
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    auth: {
      username: POSTMATES_SANDBOX_API_KEY,
      password: "",
    },
    data: qs.stringify(payload),
  })
    .then((data) => {
       console.log("data", data.data);
       let deliveryData = data.data
      res.status(200).send({ deliveryData });
    })
    .catch((error) => {
        console.log("error", error)
        let errorData = error.response.data
        let errorCode = error.response.status
        res.status(errorCode).send({ errorData });
    });
});

router.post("/create-delivery", (req, res) => {
    let orderItems = req.body.contents
    let payload = {
          dropoff_address: req.body.dropoff.address,
          dropoff_name: req.body.dropoff.name,
          dropoff_phone_number: req.body.dropoff.phone_number,
          pickup_address: req.body.pickup.address,
          pickup_name: req.body.pickup.name,
          pickup_phone_number: req.body.pickup.phone_number,
          manifest: req.body.manifest,
           manifest_items: JSON.stringify(orderItems),
          quote_id: req.body.quote_id,
    };
    axios({
      url:
        "https://api.postmates.com/v1/customers/" +
        POSTMATES_CUSTOMER_ID +
        "/deliveries",
      method: "POST",
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      auth: {
        username: POSTMATES_SANDBOX_API_KEY,
        password: "",
      },
      data: qs.stringify(payload),
    })
      .then((data) => {
         console.log("data", data.data);
         let deliveryData = data.data
        res.status(200).send({ deliveryData });
      })
      .catch((error) => {
          console.log("error", error)
          let errorData = error.response.data
          let errorCode = error.response.status
          res.status(errorCode).send({ errorData });
      });
  });

  router.post("/under-2hour-delivery", (req, res) => {
  let orderItems = req.body.contents
  let payload = {
          dropoff_address: req.body.dropoff.address,
          dropoff_name: req.body.dropoff.name,
          dropoff_phone_number: req.body.dropoff.phone_number,
          pickup_address: req.body.pickup.address,
          pickup_name: req.body.pickup.name,
          pickup_phone_number: req.body.pickup.phone_number,
          manifest: req.body.manifest,
          manifest_items: JSON.stringify(orderItems),
          quote_id: "",
    };

  axios({
    url:
      "https://api.postmates.com/v1/customers/" +
      POSTMATES_CUSTOMER_ID +
      "/delivery_quotes",
    method: "POST",
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    auth: {
      username: POSTMATES_SANDBOX_API_KEY,
      password: "",
    },
    data: qs.stringify(payload),
  })
    .then((data) => {
       //console.log("data", data.data);
       let quoteDeliveryData = data.data
      // res.status(200).send({ quoteDeliveryData });
      // TODO add logic to check if under 2 hours
      payload.quote_id = quoteDeliveryData.id
      console.log("payload", payload)
      axios({
        url:
          "https://api.postmates.com/v1/customers/" +
          POSTMATES_CUSTOMER_ID +
          "/deliveries",
        method: "POST",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        auth: {
          username: POSTMATES_SANDBOX_API_KEY,
          password: "",
        },
        data: qs.stringify(payload),
      })
        .then((data) => {
           console.log("data", data.data);
           let deliveryData = data.data
          res.status(200).send({ deliveryData });
        })
        .catch((error) => {
            console.log("error2", error)
            let errorData = error.response.data
            let errorCode = error.response.status
            res.status(errorCode).send({ errorData });
        });
    })
    .catch((error) => {
        console.log("error", error)
        let errorData = error.response.data
        let errorCode = error.response.status
        res.status(errorCode).send({ errorData });
    });
  });

module.exports = router;