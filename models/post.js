const { check, param } = require('express-validator');
const mongoose = require('mongoose');

const validatePost = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];

const validateObjectIDParams = (...paramNames) => {
  return paramNames.map(paramName =>
    param(`${paramName}`, `${paramName} is not valid ObjectID type`).isMongoId()
  );
};

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: [true, 'user is required'],
    validate: {
      validator: userId => mongoose.Types.ObjectId.isValid(userId),
      message: 'userId for user is not valid ObjectID'
    }
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
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User'
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
  Post,
  validatePost,
  validateObjectIDParams
};
