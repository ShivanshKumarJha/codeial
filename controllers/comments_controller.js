const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const Like = require('../models/like');
const commentsMailer = require('../mailers/comments_mailer');
const mongoose = require('mongoose');

module.exports.create = async function (request, response) {
  try {
    const post = await Post.findById(request.body.post);
    const user = await User.findById(request.user._id);

    if (post) {
      let comment = await Comment.create({
        content: request.body.content,
        post: request.body.post,
        user: request.user._id,
      });

      post.comments.push(comment);
      user.comments.push(comment);

      await user.save();
      await post.save();
      comment = await comment.populate('user', 'name email');

      // console.log('Inside the comments controller : ', comment);
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


module.exports.destroy = async function (req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.user.toString() === req.user.id.toString()) {
      let postId = comment.post;

      // Remove the comment ID from the user's comments array
      await User.findByIdAndUpdate(comment.user, {
        $pull: { comments: comment._id },
      });

      // Delete the comment
      await comment.deleteOne();

      // Remove the comment ID from the post's comments array
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });

      // Delete associated likes for the comment
      await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' });

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

// TODO delete the posts and comments associated with the user when some post and comment is deleted