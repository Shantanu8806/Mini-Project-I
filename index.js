const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import your route files
const profielRoutes = require('./routes/profileroutes');
const parkingSpaceRoutes = require('./routes/spaceroutes');
const bookingRoutes = require('./routes/bookingroutes');
const mapboxRoutes = require('./routes/Mapboxroute');
require('dotenv').config();
const app = express();

// Middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin 
  credentials: true, // Allow sending cookies and other credentials
}));

app.use(express.json()); // Add parentheses here
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb+srv://kantakshantanu:8N06mLSB1K4nCNxV@cluster0.obfarla.mongodb.net/ParkItDatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.error("Error while connecting to the database", err);
    process.exit(1);
  });


// Mount your routes
app.use('/api/v1/auth', profielRoutes);
app.use('/api/v1/parking-space', parkingSpaceRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/mapbox', mapboxRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
