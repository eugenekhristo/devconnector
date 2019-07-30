const router = require('express').Router();
const bcrypt = require('bcryptjs');
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

// @route   POST api/auth
// @desc    Login current user and get token
// @access  Public
router.post('/', [...userLoginValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
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

    res.json({ token: user.generateJWT() });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error!');
  }
});

module.exports = router;
