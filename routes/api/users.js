const router = require('express').Router();
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const _ = require('lodash');
const { User, userValidation } = require('../models/user');

// @route   POST api/users
// @desc    Register a new user
// @access  Public
router.post('/', [...userValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;

  try {
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
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error. Pease try again!');
  }
});

module.exports = router;
