const router = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { check, validationResult } = require('express-validator');
const { User } = require('../../models/user');

const userLoginValidation = [
  check('email', 'Provide a valid email!').isEmail(),
  check('password')
    .exists()
    .withMessage('Password is required!')
    .isLength({
      min: 6,
      max: 255
    })
    .withMessage('Password must be more than 5 characters!')
];

// @route   GET api/auth
// @desc    If provide JWT valid - return appropriate user object
// @access  Public
router.get('/', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(401)
      .json({ errors: [{ msg: 'Access deniend! No token provided!' }] });

  try {
    const decoded = jwt.verify(token, config.get('secretKeyJWT'));
    const user = await User.findById(decoded.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ errors: [{ msg: 'Invalid web token!' }] });
  }
});

// @route   POST api/auth/login
// @desc    Login current user and get token
// @access  Public
router.post('/login', [...userLoginValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(400)
      .json({ errors: [{ msg: 'Email or password is not correct!' }] });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res
      .status(400)
      .json({ errors: [{ msg: 'Email or password is not correct!' }] });

  res.header({ 'x-auth-token': user.generateJWT() }).json({
    user: _.pick(user, ['_id', 'name', 'email', 'avatar', 'createdAt'])
  });
});

module.exports = router;
