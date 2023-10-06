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
    // Handle the error as needed
  }
};
