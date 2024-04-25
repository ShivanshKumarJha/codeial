const nodemailer = require('../config/nodemailer');
const env = require('dotenv').config();
const path = require('path');

exports.newPost = async (post) => {
  try {
    const htmlString = await nodemailer.renderTemplate(
      { post: post },
      '/posts/new_post.ejs'
    );

    await nodemailer.transporter.sendMail({
      from: process.env.SELF_EMAIL,
      to: post.user.email,
      subject: 'New Post Published',
      html: htmlString,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../', '/assets/images/png/logo.png'),
          cid: 'logo'
        }
      ]
    });
  } catch (err) {
    console.log('Error in sending mail', err);
    throw err;
  }
};

exports.resetPassword = async (user) => {
  try {
    const htmlString = await nodemailer.renderTemplate(
      { user: user },
      '/posts/password_reset.ejs'
    );

    await nodemailer.transporter.sendMail({
      from: process.env.SELF_EMAIL,
      to: user.email,
      subject: 'Reset Your Password',
      html: htmlString,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../', '/assets/images/png/logo.png'),
          cid: 'logo'
        }
      ]
    });
  } catch (err) {
    console.log('Error in sending mail', err);
    throw err;
  }
};

exports.signupSuccess = async (user) => {
  try {
    const htmlString = await nodemailer.renderTemplate(
      { user: user },
      '/posts/signup_successful.ejs'
    );

    await nodemailer.transporter.sendMail({
      from: process.env.SELF_EMAIL,
      to: user.email,
      subject: 'Welcome to Codeial!',
      html: htmlString,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../', '/assets/images/png/logo.png'),
          cid: 'logo'
        }
      ]
    });
  } catch (err) {
    console.log('Error in sending mail', err);
    throw err;
  }
};
