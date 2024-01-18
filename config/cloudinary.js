const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dnmlmaz3l',
  api_key: '164551416158321',
  api_secret: 'zeBaNAboNedbnADJNXAA_QrJ2eE',
});

async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'Parking', // Optional: Specify a folder in Cloudinary
      // Additional options can be added based on your requirements
    });

    // console.log('Image uploaded successfully:', result);
    return result.secure_url; // Returns the secure URL of the uploaded image
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}

module.exports = uploadToCloudinary;