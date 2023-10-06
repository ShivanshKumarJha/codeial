const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (request, response) {
  try {
    const post = await Post.findById(request.body.post).exec(); // Use .exec() to return a promise

    if (post) {
      const comment = await Comment.create({
        content: request.body.content,
        post: request.body.post,
        user: request.user._id,
      });

      post.comments.push(comment);
      await post.save();
      response.redirect('/');
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const comment = await Comment.findById(req.params.id);

    if (comment.user == req.user.id) {
      let postId = comment.post;
      await comment.deleteOne();
      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      });
      return res.redirect('back');
    } else {
      return res.redirect('back');
    }
  } catch (err) {
    // Handle errors here
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};
