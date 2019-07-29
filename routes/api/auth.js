const router = require('express').Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
  res.send('Auth test');
});

module.exports = router;
