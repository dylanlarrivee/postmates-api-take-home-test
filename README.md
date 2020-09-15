# Postmates API Take Home Test

This is a take home test I built out as part of a take home test assignment for a Solutions Engineer position at Postmates.

## Problem
Build a system that can take an order and create a delivery using the Postmates API. Documentation can be found here and you can create a developer account here.

The design of this system is quite open-ended, but this could be a HTTP server, a web form, a mobile app, or something else entirely. We are interested in a functional product that fits in with the given scenario.


## My Solution
I decided to build a RESTful backend API using Node and Express that could take in order info and create a delivery by making a call to the Postmates API. This would allow a frontend application to retrieve data at different point of the checkout process that a customer is at.

I decided to do two separate routes instead of one all in one route because I have seen it handled that way in recent orders I have done where I was able to see the fees and delivery times before finalizing my order.

Based on some recent food deliveries I have done I see this working something like this:

1. The customer creates and order on the frontend application and is ready to checkout so they enter in their address to see how much the order total will cost with delivery.
2. The frontend application makes a call to the /create-delivery-quote route with the order details to get the quote_id and then some additional delivery details (fee, drop off ete, etc..) that can be displayed to the customer for them to submit or cancel their order based on these details. The frontend application can look at the details returned around the delivery time and let the customer know if it will qualify for 2 hour delivery. Since the quote is only valid for 5 minutes the customer would need to choose to accept the delivery in that 5 minutes or else make a new call to get a new quote if it is outside of the 5 minutes.
3. If the customer wants to proceed with the order then the frontend will make a call to to the /create-delivery route with the original order info and then the quote_id that was obtained from the /create-delivery-quote call.
4. This will return more information that can be passed along to the user by the frontend application to either let them know that the delivery was created successfully or that there was some sort of error.

## Running the code on your local machine
Note: You will need node installed on your computer.
1. Clone the repository to a local folder.
2. Run `npm install`
3. cd into the folder.
4. create a .env folder with your secret environment variables
- POSTMATES_SANDBOX_API_KEY={Your API Key}
- POSTMATES_CUSTOMER_ID={Your customer ID}
5. Run `npm start` to start up the server.
6. Use [this](https://www.getpostman.com/collections/27a764402f1e37e97642) postman collection to test the routes since there is no frontend application built out yet.

## Notes
- While I was reading the documentation I noticed that one of the links was leading to a 404 page: [https://blog.postmates.com/testing-the-postmates-api-with-postman/](https://blog.postmates.com/testing-the-postmates-api-with-postman/)

## Routes
1. /create-delivery-quote
This route takes an order json payload with the pickup, drop off and contents data and returns delivery data with the quote id that can be used to create a delivery.

### Example Order Body:
```json
{
  "uuid": "d69c3dc2-fa19-4686-a5d5-c07acc211b77",
  "pickup": {
    "name": "Zocks SF",
    "address": "425 Market St, San Francisco, CA 94105",
    "phone_number": "4155555555"
  },
  "dropoff": {
    "name": "Joe Johnson",
    "address": "201 3rd St, San Francisco, CA 94103",
    "phone_number": "4156666666"
  },
  "contents": [
    {
      "name": "Zebra Socks",
      "quantity": 2,
      "size": "small"
    },
    {
      "name": "Leopard Socks",
      "quantity": 10,
      "size": "small"
    }
  ]
}
```
### Example Success Return Response:
```json
{
    "deliveryData": {
        "kind": "delivery_quote",
        "id": "dqt_6QRhX3Djpwaihg",
        "created": "2020-09-15T18:16:09Z",
        "expires": "2020-09-15T18:21:09Z",
        "fee": 643,
        "currency": "USD",
        "currency_type": "USD",
        "dropoff_eta": "2020-09-15T18:53:09Z",
        "duration": 37,
        "pickup_duration": 7
    }
}
```

2. /create-delivery
This route takes an order json payload similar to the one used in the /create-delivery-quote route but with the addition of order id and manifest and returns delivery data that can be displayed to the customer to let them know their delivery details or any errors that might have occurred. 

### Example Order Body:
```json
{
  "uuid": "d69c3dc2-fa19-4686-a5d5-c07acc211b77",
  "pickup": {
    "name": "Zocks SF",
    "address": "425 Market St, San Francisco, CA 94105",
    "phone_number": "4155555555"
  },
  "dropoff": {
    "name": "Joe Johnson",
    "address": "201 3rd St, San Francisco, CA 94103",
    "phone_number": "4156666666"
  },
  "manifest": "socks",
  "contents": [
    {
      "name": "Zebra Socks",
      "quantity": 2,
      "size": "small"
    },
    {
      "name": "Leopard Socks",
      "quantity": 10,
      "size": "small"
    }
  ],
  "quote_id": "dqt_6QRhX3Djpwaihg"
}
```

### Example Success Return Response:
```json
{
    "deliveryData": {
        "id": "del_Mq33xsjfcZMP7k",
        "quote_id": "dqt_6QRhX3Djpwaihg",
        "status": "pending",
        "complete": false,
        "kind": "delivery",
        "pickup": {
            "name": "Zocks SF",
            "phone_number": "+14155555555",
            "address": "425 Market Street",
            "detailed_address": {
                "street_address_1": "425 Market Street",
                "street_address_2": "",
                "city": "San Francisco",
                "state": "CA",
                "zip_code": "94105",
                "country": "US",
                "sublocality_level_1": ""
            },
            "notes": "",
            "location": {
                "lat": 37.79119130000001,
                "lng": -122.3983658
            },
            "verification": null
        },
        "dropoff": {
            "name": "Joe Johnson",
            "phone_number": "+14156666666",
            "address": "201 3rd Street",
            "detailed_address": {
                "street_address_1": "201 3rd Street",
                "street_address_2": "",
                "city": "San Francisco",
                "state": "CA",
                "zip_code": "94103",
                "country": "US",
                "sublocality_level_1": ""
            },
            "notes": "",
            "location": {
                "lat": 37.7850203,
                "lng": -122.3999147
            },
            "verification": null
        },
        "manifest": {
            "reference": "",
            "description": "socks"
        },
        "manifest_items": [
            {
                "name": "Leopard Socks",
                "quantity": "10",
                "size": "small"
            },
            {
                "name": "Zebra Socks",
                "quantity": "2",
                "size": "small"
            }
        ],
        "created": "2020-09-15T18:16:24Z",
        "updated": "2020-09-15T18:16:24Z",
        "pickup_ready": "2020-09-15T18:23:10Z",
        "pickup_deadline": "2020-09-15T18:36:10Z",
        "dropoff_ready": "2020-09-15T18:23:10Z",
        "dropoff_deadline": "2020-09-15T18:54:00Z",
        "pickup_eta": "2020-09-15T18:30:00Z",
        "dropoff_eta": "2020-09-15T18:40:00Z",
        "related_deliveries": [],
        "fee": 642,
        "currency": "usd",
        "tip": null,
        "dropoff_identifier": "",
        "tracking_url": "https://postmates.com/track/del_Mq33xsjfcZMP7k",
        "undeliverable_action": null,
        "courier_imminent": false,
        "courier": null,
        "live_mode": false,
        "undeliverable_reason": null,
        "uuid": "",
        "fences": []
    }
}
```