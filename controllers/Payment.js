const crypto = require('crypto');
const Payment = require('../models/Payment');
require('dotenv').config(); // Ensure the correct path to your Payment model
const razorpay = require('razorpay');
// Create a new instance of Razorpay with your API key and secret
const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Controller function to create a new payment order
const createOrder = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  res.status(200).json({
    success: true, order
  })

};

const getRazorpayKeyController = (req, res) => {
  try {
    return res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Error during fetching Razorpay key:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const paymentVerificationController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');
    const isAuth = expectedSignature === razorpay_signature;

    if (isAuth) {
      // Assuming you have a Payment model to store payment details
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      res.redirect(`http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
      res.status(400).json({ success: false });
    }
  } catch (error) {
    console.error('Error during payment verification:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = { createOrder, getRazorpayKeyController, paymentVerificationController };

