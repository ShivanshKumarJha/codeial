const nodemailer = require('../config/nodemailer');
const env = require('dotenv').config();
const path = require('path');

exports.newComment = comment => {
  let htmlString = nodemailer.renderTemplate(
    { comment: comment },
    '/comments/new_comment.ejs'
  );

  nodemailer.transporter.sendMail(
    {
      from: process.env.SELF_EMAIL,
      to: comment.user.email,
      subject: 'New Comment Published',
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
