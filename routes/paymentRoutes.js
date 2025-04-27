// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypal');

// Create Order
router.post('/create', async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount,
        },
      },
    ],
  });

  try {
    const order = await client().execute(request);
    res.status(200).json({ orderID: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong during order creation');
  }
});

// Capture Order
router.post('/capture', async (req, res) => {
  const { orderID } = req.body;

  const request = new paypal.orders.OrdersCaptureRequest(orderID);
  request.requestBody({});

  try {
    const capture = await client().execute(request);
    res.status(200).json({ message: 'Payment successful!', details: capture.result });
  } catch (err) {
    console.error(err);
    res.status(500).send('Payment capture failed');
  }
});

module.exports = router;
