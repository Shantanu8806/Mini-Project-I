const twilio = require('twilio');

// Twilio configuration
const accountSid = 'your_twilio_account_sid';
const authToken = 'your_twilio_auth_token';
const twilioPhoneNumber = 'your_twilio_phone_number';

const client = twilio(accountSid, authToken);

// Controller function for sending OTP via SMS
const sendOtpViaSms = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res.json({ message: 'OTP sent successfully via SMS' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { sendOtpViaSms };
