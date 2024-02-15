const nodemailer = require('../config/nodemailer');
const env = require('dotenv').config();
const path = require('path');

exports.newPost = post => {
  let htmlString = nodemailer.renderTemplate(
    { post: post },
    '/posts/new_post.ejs'
  );
  console.log(post);
  nodemailer.transporter.sendMail(
    {
      from: process.env.SELF_EMAIL,
      to: post.user.email,
      subject: 'New Post Published',
      html: htmlString,
      // To attach the logo of the company
      attachments: [
        {
          filename: 'logo.png',
          filePath: __dirname + '../' + '../' + '/assets/images/png/logo.png',
          cid: 'logo'
        }
      ]
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending mail', err);
      }
      // console.log('Message sent', info);
    }
  );
};

exports.resetPassword = (user) => {
  let htmlString = nodemailer.renderTemplate({ user: user }, '/posts/password_reset.ejs');
  console.log('Inside resetPassword Mailer');
  console.log(user);
  nodemailer.transporter.sendMail
  (
    {
      from: process.env.SELF_EMAIL,
      to: user.email,
      subject: 'Reset Your Password',
      html: htmlString,
      attachments: [
        {
          filename: 'logo.png',
          filePath: __dirname + '../' + '../' + '/assets/images/png/logo.png',
          cid: 'logo'
        }
      ]
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending mail', err);
      }
      //console.log('Message sent', info);
    }
  );
};


exports.signupSuccess = (user) => {
  let htmlString = nodemailer.renderTemplate({ user: user }, '/posts/signup_successful.ejs');
  // console.log('Inside signupSuccessful Mailer');

  nodemailer.transporter.sendMail
  (
    {
      from: process.env.SELF_EMAIL,
      to: user.email,
      subject: 'Welcome to Codeial!',
      html: htmlString,
      attachments: [
        {
          filename: 'logo.png',
          filePath: __dirname + '../' + '../' + '/assets/images/png/logo.png',
          cid: 'logo'
        }
      ]
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending mail', err);
      }
      //console.log('Message sent', info);
    }
  );
};
