const jwt = require('jsonwebtoken');

const extractBearerToken = (header) => header.replace('Bearer ', '');

const userAuthorization = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new Error('Необходима авторизация');
  }
  const token = extractBearerToken(auth);
  let payload;
  try {
    payload = jwt.verify(token, 'very secret');
  } catch (err) {
    throw new Error('Необходима авторизация');
  }
  req.user = payload;
  next();
};

module.exports = {
  userAuthorization,
};
