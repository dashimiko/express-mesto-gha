const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/authorizationError');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const userAuthorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, 'very secret');
  } catch (err) {
    throw new AuthorizationError('Необходима авторизация');
  }
  req.user = payload;
  next();
};

module.exports = {
  userAuthorization,
};
