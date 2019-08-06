const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'user is required']
  },
  text: {
    type: String,
    required: [true, 'text is required']
  },
  name: String,
  avatar: String,
  date: { type: Date, default: Date.now },
  likes: [
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'likes user is required']
      }
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'comments user is required']
      },
      text: {
        type: String,
        required: [true, 'text is required']
      },
      name: String,
      avatar: String,
      date: { type: Date, default: Date.now }
    }
  ]
});

const Post = mongoose.model('Post', postSchema);

module.exports = {
  Post
};
