const ParkingSpace = require('../models/parkingSpace');
const ParkingBooking = require('../models/parkingBooking');

// Controller function for owner to verify payment and update parking space status
const verifyPaymentAndSetOccupied = async (req, res) => {
  try {
    const { bookingId, paymentScreenshot } = req.body;

    // Find the booking
    const booking = await ParkingBooking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Perform payment verification logic here (e.g., compare payment screenshot)

    // For simplicity, let's assume payment verification is successful
    // You should add more sophisticated verification logic in a real-world scenario

    // Update the booking status to 'Approved'
    booking.status = 'Approved';
    await booking.save();

    // Update the parking space status to 'Occupied'
    const parkingSpace = await ParkingSpace.findById(booking.parkingSpace);
    parkingSpace.isOccupied = true;
    await parkingSpace.save();

    res.json({ message: 'Payment verified and parking space marked as occupied' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { verifyPaymentAndSetOccupied };
