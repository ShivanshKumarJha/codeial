const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const queue = require('../config/kue');
const userEmailWorker = require('../workers/post_email_worker');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.profile = async function(request, response) {
  try {
    const user = await User.findById(request.params.id).exec();
    return response.render('user_profile', {
      title: 'User Profile',
      profile_user: user
    });
  } catch (err) {
    console.error(err);
    return response.status(500).send('Internal Server Error');
  }
};


module.exports.update = async function(req, res) {
  if (req.user.id === req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function(err) {
        if (err) {
          console.log('*****Multer Error: ', err);
        }
        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          if (user.avatar) {
            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
          }
          // this is saving the path of the uploaded file into the avatar field in the user model
          user.avatar = User.avatarPath + '/' + req.file.filename;
        }
        user.save();
        return res.redirect('back');
      });
    } catch (err) {
      req.flash('error', err);
      return res.redirect('back');
    }
  } else {
    req.flash('error', 'Unauthorized');
    return res.status(401).send('Unauthorized');
  }
};


// Render the sign-up page
module.exports.signUp = function(request, response) {
  if (request.isAuthenticated()) {
    // request.flash('success', 'Account exists!');
    return response.redirect('/users/profile');
  }
  // request.flash('success', 'Account created!');
  return response.render('user_sign_up', {
    title: 'Codeial | Sign Up'
  });
};


// Render the sign-in page
module.exports.signIn = function(request, response) {
  if (request.isAuthenticated()) {
    return response.redirect('/users/profile');
  }
  return response.render('user_sign_in', {
    title: 'Codeial | Sign In'
  });
};


// Get the sign-up data
module.exports.create = async function(request, response) {
  try {
    if (request.body.password !== request.body.confirm_password) {
      return response.redirect('back');
    }

    const existingUser = await User.findOne({ email: request.body.email });

    if (!existingUser) {
      const newUser = await User.create(request.body);

      let job = queue.create('signup-successful', newUser).save(function(err) {
        if (err) {
          console.log('Error in sending to the queue', err);
          return;
        }
        console.log('Job enqueued', job.id);
      });

      return response.redirect('/users/sign-in');
    } else return response.redirect('back');
  } catch (error) {
    req.flash('error', 'Email already exists');
    return res.redirect('back');
  }
};


// Get the sign in data and create a session
module.exports.createSession = function(req, res) {
  req.flash('success', 'Logged in Successfully');
  return res.redirect('/');
};

// to logout from the session
module.exports.destroySession = function(req, res) {
  req.logout(function(err) {
    if (err) {
      // Handle any errors that occur during logout
      console.error(err);
    }
    req.flash('success', 'You have been logged out!');
    return res.redirect('/');
  });
};

// for forget and reset password section
module.exports.resetPassword = function(req, res) {
  return res.render('reset_password', {
    title: 'Codeial | Reset Password',
    access: false
  });
};


module.exports.resetPassMail = async function(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (user.isTokenValid === false) {
        user.accessToken = crypto.randomBytes(30).toString('hex');
        user.isTokenValid = true;
        await user.save();
      }

      let job = queue.create('user-emails', user).save();
      console.log('Job enqueued', job.id);

      req.flash('success', 'Password reset link sent. Please check your email');
      return res.redirect('/');
    } else {
      req.flash('error', 'User not found. Try again!');
      return res.redirect('back');
    }
  } catch (err) {
    console.log('Error in finding user', err);
    req.flash('error', 'An error occurred. Please try again later.');
    return res.redirect('back');
  }
};


module.exports.setPassword = async function(req, res) {
  try {
    const user = await User.findOne({ accessToken: req.params.accessToken });

    if (user && user.isTokenValid) {
      return res.render('reset_password', {
        title: 'Codeial | Reset Password',
        access: true,
        accessToken: req.params.accessToken
      });
    } else {
      req.flash('error', 'Link expired');
      return res.redirect('/users/reset-password');
    }
  } catch (err) {
    console.log('Error in finding user', err);
    req.flash('error', 'An error occurred. Please try again later.');
    return res.redirect('/');
  }
};


module.exports.updatePassword = async function(req, res) {
  try {
    const user = await User.findOne({ accessToken: req.params.accessToken });

    if (user && user.isTokenValid) {
      if (req.body.newPass === req.body.confirmPass) {
        user.password = req.body.newPass;
        user.isTokenValid = false;
        await user.save();
        req.flash('success', 'Password updated. Login now!');
        return res.redirect('/users/sign-in');
      } else {
        req.flash('error', 'Passwords don\'t match');
        return res.redirect('back');
      }
    } else {
      req.flash('error', 'Link expired');
      return res.redirect('/users/reset-password');
    }
  } catch (err) {
    console.log('Error in finding user', err);
    req.flash('error', 'An error occurred. Please try again later.');
    return res.redirect('/');
  }
};
