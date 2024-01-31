const mongoose = require('mongoose');
const env = require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind('Error connecting to MongoDB'));

db.once('open', function () {
  console.log('Connected to database :: MongoDB');
});

module.exports = db;
