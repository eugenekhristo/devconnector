const mongoose = require('mongoose');
const { check } = require('express-validator');

const profileValidation = [
  check('status', 'Status is requried')
    .not()
    .isEmpty(),
  check('skills', 'Skills is requried')
    .not()
    .isEmpty()
];

const experienceValidator = [
  check('title', 'title is requried')
    .not()
    .isEmpty(),
  check('company', 'company is requried')
    .not()
    .isEmpty(),
  check('from')
    .not()
    .isEmpty()
    .withMessage('from is requried')
    .isISO8601()
    .withMessage('provide a valid date format')
];

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
        required: true
      },
      location: {
        type: String
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  education: [
    {
      school: {
        type: String,
        required: true
      },
      degree: {
        type: String,
        required: true
      },
      fieldofstudy: {
        type: String,
        required: true
      },
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String
      }
    }
  ],
  social: {
    youtube: {
      type: String
    },
    twitter: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    instagram: {
      type: String
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = { Profile, profileValidation, experienceValidator };
