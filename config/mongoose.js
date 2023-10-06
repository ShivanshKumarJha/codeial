const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/codeial_developement');

const db = mongoose.connection;

db.on('error', console.error.bind('Error connecting to MongoDB'));

db.once('open', function () {
  console.log('Connected to database :: MongoDB');
});

module.exports = db;
