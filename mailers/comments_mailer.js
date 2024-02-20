const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const nodemailer = require('../config/nodemailer');
const env = require('dotenv').config();
const path = require('path');

exports.newComment = comment => {
  let htmlString = nodemailer.renderTemplate(
    { comment: comment },
    '/comments/new_comment.ejs'
  );
  // console.log(comment);
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
          cid: 'logo',
        },
      ],
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending mail', err);
      }
      // console.log('Message sent', info);
    }
  );
};

exports.newCommentOnPost = (comment) => {
  let htmlString = nodemailer.renderTemplate({ comment: comment }, '/comments/new_comment_on_post.ejs');
  // console.log('Inside newCommentOnPost Mailer: ', comment);

  nodemailer.transporter.sendMail(
    {
      from: process.env.SELF_EMAIL,
      to: comment.post.user.email,
      subject: 'New Comment on your Post!',
      html: htmlString,
      attachments: [
        {
          filename: 'logo.png',
          path: __dirname + '../' + '../' + '/assets/images/png/logo.png',
          cid: 'logo',
        },
      ],
    },
    (err, info) => {
      if (err) {
        console.log('Error in sending mail', err);
      }
      //console.log('Message sent', info);
    }
  );
};