const ParkingBooking = require('../models/Booking');
const ParkingSpace = require('../models/Space');

// Controller function for tenant to show all booking details to the security guard
const showBookingDetailsToSecurityGuard = async (req, res) => {
  try {
    const tenantId = req.user.userId; // Assuming the tenant's user ID is stored in the token

    // Find all bookings for the tenant
    const tenantBookings = await ParkingBooking.find({ user: tenantId });

    if (!tenantBookings || tenantBookings.length === 0) {
      return res.json({ message: 'No bookings found for the tenant' });
    }

    // Extract parking space IDs from the tenant's bookings
    const parkingSpaceIds = tenantBookings.map(booking => booking.parkingSpace);

    // Find details of the parking spaces associated with the bookings
    const parkingSpaceDetails = await ParkingSpace.find({ _id: { $in: parkingSpaceIds } });

    // Combine booking details with parking space details
    const bookingDetails = tenantBookings.map(booking => {
      const associatedSpace = parkingSpaceDetails.find(space => space._id.equals(booking.parkingSpace));
      return {
        bookingTime: booking.createdAt,
        parkingSpace: associatedSpace ? associatedSpace.name : 'Unknown',
        date: booking.startTime.toLocaleDateString(),
      };
    });

    res.json({ message: 'Booking details retrieved successfully', bookings: bookingDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { showBookingDetailsToSecurityGuard };
