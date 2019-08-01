const config = require('config');

module.exports = () => {
  const mongodbUri = config.get('mongodbUri');
  if (!mongodbUri)
    throw new Error(
      '[FATAL-ERROR] Environment variable for DEVCONNECTOR_MONGODB_URI is not set!'
    );

  const secretKeyJWT = config.get('secretKeyJWT');
  if (!secretKeyJWT)
    throw new Error(
      '[FATAL-ERROR] Environment variable for DEVCONNECTOR_SECRET_KEY_JWT is not set!'
    );
};
