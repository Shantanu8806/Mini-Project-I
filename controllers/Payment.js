const Razorpay = require('razorpay');
require('dotenv').config();
const Payment = require('./Payment'); // Ensure the correct path to your Payment model

// Create a new instance of Razorpay with your API key and secret
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Controller function to create a new payment order
const createOrder = async (req, res) => {
  const { amount, currency, receipt, notes } = req.body;

  try {
    // Create a new order using the Razorpay API
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
      notes,
    });

    // Save the payment details in the database
    const newPayment = new Payment({
      orderId: order.id,
      paymentId: '', // You may need to populate this based on Razorpay response
      signature: '', // You may need to populate this based on Razorpay response
      amount: amount,
      currency: currency,
    });
    await newPayment.save();

    // Send the order ID back to the client
    res.json({ orderId: order.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createOrder };
