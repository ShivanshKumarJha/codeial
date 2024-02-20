const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function (request, response) {
  try {
    // Populate the user of each post
    const posts = await Post.find({})
      .populate('user')
      .populate({
        path: 'comments',
        populate: [{ path: 'user' }, { path: 'likes' }],
      })
      .populate('likes')
      .exec();

    const users = await User.find({}).exec();
    // console.log(users, posts);

    return response.render('home', {
      title: 'Codeial | Home',
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
};
