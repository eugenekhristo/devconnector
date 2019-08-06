const router = require('express').Router();
const { validationResult, param } = require('express-validator');
const Acid = require('mongoose-acid');
const request = require('request');
const config = require('config');
const winston = require('winston');
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
  //TODO delete ysers posts also
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

// @route   GET api/profile/github/:username
// @desc    Get info about 5 recent github repos of a given user
// @access  Public
router.get('/github/:username', (req, res) => {
  const options = {
    uri: `https://api.github.com/users/${
      req.params.username
    }/repos?per_page=5&sort=created:asc&client_id=${config.get(
      'githubClientID'
    )}&client_secret=${config.get('githubSecret')}`,
    method: 'GET',
    headers: { 'user-agent': 'node.js' }
  };

  request(options, (error, response, body) => {
    if (error) return winston.error('', error);

    if (response.statusCode !== 200)
      return res
        .status(404)
        .json({ errors: [{ msg: 'No github user found' }] });

    res.json(JSON.parse(body));
  });
});

module.exports = router;
