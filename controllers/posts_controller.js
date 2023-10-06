const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function (req, res) {
  try {
    const post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    return res.redirect('back');
  } catch (err) {
    console.error('Error in creating a post', err);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try{
    const post = await Post.findById(req.params.id).exec();
    if(!post) return res.redirect('back');

    if(post.user == req.user.id){
      await post.deleteOne();
      await Comment.deleteMany({ post: req.params.id }).exec();
      return res.redirect('back');
    } 
    else return res.redirect('back');
  } 
  catch(err){
    console.error(err);
    return res.redirect('back');
  }
};