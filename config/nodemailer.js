const nodemailer = require('nodemailer');
const env = require('dotenv').config();
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: true,
  auth: {
    user: process.env.SELF_EMAIL,
    pass: process.env.SELF_PASS,
  },
});

const renderTemplate = async (data, relativePath) => {
  try {
    const mailHTML = await new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
          if (err) {
            console.log('error in rendering template');
            reject(err);
          }
          resolve(template);
        },
      );
    });
    return mailHTML;
  } catch (error) {
    console.error('Error rendering template:', error);
    throw error;
  }
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
