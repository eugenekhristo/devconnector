const router = require('express').Router();
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const _ = require('lodash');
const { User, userValidation } = require('../../models/user');
const authMiddleware = require('../../middleware/auth');

// @route   GET api/users/me
// @desc    Get current authenticated user
// @access  Private
router.get('/me', [authMiddleware], async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error!');
  }
});

// @route   POST api/users
// @desc    Register a new user
// @access  Public
router.post('/', [...userValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  // See if user exists
  let user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .json({ errors: [{ msg: `User with such an email already exists` }] });

  // Get gravatar for user
  const avatar = gravatar.url(email, {
    s: '200',
    r: 'pg',
    d: 'mm'
  });

  user = new User({ name, email, password, avatar });

  // Hash password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  await user.save();

  // Send JWT
  res
    .header('x-auth-token', user.generateJWT())
    .send(_.pick(user, ['_id', 'name', 'email', 'avatar', 'createdAt']));
});

module.exports = router;
