const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const postsMailer = require('../mailers/posts_mailer');
const mongoose = require('mongoose');

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });

    const userId = await User.findById(req.user._id);
    // console.log(userId);
    userId.posts.push(post);
    await userId.save();

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

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id).exec();
    if (!post) return res.redirect('back');

    if (post.user.toString() === req.user.id.toString()) {
      // delete the associated likes for the post and all its comments likes too
      await Like.deleteMany({ likeable: post, onModel: 'Post' });
      await Like.deleteMany({ _id: { $in: post.comments } });

      // Remove the post from the user's posts array
      await User.updateOne({ _id: post.user }, { $pull: { posts: post._id } });

      // Delete the post
      await post.deleteOne();

      // Delete all the comments associated with the post
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

module.exports.getPosts = async function (req, res) {
  console.log('Entered the controller');

  try {
    const postByUser = await User.findById(req.params.id)
      .populate('comments')
      .populate({
        path: 'posts',
        populate: {
          path: 'comments',
        },
      });
    const post = postByUser.posts;
    const comments = postByUser.comments;

    return res.render('all_posts', {
      title: 'Codeial | Posts',
      posts: post,
      user: postByUser,
      comments: comments,
    });
  } catch (err) {
    console.log('***Error*** ', err);
    res.redirect('back');
  }
};
