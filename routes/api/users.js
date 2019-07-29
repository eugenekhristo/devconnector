const router = require('express').Router();
const { validationResult } = require('express-validator');
const { User, userValidation } = require('../models/user');

// @route   POST api/users
// @desc    Register a new user
// @access  Public
router.post('/', [...userValidation], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  res.send('User');
});

module.exports = router;
