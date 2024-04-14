const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'chaincasabucket',
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  })
});

// Get all listings
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single listing by ID
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json('Listing not found');
    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add listings to database
router.post('/listings', upload.single('image'), async (req, res) => {
  try {
    const newListing = new Listing({
      ...req.body,
      imageUrl: req.file.location //URL provided by S3
    });
    await newListing.save();
    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Submit an offer for a listing
router.post('/:id/offer', async (req, res) => {
  try {
    // Find the listing by ID
    const listing = await Listing.findById(req.params.id);

    // If the listing doesn't exist, return a 404 error
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    // Need to implement smart contract

    // For now, let's just return a success message
    res.status(200).json({ message: 'Offer submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
