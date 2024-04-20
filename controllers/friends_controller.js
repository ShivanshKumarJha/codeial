const User = require('../models/user');
const Friendship = require('../models/friendship');
const res = require('express/lib/response');

// Send a friend request
module.exports.addFriend = async function(request, response) {
  try {
    console.log('inside friend controller');
    const fromUserId = request.user.id;
    const toUserId = request.query.toUser;

    let existingFriend = await Friendship.findOne({
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

      // if (request.xhr) {
      //   return response.status(200).json({
      //     message: 'Friend request sent successfully',
      //     data: {
      //       fromUser: fromUser,
      //       toUser: toUser
      //     }
      //   });
      // }
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
    console.log('Inside remove friend module');
    const friendDelete = await Friendship.findById(request.params.id);

    if (friendDelete) {
      await Friendship.findByIdAndRemove(friendDelete);
      const userWithFriend = await User.find({ friendships: request.params.id });

      for (const user of userWithFriend) {
        user.friendships.pull(request.params.id);
        await user.save();
      }

      console.log('Removed the friend');
      // if (request.xhr) {
      //   return response.status(200).json({
      //     data: {
      //       to_user: request.params.id
      //     },
      //     message: 'Friend deleted'
      //   });
      // }
      response.redirect('back');
    }
  } catch (error) {
    console.log('error in delete friend', error);
  }
};
