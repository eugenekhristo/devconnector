const router = require('express').Router();
const { validationResult, param } = require('express-validator');
const Acid = require('mongoose-acid');
const authMiddleware = require('../../middleware/auth');
const {
  Profile,
  profileValidation,
  experienceValidator
} = require('../../models/profile');
const { User } = require('../../models/user');

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  const profiles = await Profile.find().populate('user', 'name avatar email');
  res.json(profiles);
});

// @route   GET api/profile/user/:userId
// @desc    Get profile by its id
// @access  Public
router.get(
  '/user/:userId',
  [param('userId', 'Invalid ObjectID format').isMongoId()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const user = await User.findById(req.params.userId);
    if (!user)
      return res
        .status(400)
        .json({ errors: [{ msg: 'There is no user with such an id' }] });

    const profile = await Profile.findOne({
      user: req.params.userId
    }).populate('user', 'name avatar email');

    if (!profile)
      return res.status(400).json({
        errors: [{ msg: 'There is no profile for this user!' }]
      });

    res.json(profile);
  }
);

// @route   GET api/profile/me
// @desc    Get profile for current user
// @access  Private
router.get('/me', [authMiddleware], async (req, res) => {
  const profile = await Profile.findOne({ user: req.user.id }).populate(
    'user',
    'name avatar email'
  );

  if (!profile)
    return res
      .status(400)
      .json({ errors: [{ msg: 'There is no profile for this user!' }] });

  res.json(profile);
});

// @route   POST api/profile
// @desc    Create or update current profile
// @access  Private
router.post('/', [authMiddleware, ...profileValidation], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const profileFields = {};
  profileFields.user = req.user.id;

  const {
    company,
    website,
    location,
    status,
    bio,
    githubusername,
    skills,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram
  } = req.body;

  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (status) profileFields.status = status;
  if (bio) profileFields.bio = bio;
  if (githubusername) profileFields.githubusername = githubusername;

  if (skills)
    profileFields.skills = skills.split(',').map(skill => skill.trim());

  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  let profile = await Profile.findOne({ user: req.user.id });

  // update profile
  if (profile) {
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true }
    );

    return res.send(profile);
  }

  // create new profile
  profile = new Profile(profileFields);
  await profile.save();
  res.send(profile);
});

// @route   DELETE api/profile
// @desc    Delete current profile, user and user posts
// @access  Private
router.delete('/', authMiddleware, async (req, res) => {
  await Acid(async function(session) {
    await Profile.findOneAndDelete({ user: req.user.id }, { session });
    await User.findByIdAndDelete(req.user.id, { session });
  }, this);

  res.json({ msg: 'User and their profile is deleted!' });
});

// @route   PUT api/profile/experience
// @desc    Create new experience for current user
// @access  Private
router.put(
  '/experience',
  [authMiddleware, ...experienceValidator],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile)
      return res
        .status(400)
        .json({ errors: [{ msg: 'There is no profile for this user!' }] });

    const userExperience = { ...req.body };
    profile.experience.unshift(userExperience);
    await profile.save();

    res.json(profile);
  }
);

// @route   DELETE api/profile/experience/:id
// @desc    Delete experience from profile for current user
// @access  Private
router.delete(
  '/experience/:id',
  [authMiddleware, param('id', 'Invalid ObjectID format').isMongoId()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const profile = await Profile.findOne({ user: req.user.id });
    if (!profile)
      return res
        .status(400)
        .json({ errors: [{ msg: 'There is no profile for this user!' }] });

    const experience = profile.experience.find(exp => exp.id === req.params.id);
    if (!experience)
      return res.status(400).json({
        errors: [
          { msg: 'There is no experience for this profile with such an id!' }
        ]
      });

    profile.experience = profile.experience.filter(
      exp => exp.id !== req.params.id
    );
    await profile.save();
    res.json(experience);
  }
);

module.exports = router;
