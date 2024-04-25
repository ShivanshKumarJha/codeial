const nodemailer = require('../config/nodemailer');
const env = require('dotenv').config();
const path = require('path');

exports.newComment = async (comment) => {
  try {
    const htmlString = await nodemailer.renderTemplate(
      { comment: comment },
      '/comments/new_comment.ejs'
    );

    await nodemailer.transporter.sendMail({
      from: process.env.SELF_EMAIL,
      to: comment.user.email,
      subject: 'New Comment Published',
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

exports.newCommentOnPost = async (comment) => {
  try {
    const htmlString = await nodemailer.renderTemplate(
      { comment: comment },
      '/comments/new_comment_on_post.ejs'
    );

    await nodemailer.transporter.sendMail({
      from: process.env.SELF_EMAIL,
      to: comment.post.user.email,
      subject: 'New Comment on your Post!',
      html: htmlString,
      attachments: [
        {
          filename: 'logo.png',
          path: path.join(__dirname, '../', '../', '/assets/images/png/logo.png'),
          cid: 'logo'
        }
      ]
    });
  } catch (err) {
    console.log('Error in sending mail', err);
    throw err;
  }
};
