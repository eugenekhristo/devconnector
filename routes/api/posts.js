const router = require('express').Router();
const { validationResult } = require('express-validator');
const authMiddleware = require('../../middleware/auth');
const {
  Post,
  validatePost,
  validateObjectIDParams
} = require('../../models/post');
const { User } = require('../../models/user');

// @route   POST api/posts
// @desc    Create a new post
// @access  Private
router.post('/', [authMiddleware, ...validatePost], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const user = await User.findById(req.user.id);
  if (!user)
    return res
      .status(401)
      .json({ errors: [{ msg: 'Access denied. User is not registered' }] });

  const post = new Post({
    user: req.user.id,
    text: req.body.text,
    name: user.name,
    avatar: user.avatar
  });

  await post.save();

  res.json(post);
});

// @route   GET api/posts
// @desc    Get all posts
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.json(posts);
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Private
router.get(
  '/:id',
  [authMiddleware, ...validateObjectIDParams('id')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await Post.findById(req.params.id);
    res.json(post);
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  [authMiddleware, ...validateObjectIDParams('id')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Post with a given id was not found' }] });

    if (post.user.toString() !== req.user.id)
      return res.status(403).json({
        errors: [
          { msg: 'Access denied. Cannot delete post of a different user' }
        ]
      });

    await post.remove();
    res.json(post);
  }
);

// @route   PUT api/posts/:id/like
// @desc    Add like on the given post
// @access  Private
router.put(
  '/:id/like',
  [authMiddleware, ...validateObjectIDParams('id')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Post with a given id was not found' }] });

    if (post.likes.some(userId => userId.toString() === req.user.id))
      return res
        .status(400)
        .json({ errors: [{ msg: 'The post already liked by the user' }] });

    post.likes.unshift(req.user.id);
    await post.save();
    res.json({ msg: 'Post is sucessfully liked' });
  }
);

// @route   PUT api/posts/:id/unlike
// @desc    Unlike back the given post
// @access  Private
router.put(
  '/:id/unlike',
  [authMiddleware, ...validateObjectIDParams('id')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Post with a given id was not found' }] });

    if (!post.likes.some(userId => userId.toString() === req.user.id))
      return res
        .status(400)
        .json({ errors: [{ msg: 'There are no likes by the user yet' }] });

    post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);

    await post.save();
    res.json({ msg: 'Post is sucessfully unliked' });
  }
);

// @route   post api/posts/:id/comments
// @desc    Unlike back the given post
// @access  Private
router.post(
  '/:id/comments',
  [authMiddleware, ...validateObjectIDParams('id')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await Post.findById(req.params.id);
    if (!post)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Post with a given id was not found' }] });

    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(401)
        .json({ errors: [{ msg: 'Access denied! Unauthenticated user!' }] });

    const newComment = {
      user: req.user.id,
      text: req.body.text,
      name: user.name,
      avatar: user.avatar
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json({ comments: post.comments });
  }
);

// @route   delete api/posts/:postId/comments/:commentId
// @desc    Delete cooment on a given post
// @access  Private
router.delete(
  '/:postId/comments/:commentId',
  [authMiddleware, ...validateObjectIDParams('postId', 'commentId')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const post = await Post.findById(req.params.postId);
    if (!post)
      return res
        .status(404)
        .json({ errors: [{ msg: 'Post with a given id was not found' }] });

    const commentToDelete = post.comments.find(
      comment => comment.id.toString() === req.params.commentId
    );
    if (!commentToDelete)
      return res
        .status(404)
        .json({ errors: [{ msg: 'No comment with a given id' }] });

    if (commentToDelete.user.toString() !== req.user.id)
      return res.status(403).json({
        errors: [{ msg: 'User cannot delete comment of a different user' }]
      });

    post.comments = post.comments.filter(
      comment => comment.id.toString() !== req.params.commentId
    );
    await post.save();
    res.json({ deletedComment: commentToDelete });
  }
);

module.exports = router;
