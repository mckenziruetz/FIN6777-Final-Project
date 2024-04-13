var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const listingsRouter = require('./routes/listings');

// MongoDB setup
const mongoDB = 'mongodb+srv://mckenziruetz:jpGybvTMTfZrAkCd@cluster0.fwunarh.mongodb.net/';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express(); // Keep this declaration

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/listings', listingsRouter);

module.exports = app;
