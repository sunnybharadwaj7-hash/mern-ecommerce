// config/db.js
// Responsible for establishing connection to MongoDB using Mongoose

const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
if (dns.setServers) {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error('MONGO_URI is not defined in .env or environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.message.includes('querySrv')) {
      console.error('Check your Atlas URI, network access, DNS settings, and Atlas IP whitelist.');
    }
    process.exit(1); // exit if DB connection fails — no point running a broken server
  }
};

module.exports = connectDB;