const Post = require('../models/post');
const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.home = async function(request, response) {
  try {
    const loggedInUserId = request.user;
    // Populate the user of each post
    const posts = await Post.find({})
      .populate('user')
      .populate({
        path: 'comments',
        populate: [{ path: 'user' }, { path: 'likes' }]
      })
      .populate('likes')
      .exec();

    const users = await User.find({}).exec();
    const friendlist = await Friendship.find({ from_user: loggedInUserId })
      .populate({
        path: 'to_user',
        populate: {
          path: 'name'
        }
      });
    // console.log(loggedInUserId);
    return response.render('home', {
      title: 'Codeial | Home',
      posts: posts,
      all_users: users,
      all_friends: friendlist
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
};
