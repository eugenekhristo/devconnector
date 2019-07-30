const router = require('express').Router();
const authMiddleware = require('../../middleware/auth');
const { Profile } = require('../../models/profile');

// @route   GET api/profile/me
// @desc    Get profile for current user
// @access  Private
router.get('/me', [authMiddleware], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      'name avatar'
    );

    if (!profile)
      return res
        .status(400)
        .json({ errors: [{ msg: 'There is no profile for this user!' }] });

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error. Pease try again!');
  }
});

module.exports = router;
