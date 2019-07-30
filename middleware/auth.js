const jwt = require('jsonwebtoken');
const config = require('config');

const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(401)
      .json({ errors: [{ msg: 'Access deniend! No token provided!' }] });

  try {
    const decoded = jwt.verify(token, config.get('secretKeyJWT'));
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ errors: [{ msg: 'Invalid web token!' }] });
  }
};

module.exports = auth;
