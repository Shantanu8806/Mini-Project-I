const nodemailer = require('nodemailer');

// Nodemailer configuration
const emailTransporter = nodemailer.createTransport({
  service: 'your_email_service_provider', // e.g., 'gmail'
  auth: {
    user: 'your_email@example.com',
    pass: 'your_email_password',
  },
});

// Controller function for sending OTP via Email
const sendOtpViaEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Send OTP via Nodemailer
    await emailTransporter.sendMail({
      from: 'your_email@example.com',
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is: ${otp}`,
    });

    res.json({ message: 'OTP sent successfully via email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { sendOtpViaEmail };
