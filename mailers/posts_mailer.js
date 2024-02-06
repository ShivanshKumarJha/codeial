const nodemailer = require('../config/nodemailer');
const env = require('dotenv').config();
const path = require('path');

exports.newPost = post => {
  let htmlString = nodemailer.renderTemplate(
    { post: post },
    '/posts/new_post.ejs'
  );
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
          path: __dirname + '../' + '../' + '/assets/images/png/logo.png',
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
