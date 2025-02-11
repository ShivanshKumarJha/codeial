const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');
const DEFAULT_AVATAR_PATH = process.env.DEFAULT_AVATAR_PATH;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    avatar: {
      type: String
    },

    accessToken: {
      type: String,
      default: 'abc'
    },

    isTokenValid: {
      type: Boolean,
      default: false
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }
    ],

    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
      }
    ],


    friendships: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Friendship'
      }
    ],

    address: {
      type: String
    },

    description: {
      type: String
    }
  },

  {
    timestamps: true
  }
);

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', AVATAR_PATH));
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

// Static methods
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
  'avatar'
);
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;
