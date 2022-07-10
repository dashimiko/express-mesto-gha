const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUser,
  getIdUser,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

const { regex } = require('../utils/constants');

router.get('/', getAllUser);

router.get('/me', getUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }).unknown(true),
}), getIdUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(regex)),
  }),
}), updateAvatar);

module.exports = router;
