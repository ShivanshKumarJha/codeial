const Post = require('../models/post');
const Comment = require('../models/comment');
const postsMailer = require('../mailers/posts_mailer');
const mongoose = require('mongoose');

module.exports.create = async function(req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id
    });

    await post.save();
    post = await post.populate('user', 'name email');

    postsMailer.newPost(post);
    req.flash('success', 'Post published');
    return res.redirect('back');
  } catch (err) {
    console.error('Error in creating a post', err);
    req.flash('error', err);
    return res.redirect('back');
  }
};

module.exports.destroy = async function(req, res) {
  try {
    const post = await Post.findById(req.params.id).exec();
    if (!post) return res.redirect('back');

    if (post.user.toString() === req.user.id.toString()) {
      await post.deleteOne();
      await Comment.deleteMany({ post: req.params.id }).exec();
      req.flash('success', 'Post and assciated comments deleted!');
      return res.redirect('back');
    } else {
      req.flash('error', 'You cannot delete this post!');
      return res.redirect('back');
    }
  } catch (err) {
    req.flash('error', err);
    return res.redirect('back');
  }
};
