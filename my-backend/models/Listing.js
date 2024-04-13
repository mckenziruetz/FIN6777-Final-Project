const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{ 
    type: String, 
    required: true 
  }], // Array of image URLs
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // Potentially add more fields
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
