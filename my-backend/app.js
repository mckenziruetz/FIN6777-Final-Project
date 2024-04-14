require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const listingsRouter = require('./routes/listings');
const usersRouter = require('./routes/users'); // make sure this exports the router correctly
const authMiddleware = require('./middleware/authMiddleware');
const checkRoleMiddleware = require('./middleware/checkRoleMiddleware');

// MongoDB setup
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// API routes
app.use('/api/listings', listingsRouter);
app.use('/api/users', usersRouter); // Adjusted the route for users

// Serve static files after API routes
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;