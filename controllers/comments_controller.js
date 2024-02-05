const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const mongoose = require('mongoose');

module.exports.create = async function(request, response) {
  try {
    const post = await Post.findById(request.body.post).exec();

    if (post) {
      let comment = await Comment.create({
        content: request.body.content,
        post: request.body.post,
        user: request.user._id
      });

      post.comments.push(comment);

      await post.save();
      comment = await comment.populate('user', 'name email');

      console.log(comment);

      commentsMailer.newComment(comment);
      request.flash('success', 'New comment added!');
      response.redirect('/');
    }
  } catch (err) {
    request.flash('error', err);
    console.error(err);
    response.redirect('/');
  }
};

module.exports.destroy = async function(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.user === req.user.id) {
      let postId = comment.post;
      await comment.deleteOne();
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id }
      });
      req.flash('success', 'Comment deleted!');
      return res.redirect('back');
    } else {
      req.flash('error', 'You cannot delete this comment!');
      return res.redirect('back');
    }
  } catch (err) {
    // Handle errors here
    console.error(err);
    req.flash('error', err);
    return res.status(500).send('Internal Server Error');
  }
};
