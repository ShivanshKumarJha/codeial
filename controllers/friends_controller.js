const User = require('../models/user');
const Friendship = require('../models/friendship');
const res = require('express/lib/response');

// Send a friend request
module.exports.addFriend = async function(request, response) {
  try {
    // console.log('inside friend controller');
    const fromUserId = request.user.id;
    const toUserId = request.query.toUser;

    let existingFriend = await Friendship.findOne({
      from_user: fromUserId,
      to_user: toUserId
    });

    if (!existingFriend) {
      // create a new friendship request
      const friendship = new Friendship({
        from_user: fromUserId,
        to_user: toUserId
      });

      // save the friendship request
      await friendship.save();

      // add a friend to friendlist of the from_user
      const fromUser = await User.findById(fromUserId);
      fromUser.friendships.push(friendship._id);

      const toUser = await User.findById(toUserId);
      toUser.friendships.push(friendship._id);

      await Promise.all([fromUser.save(), toUser.save()]);
      console.log('Added the friend');

      response.redirect('back');
    } else {
      console.log('existing friend');
      return response.status(400).json({ message: 'This user is already your friend. Do you want to remove them?' });
    }
  } catch (err) {
    return response.status(500).json({ error: `Something went wrong ${err}` });
  }
};


module.exports.removeFriend = async function(request, response) {
  try {
    // console.log('Inside remove friend module');
    const friendDelete = await Friendship.findById(request.params.id);

    if (friendDelete) {
      await Friendship.findByIdAndRemove(friendDelete);
      const userWithFriend = await User.find({ friendships: request.params.id });

      for (const user of userWithFriend) {
        user.friendships.pull(request.params.id);
        await user.save();
      }

      console.log('Removed the friend');
      response.redirect('back');
    }
  } catch (error) {
    console.log('error in delete friend', error);
  }
};


module.exports.getAllFriends = async function(req, res) {
  console.log('Inside the all friends controller');
  try {
    const userId = req.params.id;

    // Find the user by ID and populate the friendships
    const user = await User.findById(userId).populate({
      path: 'friendships',
      match: { from_user: userId },
      populate: {
        path: 'to_user',
        populate: [
          { path: 'posts' },
          { path: 'comments' },
          { path: 'likes' },
          { path: 'friendships', match: { from_user: userId } }
        ]
      }
    });

    // Extract the friends from the populated friendships
    const friends = user.friendships.map(friendship => friendship.to_user);

    // Create an array to hold friend-post associations
    const friendPosts = [];

    // Iterate over each friend to extract their posts, likes, and comments count
    for (const friend of friends) {
      const postsCount = friend.posts.length;
      let likesCount = 0;
      let commentsCount = 0;

      // Calculate likes and comments count for each post of the friend
      for (const post of friend.posts) {
        likesCount += post.likes.length;
        commentsCount += post.comments.length;
      }

      friendPosts.push({
        friend: friend,
        postsCount: postsCount,
        likesCount: likesCount,
        commentsCount: commentsCount
      });
    }

    console.log('Friend posts are \n', friendPosts);

    return res.render('all_friends', {
      title: 'Codeial | Friends',
      all_friends: friendPosts
    });
  } catch (err) {
    console.log('***Error*** ', err);
    res.redirect('back');
  }
};

