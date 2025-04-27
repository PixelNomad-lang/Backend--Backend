// paypal.js
const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  return new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

module.exports = { client };
