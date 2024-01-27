const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function (req, res) {
  const posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    })
    .exec();

  return res.status(200).json({
    message: 'List of posts',
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    // if (post.user == req.user.id) {
      await Comment.deleteMany({ post: req.params.id });

      return res.status(200).json({
        message: 'Post and associated comments deleted successfully!',
      });
    // } else {
    //   req.flash('error', 'You cannot delete this post!');
    //   return res.redirect('back');
    // }
  } catch (err) {
    console.log('******', err);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
