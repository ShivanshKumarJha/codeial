const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDirectory,
});

// Environment configuration
const development = {
  name: 'development',
  asset_path: './assets',
  session_cookie_key: 'codeial',
  db: 'codeial_development',
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: 'http://localhost:8000/users/auth/google/callback',
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  socket_url: 'http://localhost:8000',
};

const production = {
  name: 'production',
  asset_path: process.env.CODEIAL_ASSET_PATH || './public/assets',
  session_cookie_key: process.env.SECRET,
  db: process.env.MONGODB_URI,
  smtp: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.CODEIAL_GMAIL_USERNAME,
      pass: process.env.CODEIAL_GMAIL_PASSWORD,
    },
  },
  google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
  google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
  google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.CODEIAL_JWT_SECRET,
  socket_url: process.env.RENDER_EXTERNAL_URL || 'https://your-domain.com',
};

const environment =
  process.env.NODE_ENV === 'production' ? production : development;

module.exports = {
  accessLogStream,
  ...environment,
};
