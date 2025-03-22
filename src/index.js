const stripe = require('stripe')('sk_test_51R3h6KCI58R9VXqMQrWiZVjjD8UVb9shcCKq8X89RUsr1IM5XL8TlQmXFZ1v21xcbUqPm8oHl7JfQtDlxzG4hNHJ00g11yYmdr');
const express = require('express');
const serverless = require('serverless-http');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:5173';

app.post('/create-checkout-session', async (req, res) => {
  console.log('Received request for /create-checkout-session');
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: 'price_1R3hkTCI58R9VXqMaWjIwCx3',
          quantity: 1,
        },
      ],
      mode: 'subscription', // Changed from 'payment' to 'subscription'
      return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    console.log('Created session:', session);
    res.send({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Error creating checkout session:', error); // Debug message
    res.status(500).send({ error: 'Failed to create checkout session' });
  }
});

app.get('/session-status', async (req, res) => {
  console.log('Received request for /session-status');
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  console.log('Retrieved session:', session);
  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

module.exports.handler = serverless(app);
